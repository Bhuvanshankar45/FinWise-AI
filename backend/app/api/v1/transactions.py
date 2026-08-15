from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ...api.v1.deps import get_current_user
from ...database import get_db
from ...models import Transaction, User
from ...schemas import TransactionCreate, TransactionOut, TransactionUpdate

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionOut])
def list_transactions(
    category: str | None = None,
    tx_type: str | None = None,
    search: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    if category:
        query = query.filter(Transaction.category == category)
    if tx_type:
        query = query.filter(Transaction.type == tx_type)
    if search:
        q = f"%{search.lower()}%"
        query = query.filter(Transaction.description.ilike(q))
    query = query.order_by(Transaction.transaction_date.desc(), Transaction.id.desc())
    skip = (page - 1) * page_size
    rows = query.offset(skip).limit(page_size).all()
    return rows


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = Transaction(
        user_id=current_user.id,
        type=payload.type.lower(),
        amount=float(payload.amount),
        category=payload.category.title(),
        description=payload.description.strip(),
        transaction_date=payload.transaction_date,
    )
    if transaction.type not in {"income", "expense"}:
        raise HTTPException(status_code=400, detail="Type must be income or expense.")
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.put("/{transaction_id}", response_model=TransactionOut)
def update_transaction(
    transaction_id: int,
    payload: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    transaction.type = payload.type.lower()
    transaction.amount = float(payload.amount)
    transaction.category = payload.category.title()
    transaction.description = payload.description.strip()
    transaction.transaction_date = payload.transaction_date
    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    db.delete(transaction)
    db.commit()
    return None
