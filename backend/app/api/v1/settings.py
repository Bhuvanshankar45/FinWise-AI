from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...api.v1.deps import get_current_user
from ...database import get_db
from ...models import Setting, User
from ...schemas import SettingOut, SettingUpdate

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=SettingOut)
def get_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    setting = db.query(Setting).filter(Setting.user_id == current_user.id).first()
    if not setting:
        setting = Setting(user_id=current_user.id, currency="INR", theme="system", date_format="YYYY-MM-DD")
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting


@router.put("", response_model=SettingOut)
def update_settings(payload: SettingUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    setting = db.query(Setting).filter(Setting.user_id == current_user.id).first()
    if not setting:
        setting = Setting(user_id=current_user.id)
        db.add(setting)
    setting.currency = payload.currency
    setting.theme = payload.theme
    setting.date_format = payload.date_format
    db.commit()
    db.refresh(setting)
    return setting
