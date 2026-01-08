from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models
from app.db import SessionLocal
from app.schemas import UserCreate, UserOut, UserLogin
from app.security import hash_password, verify_password, create_access_token
from datetime import timedelta


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
    existing_username = (
        db.query(models.User)
        .filter(models.User.username == user_in.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="username already taken"
        )

    # check email ONLY if provided
    if user_in.email:
        existing_email = (
            db.query(models.User)
            .filter(models.User.email == user_in.email)
            .first()
        )
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="email already taken"
            )

    # create user
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
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        (models.User.username == data.identifier) |
        (models.User.email == data.identifier)
    ).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(user.id)})

    return {
            "access_token": access_token,
            "token_type": "bearer"
           }