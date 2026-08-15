from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...api.v1.deps import get_current_user
from ...database import get_db
from ...models import User
from ...services.finance_service import get_insights

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("")
def list_insights(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_insights(db, current_user.id)
