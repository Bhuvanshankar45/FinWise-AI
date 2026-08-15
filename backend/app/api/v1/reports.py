from io import BytesIO

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from sqlalchemy.orm import Session

from ...api.v1.deps import get_current_user
from ...database import get_db
from ...models import User
from ...schemas import ReportRequest
from ...services.finance_service import get_analytics_data, get_dashboard_summary

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("")
def get_report(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    summary = get_dashboard_summary(db, current_user.id)
    analytics = get_analytics_data(db, current_user.id)
    return {
        "user_name": current_user.name,
        "report_period": "last_6_months",
        "summary": summary,
        "metrics": analytics,
        "disclaimer": "FinWise AI provides educational financial insights and analytical projections. It is not a substitute for professional financial, investment, tax, or legal advice.",
    }


@router.post("/generate")
def generate_report(payload: ReportRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    summary = get_dashboard_summary(db, current_user.id)
    analytics = get_analytics_data(db, current_user.id)
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    story = [
        Paragraph("FinWise AI Financial Report", style={"fontName": "Helvetica-Bold", "fontSize": 20}),
        Spacer(1, 14),
        Paragraph(f"Prepared for: {current_user.name}"),
        Paragraph(f"Reporting period: {payload.period}"),
        Spacer(1, 12),
    ]
    data = [
        ["Metric", "Value"],
        ["Income", f"₹{summary['total_income']:,.0f}"],
        ["Expenses", f"₹{summary['total_expenses']:,.0f}"],
        ["Savings", f"₹{summary['current_savings']:,.0f}"],
        ["Savings Rate", f"{summary['savings_rate']:.1f}%"],
        ["Financial Health", f"{summary['financial_health_score']}/100"],
        ["Highest Expense Category", analytics["highest_expense_category"]],
    ]
    table = Table(data, colWidths=[180, 200])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
        ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
    ]))
    story.append(table)
    story.append(Spacer(1, 18))
    story.append(Paragraph("Educational disclaimer: FinWise AI provides educational financial insights and analytical projections. It is not a substitute for professional financial, investment, tax, or legal advice."))
    doc.build(story)
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=finwise-report.pdf"})
