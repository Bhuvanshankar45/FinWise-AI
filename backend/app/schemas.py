from __future__ import annotations

from datetime import date, datetime
from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TransactionCreate(BaseModel):
    type: str
    amount: float
    category: str
    description: str
    transaction_date: date


class TransactionUpdate(TransactionCreate):
    pass


class TransactionOut(BaseModel):
    id: int
    user_id: int
    type: str
    amount: float
    category: str
    description: str
    transaction_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    target_date: date


class GoalOut(BaseModel):
    id: int
    user_id: int
    name: str
    target_amount: float
    current_amount: float
    target_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RiskQuestionnaire(BaseModel):
    income_stability: int = Field(..., ge=1, le=5)
    savings_consistency: int = Field(..., ge=1, le=5)
    emergency_savings: int = Field(..., ge=1, le=5)
    time_horizon: int = Field(..., ge=1, le=5)
    financial_experience: int = Field(..., ge=1, le=5)
    market_fluctuation_response: int = Field(..., ge=1, le=5)


class RiskAssessmentOut(BaseModel):
    id: int
    user_id: int
    score: int
    category: str
    responses: dict[str, int]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PredictionInput(BaseModel):
    monthly_income: float
    monthly_expenses: float
    current_savings: float
    monthly_savings: float
    historical_savings: List[float] = Field(default_factory=list)
    goal_amount: Optional[float] = None
    time_period: Optional[int] = 12


class PredictionOut(BaseModel):
    model_name: str
    prediction: dict[str, float]
    prediction_period: str
    created_at: datetime | None = None


class SettingUpdate(BaseModel):
    currency: str = "INR"
    theme: str = "system"
    date_format: str = "YYYY-MM-DD"


class SettingOut(BaseModel):
    id: int
    user_id: int
    currency: str
    theme: str
    date_format: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SummaryMetric(BaseModel):
    label: str
    value: str
    change: Optional[str] = None
    type: Optional[str] = None


class DashboardSummary(BaseModel):
    total_income: float
    total_expenses: float
    current_savings: float
    savings_rate: float
    financial_health_score: int
    metrics: List[SummaryMetric]
    trend: dict[str, Any]


class ReportRequest(BaseModel):
    period: str = "last_6_months"


class Insight(BaseModel):
    title: str
    description: str
    type: str
    value: Optional[str] = None
