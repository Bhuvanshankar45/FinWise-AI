from __future__ import annotations

from collections import defaultdict
from datetime import datetime

from sqlalchemy.orm import Session

from ..models import Goal, Transaction, User


def safe_percentage(numerator: float, denominator: float) -> float:
    if denominator in (None, 0):
        return 0.0
    return round((numerator / denominator) * 100, 2)


def get_total_income(db: Session, user_id: int) -> float:
    return float(
        db.query(sum(Transaction.amount)).filter(Transaction.user_id == user_id, Transaction.type == "income").scalar() or 0
    )


def get_total_expenses(db: Session, user_id: int) -> float:
    return float(
        db.query(sum(Transaction.amount)).filter(Transaction.user_id == user_id, Transaction.type == "expense").scalar() or 0
    )


def get_monthly_history(db: Session, user_id: int):
    rows = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.transaction_date.asc()).all()
    monthly = defaultdict(lambda: {"income": 0.0, "expense": 0.0, "savings": 0.0})
    for tx in rows:
        month_key = tx.transaction_date.strftime("%Y-%m")
        if tx.type == "income":
            monthly[month_key]["income"] += tx.amount
        else:
            monthly[month_key]["expense"] += tx.amount
    result = []
    for month, values in sorted(monthly.items()):
        values["savings"] = values["income"] - values["expense"]
        result.append({"period": month, "income": round(values["income"], 2), "expense": round(values["expense"], 2), "savings": round(values["savings"], 2)})
    return result


def get_category_breakdown(db: Session, user_id: int):
    rows = db.query(Transaction).filter(Transaction.user_id == user_id, Transaction.type == "expense").all()
    grouped = defaultdict(float)
    for tx in rows:
        grouped[tx.category] += tx.amount
    return [{"category": category, "value": round(amount, 2)} for category, amount in sorted(grouped.items(), key=lambda item: item[1], reverse=True)]


def calculate_financial_health(db: Session, user_id: int) -> dict:
    income = get_total_income(db, user_id)
    expenses = get_total_expenses(db, user_id)
    savings = max(income - expenses, 0.0)
    savings_rate = safe_percentage(savings, income)
    expense_ratio = safe_percentage(expenses, income)
    goal_progress = 0.0
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    if goals:
        weighted = []
        for goal in goals:
            if goal.target_amount > 0:
                weighted.append(min(goal.current_amount / goal.target_amount, 1.0))
        goal_progress = round(sum(weighted) / len(weighted) * 100, 2) if weighted else 0.0

    emergency_buffer = 0.0
    emergency_found = sum(tx.amount for tx in db.query(Transaction).filter(Transaction.user_id == user_id, Transaction.category == "Bills").all())
    emergency_buffer = max(emergency_found, 0.0)
    spending_consistency = 100.0
    if income:
        spending_consistency = max(0.0, min(100.0, 100 - (expense_ratio * 0.7)))

    score = int(round((savings_rate * 0.45) + (goal_progress * 0.25) + (spending_consistency * 0.3) + min(emergency_buffer / max(income, 1), 25) * 0.05))
    score = max(0, min(100, score))

    if score >= 80:
        status = "Strong"
    elif score >= 60:
        status = "Stable"
    elif score >= 40:
        status = "Watchlist"
    else:
        status = "Needs attention"

    return {
        "score": score,
        "status": status,
        "breakdown": {
            "Savings": round(min(savings_rate, 100), 2),
            "Expenses": round(max(100 - expense_ratio, 0), 2),
            "Goals": round(goal_progress, 2),
            "Consistency": round(spending_consistency, 2),
        },
    }


def get_dashboard_summary(db: Session, user_id: int) -> dict:
    income = get_total_income(db, user_id)
    expenses = get_total_expenses(db, user_id)
    savings = income - expenses
    health = calculate_financial_health(db, user_id)
    savings_rate = safe_percentage(savings, income)
    metrics = [
        {"label": "Income", "value": f"₹{income:,.0f}", "change": "N/A", "type": "neutral"},
        {"label": "Expenses", "value": f"₹{expenses:,.0f}", "change": "N/A", "type": "warning"},
        {"label": "Savings", "value": f"₹{savings:,.0f}", "change": "N/A", "type": "positive"},
        {"label": "Savings Rate", "value": f"{savings_rate:.1f}%", "change": "N/A", "type": "positive"},
        {"label": "Health Score", "value": f"{health['score']}/100", "change": health['status'], "type": "neutral"},
    ]
    return {
        "total_income": round(income, 2),
        "total_expenses": round(expenses, 2),
        "current_savings": round(savings, 2),
        "savings_rate": round(savings_rate, 2),
        "financial_health_score": health["score"],
        "metrics": metrics,
        "trend": {"up": savings_rate >= 20, "label": "Based on current recorded activity"},
    }


def get_analytics_data(db: Session, user_id: int):
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.transaction_date.asc()).all()
    monthly = get_monthly_history(db, user_id)
    if not monthly:
        return {"average_monthly_income": 0.0, "average_monthly_expense": 0.0, "average_savings": 0.0, "savings_rate": 0.0, "highest_expense_category": "N/A", "largest_transaction": 0.0, "month_with_highest_spending": "N/A", "monthly_data": [], "category_data": []}

    income_months = [item["income"] for item in monthly]
    expense_months = [item["expense"] for item in monthly]
    savings_months = [item["savings"] for item in monthly]
    category_totals = defaultdict(float)
    for tx in transactions:
        if tx.type == "expense":
            category_totals[tx.category] += tx.amount
    largest_tx = max(tx.amount for tx in transactions) if transactions else 0.0
    highest_category = max(category_totals.items(), key=lambda item: item[1])[0] if category_totals else "N/A"
    month_high = max(monthly, key=lambda item: item["expense"]) if monthly else {"period": "N/A", "expense": 0}
    return {
        "average_monthly_income": round(sum(income_months) / len(income_months), 2),
        "average_monthly_expense": round(sum(expense_months) / len(expense_months), 2),
        "average_savings": round(sum(savings_months) / len(savings_months), 2),
        "savings_rate": round(safe_percentage(sum(savings_months), sum(income_months)), 2),
        "highest_expense_category": highest_category,
        "largest_transaction": round(largest_tx, 2),
        "month_with_highest_spending": month_high["period"],
        "monthly_data": monthly,
        "category_data": [{"category": category, "value": round(value, 2)} for category, value in sorted(category_totals.items(), key=lambda item: item[1], reverse=True)],
    }


def get_insights(db: Session, user_id: int):
    monthly = get_monthly_history(db, user_id)
    results = []
    if len(monthly) >= 2:
        last = monthly[-1]
        prev = monthly[-2]
        if last["expense"] > prev["expense"]:
            increase = round(((last["expense"] - prev["expense"]) / max(prev["expense"], 1)) * 100, 2)
            results.append({
                "title": "Spending Insight",
                "description": f"Your spending increased by {increase}% compared with the previous month.",
                "type": "spending",
                "value": f"₹{last['expense'] - prev['expense']:+,.0f}"
            })
        if last["savings"] > prev["savings"]:
            results.append({
                "title": "Savings Insight",
                "description": "Your savings rate improved based on your recent transaction history.",
                "type": "savings",
                "value": f"₹{last['savings'] - prev['savings']:+,.0f}"
            })
    if not results:
        results.append({
            "title": "Financial Snapshot",
            "description": "Add a few transactions to unlock richer insights and trend analysis.",
            "type": "neutral",
            "value": "Waiting for data"
        })
    return results
