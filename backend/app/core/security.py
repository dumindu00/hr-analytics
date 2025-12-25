from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
import jwt
import os

# =========================
# JWT configuration
# =========================

SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET is not set in environment variables")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# =========================
# Password hashing
# =========================

# Use argon2 to avoid bcrypt 72-byte limit
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hashed_password(password: str) -> str:
    """
    Hash a password safely using Argon2.
    """
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    """
    Verify a plaintext password against an Argon2 hash.
    """
    try:
        return pwd_context.verify(password, hashed)
    except Exception:
        return False

# =========================
# JWT creation
# =========================

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT access token with optional expiration.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
