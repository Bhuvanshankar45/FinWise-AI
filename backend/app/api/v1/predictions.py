from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...api.v1.deps import get_current_user
from ...database import get_db
from ...ml.savings_model import predict_next_months, train_and_serialize_model
from ...models import Prediction, User
from ...schemas import PredictionInput, PredictionOut

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.post("/savings", response_model=PredictionOut)
def generate_savings_prediction(payload: PredictionInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    training_result = train_and_serialize_model(db, current_user.id)
    projection = predict_next_months(payload.model_dump())
    prediction = Prediction(
        user_id=current_user.id,
        model_name=training_result["model_name"],
        prediction=projection,
        prediction_period="12 months",
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return {
        "model_name": prediction.model_name,
        "prediction": prediction.prediction,
        "prediction_period": prediction.prediction_period,
        "created_at": prediction.created_at,
    }


@router.get("/history", response_model=list[PredictionOut])
def prediction_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Prediction).filter(Prediction.user_id == current_user.id).order_by(Prediction.created_at.desc()).all()
    return [{
        "model_name": row.model_name,
        "prediction": row.prediction,
        "prediction_period": row.prediction_period,
        "created_at": row.created_at,
    } for row in rows]
