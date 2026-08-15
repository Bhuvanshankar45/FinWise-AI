from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...api.v1.deps import get_current_user
from ...database import get_db
from ...models import Goal, User
from ...schemas import GoalCreate, GoalOut

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("", response_model=list[GoalOut])
def list_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Goal).filter(Goal.user_id == current_user.id).order_by(Goal.created_at.desc()).all()


@router.post("", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
def create_goal(payload: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = Goal(
        user_id=current_user.id,
        name=payload.name.strip(),
        target_amount=float(payload.target_amount),
        current_amount=float(payload.current_amount),
        target_date=payload.target_date,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.put("/{goal_id}", response_model=GoalOut)
def update_goal(goal_id: int, payload: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found.")
    goal.name = payload.name.strip()
    goal.target_amount = float(payload.target_amount)
    goal.current_amount = float(payload.current_amount)
    goal.target_date = payload.target_date
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found.")
    db.delete(goal)
    db.commit()
    return None
