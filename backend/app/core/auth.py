import os
import jwt
from fastapi import HTTPException, Request
from passlib.context import CryptContext
from app.models.user import User
from app.database import SessionLocal

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password hashing
def hashed_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# Get current user from cookie
def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    db = SessionLocal()
    user = db.query(User).filter(User.id == payload["user_id"]).first()
    db.close()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
