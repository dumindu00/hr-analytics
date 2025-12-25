from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.employee import MonthlyPerformanceCreate
from app.models.employee import MonthlyPerformance
from app.core.auth import get_current_user
from app.models.user import User  # for type hinting

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Get monthly performance
@router.get("/monthly-performance/")
def get_monthly_performance(
    month: int = Query(None, description="Optional month filter (1-12)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(MonthlyPerformance).filter(MonthlyPerformance.user_id == current_user.id)
    if month:
        query = query.filter(MonthlyPerformance.month == month)
    return query.all()


# Create monthly performance (accept both slashes)
@router.post("/monthly-performance")
@router.post("/monthly-performance/")
def create_performance(
    data: MonthlyPerformanceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = MonthlyPerformance(**data.dict(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"message": "Monthly performance created", "id": record.id}


# Delete monthly performance
@router.delete("/monthly-performance/{id}")
def delete_performance(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(MonthlyPerformance)
        .filter(MonthlyPerformance.id == id, MonthlyPerformance.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Record not found or not yours")
    db.delete(record)
    db.commit()
    return {"message": f"Record {id} deleted successfully"}


# Employee trend
@router.get("/monthly-performance/trend/{employee_id}")
def get_employee_trend(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records = (
        db.query(MonthlyPerformance)
        .filter(
            MonthlyPerformance.employee_id == employee_id,
            MonthlyPerformance.user_id == current_user.id,
        )
        .order_by(MonthlyPerformance.month)
        .all()
    )

    return [
        {
            "month": r.month,
            "efficiency_score": r.efficiency_score,
            "hours_worked": r.hours_worked,
            "tasks_completed": r.tasks_completed,
            "avg_task_difficulty": r.avg_task_difficulty,
            "break_hours": r.break_hours,
        }
        for r in records
    ]
