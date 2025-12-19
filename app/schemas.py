from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import date

class UserCreate(BaseModel):
    username: constr(min_length=3, max_length=64)
    email: EmailStr
    password: constr(min_length=6)

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserOut(BaseModel):
    id:int
    username: str
    email: str


    class Config:
        from_attributes = True #lets Pydantic read SQLAlchemy models
    

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
