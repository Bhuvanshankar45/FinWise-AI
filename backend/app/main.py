from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from .api.v1.analytics import router as analytics_router
from .api.v1.auth import router as auth_router
from .api.v1.goals import router as goals_router
from .api.v1.insights import router as insights_router
from .api.v1.predictions import router as predictions_router
from .api.v1.reports import router as reports_router
from .api.v1.risk import router as risk_router
from .api.v1.settings import router as settings_router
from .api.v1.transactions import router as transactions_router
from .api.v1.users import router as users_router
from .core.config import settings
from .database import Base, engine, get_db
from .models import Setting, Transaction, User
from .services.security import get_password_hash


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with Session(bind=engine) as db:
        existing = db.query(User).filter_by(email="demo@finwise.ai").first()
        if not existing:
            user = User(
                name="Demo User",
                email="demo@finwise.ai",
                password_hash=get_password_hash("demo1234"),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            db.add(Setting(user_id=user.id, currency="INR", theme="system", date_format="YYYY-MM-DD"))
            demo_transactions = [
                ("income", 28000, "Salary", "Monthly salary", "2025-01-01"),
                ("expense", 7000, "Food", "Groceries", "2025-01-03"),
                ("expense", 3500, "Housing", "Rent", "2025-01-05"),
                ("expense", 2200, "Transportation", "Fuel", "2025-01-08"),
                ("income", 5000, "Other", "Freelance project", "2025-02-02"),
                ("expense", 6000, "Bills", "Internet and utilities", "2025-02-06"),
                ("expense", 4000, "Shopping", "Home essentials", "2025-02-11"),
                ("expense", 1500, "Entertainment", "Streaming", "2025-03-09"),
                ("income", 28000, "Salary", "Monthly salary", "2025-03-01"),
                ("expense", 7800, "Food", "Dining out", "2025-03-14"),
                ("expense", 4300, "Education", "Course fee", "2025-04-06"),
                ("expense", 3200, "Healthcare", "Pharmacy", "2025-04-12"),
                ("income", 28000, "Salary", "Monthly salary", "2025-05-01"),
                ("expense", 8300, "Food", "Groceries", "2025-05-04"),
                ("expense", 3600, "Transportation", "Commute", "2025-05-08"),
                ("income", 30000, "Salary", "Monthly salary", "2025-06-01"),
                ("expense", 9400, "Food", "Groceries", "2025-06-03"),
                ("expense", 4600, "Housing", "Rural maintenance", "2025-06-15"),
            ]
            for tx_type, amount, category, description, date_value in demo_transactions:
                db.add(
                    Transaction(
                        user_id=user.id,
                        type=tx_type,
                        amount=amount,
                        category=category,
                        description=description,
                        transaction_date=datetime.strptime(date_value, "%Y-%m-%d").date(),
                    )
                )
            db.commit()
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.backend_cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(transactions_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(goals_router, prefix="/api/v1")
app.include_router(predictions_router, prefix="/api/v1")
app.include_router(risk_router, prefix="/api/v1")
app.include_router(settings_router, prefix="/api/v1")
app.include_router(insights_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")


@app.get("/health")
def healthz():
    return {"status": "ok", "service": settings.app_name}
