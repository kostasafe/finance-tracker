from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models
from app.db import SessionLocal
from app.schemas import UserCreate, UserOut, UserLogin
from app.security import hash_password, verify_password, create_access_token
from datetime import timedelta
from app.dependencies.auth import get_current_user
from app.models import User


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
    # check if username exists
    if db.query(models.User).filter(models.User.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
     # check email ONLY if provided
    if user_in.email:
        if db.query(models.User).filter(models.User.email == user_in.email).first():
            raise HTTPException(status_code=400, detail="Email already taken")

    # create user
    user = models.User(
        username=user_in.username,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(
        (models.User.username == form_data.username) 
        | (models.User.email == form_data.username)
    ).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})

    return {
            "access_token": access_token,
            "token_type": "bearer"
           }

@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return{
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at,
    }