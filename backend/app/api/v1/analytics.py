from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...api.v1.deps import get_current_user
from ...database import get_db
from ...models import User
from ...services.finance_service import get_analytics_data, get_dashboard_summary

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary")
def analytics_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_dashboard_summary(db, current_user.id)


@router.get("/categories")
def expense_categories(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_analytics_data(db, current_user.id)["category_data"]


@router.get("/trends")
def spending_trends(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    payload = get_analytics_data(db, current_user.id)
    return {"monthly_data": payload["monthly_data"]}
