from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models
from app.db import SessionLocal
from app.schemas import UserCreate, UserOut
from app.security import hash_password, verify_password


router = APIRouter(prefix="/auth", tags=["auth"])

# simple dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db:Session = Depends(get_db)):
    # check if username or email exists
    existing = db.query(models.User).filter(
        (models.User.username == user_in.username) | (models.User.email == user_in.email)
    )
    if existing:
        raise HTTPException(status_code=400, detail="username or email already taken")
    
    user = models.User(
        username=user_in.username,
        email=user_in.email,
        password_hash=hash_password(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login")
def login(data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message" : "login successful"}