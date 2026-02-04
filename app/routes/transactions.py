from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import SessionLocal
from app.models import Transaction, Category, User
from app.schemas import TransactionCreate, TransactionUpdate, TransactionOut
from app.dependencies.auth import get_current_user
from typing import Optional
from datetime import date

router = APIRouter(
    prefix="/transaction",
    tags=["transactions"]
)

# DB dependency
# -------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create transaction
# -------------------------
@router.post("/", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # If category is provided, verify it belongs to the user
    if transaction_in.category_id:
        category = (
            db.query(Category)
            .filter(
                Category.id == transaction_in.category_id,
                Category.user_id == current_user.id
            )
            .first()
        )
        if not category:
            raise HTTPException(status_code=400, detail="Invalid category")
        
    transaction = Transaction(
        user_id=current_user.id,
        amount=transaction_in.amount,
        date=transaction_in.date,
        description=transaction_in.description,
        category_id=transaction_in.category_id
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction

# List user transactions
# -------------------------

@router.get("/", response_model=list[TransactionOut])
def list_transactions(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    #Base query: only current user's transactions
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    )

    #Filter by date range
    if start_date:
        query = query.filter(Transaction.date >= start_date)

    if end_date:
        query = query.filter(Transaction.date <= end_date)

    #Filter by category
    if category_id:
        query = query.filter(Transaction.category_id == category_id)

    #Filter by category type
    if type:
        query = query.join(Category).filter(Category.type == type)

    return query.order_by(Transaction.date.desc()).all() 

# Delete a transaction
# -------------------------
@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = (
        db.query(Transaction)
        .filter(  #ownership-safe query
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id
        )
        .first()
    )

    if not transaction: #error control
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(transaction)
    db.commit()

# Update transaction
# -------------------------
@router.put("/{transaction_id}", response_model=TransactionOut)
def update_transaction(
    transaction_id: int,
    transaction_in: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = (
        db.query(Transaction)
        .filter(        #One query = existence + authorization
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id
        )
        .first()
    )

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # If category is provided, validate ownership
    if transaction_in.category_id is not None:
        category = (
            db.query(Category)
            .filter(
                Category.id == transaction_in.category_id,
                Category.user_id == current_user.id
            )
            .first()
        )
        if not category:
            raise HTTPException(status_code=400, detail="Invalid category")
        
        transaction.category_id = transaction_in.category_id

    #Update fields only if provided
    if transaction_in.amount is not None:
        transaction.amount = transaction_in.amount

    if transaction_in.date is not None:
        transaction.date = transaction_in.date

    if transaction_in.description is not None:
        transaction.description = transaction_in.description

    db.commit()
    db.refresh(transaction)

    return transaction

@router.get("/summary", response_model=TransactionSummary)
def transaction_summary(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    base_query = (
        db.query(Transaction)
        .join(Category)
        .filter(Transaction.user_id == current_user.id)
    )

    if start_date:
        base_query = base_query.filter(Transaction.date >= start_date)

    if end_date:
        base_query = base_query.filter(Transaction.date <= end_date)

    total_income = (
        base_query.filter(Category.type == "income")
        .with_entities(func.coalesce(func.sum(Transaction.amount), 0))
        .scalar()
    )

    total_expense = (
        base_query
        .filter(Category.type == "expense")
        .with_entities(func.coalesce(func.sum(Transaction.amount), 0)) #func.sum() --> SQL SUM(), coalesce() --> avoids NULL
        .scalar()
    )

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense
    }