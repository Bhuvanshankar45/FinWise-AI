from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...api.v1.deps import get_current_user
from ...database import get_db
from ...models import RiskAssessment, User
from ...schemas import RiskAssessmentOut, RiskQuestionnaire

router = APIRouter(prefix="/risk", tags=["risk"])


@router.post("/assessment", response_model=RiskAssessmentOut)
def submit_risk_assessment(payload: RiskQuestionnaire, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    responses = payload.model_dump()
    score = int(sum(responses.values()) * 4)
    if score >= 90:
        category = "Conservative"
    elif score >= 70:
        category = "Moderate"
    else:
        category = "Growth-oriented"
    assessment = RiskAssessment(user_id=current_user.id, score=score, category=category, responses=responses)
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


@router.get("/latest", response_model=RiskAssessmentOut | None)
def latest_assessment(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(RiskAssessment).filter(RiskAssessment.user_id == current_user.id).order_by(RiskAssessment.created_at.desc()).first()
