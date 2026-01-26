from pydantic import BaseModel, EmailStr, constr, condecimal
from typing import Optional, List
from datetime import date

# USER SCHEMAS
# =========================

class UserCreate(BaseModel):
    username: constr(min_length=3, max_length=64)
    email: EmailStr
    password: constr(min_length=6)

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserOut(BaseModel): #Schema returned to the client when we expose user data.
    id:int                #NEVER includes password.
    username: str
    email: str


    class Config:
        from_attributes = True # lets Pydantic read SQLAlchemy models
    
class Token(BaseModel): # Schema for JWT token response.
    access_token: str
    token_type: str = "bearer"

# CATEGORY SCHEMAS
# =========================

class CategoryBase(BaseModel): # Shared fields for Category. Used as a base class.
    name: str
    type: str # "income" or "expense"

class CategoryCreate(CategoryBase): #Schema used when creating a new category. Inherits fields from CategoryBase.
    pass

class CategoryOut(CategoryBase): #Schema returned when reading category data. Includes database-generated ID.
    id: int

    class Config:
        from_attributes = True


# Transaction base
# -------------------------
class TransactionBase(BaseModel):
    amount: condecimal(max_digits=12, decimal_places=2)
    date: date
    description: Optional[str] = None
    category_id: Optional[int] = None

# Create transaction
# -------------------------
class TransactionCreate(TransactionBase):
    pass

# Transaction output
# -------------------------
class TransactionOut(TransactionBase):
    id:int

    class Config:
        from_attributes = True