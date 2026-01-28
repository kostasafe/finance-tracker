from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Transaction, Category, User
from app.schemas import TransactionCreate, TransactionOut
from app.dependencies.auth import get_current_user

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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .order_by(Transaction.date.desc())
        .all()
    )

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
        transaction.date = transaction_id.date

    if transaction_in.description is not None:
        transaction.description = transaction_in.description

    db.commit()
    db.refresh(transaction)

    return transaction