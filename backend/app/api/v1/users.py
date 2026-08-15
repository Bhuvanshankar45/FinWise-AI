from fastapi import APIRouter, Depends

from ...api.v1.deps import get_current_user
from ...models import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at,
    }
