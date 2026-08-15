from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...api.v1.deps import create_access_token, get_current_user
from ...database import get_db
from ...models import Setting, User
from ...schemas import Token, UserCreate, UserLogin, UserOut
from ...services.security import get_password_hash, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user = User(name=payload.name.strip(), email=payload.email.lower(), password_hash=get_password_hash(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    setting = Setting(user_id=user.id, currency="INR", theme="system", date_format="YYYY-MM-DD")
    db.add(setting)
    db.commit()
    return user


@router.post("/login", response_model=Token)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_access_token(user.email)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def current_user_detail(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout_user():
    return {"message": "Logged out successfully."}
