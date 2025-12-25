from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.models.user import User
from app.database import SessionLocal
from app.core.security import hashed_password, verify_password, create_access_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=UserOut)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = hashed_password(user.password)

    new_user = User(
        username=user.username,
        company_name=user.company_name,
        hashed_password=hashed_pw  # ✅ FIXED
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"user_id": user.id, "username": user.username})

    # Return both user and token in JSON
    response_data = {
        "user": {
            "id": user.id,
            "username": user.username,
            "company_name": user.company_name
        },
        "token": token
    }

    response = JSONResponse(content=response_data)
    # Optional: set cookie as well
    response.set_cookie(key="access_token", value=token, httponly=True, samesite="strict")
    return response


@router.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie(key="access_token")
    return response
