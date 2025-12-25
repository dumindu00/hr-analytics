from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.employee import MonthlyPerformance
from app.models.efficiency import EfficiencyModel
import joblib
import numpy as np
import os

# Load anomaly detection model and scaler
ANOMALY_MODEL_PATH = os.path.join(os.path.dirname(__file__), "../anomaly_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "../scaler.pkl")

anomaly_model = joblib.load(ANOMALY_MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

router = APIRouter()

# Pydantic model for input data
class PerformanceData(BaseModel):
    hours_worked: int
    tasks_completed: int
    avg_task_difficulty: float
    break_hours: int
    efficiency_score: float

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Anomaly prediction endpoint
@router.post("/predict-anomaly/")
def predict_anomaly(data: PerformanceData):
    X = np.array([[data.hours_worked,
                   data.tasks_completed,
                   data.avg_task_difficulty,
                   data.break_hours,
                   data.efficiency_score]])
    X_scaled = scaler.transform(X)
    prediction = anomaly_model.predict(X_scaled)[0]
    result = "anomaly" if prediction == -1 else "normal"
    return {"prediction": result}

@router.post("/predict-efficiency/{employee_id}")
def predict_next_month(employee_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(MonthlyPerformance)
        .filter(MonthlyPerformance.employee_id == employee_id)
        .order_by(MonthlyPerformance.month.desc())
        .limit(6)
        .all()
    )

    if not records:
        raise HTTPException(status_code=404, detail="No data for this employee")

    latest = records[0]

    model = EfficiencyModel()

    X = [[
        latest.hours_worked,
        latest.tasks_completed,
        latest.avg_task_difficulty,
        latest.break_hours
    ]]

    predicted_score = model.model.predict(X)[0]
    next_month = (latest.month % 12) + 1

    return {
        "employee_id": employee_id,
        "predicted_efficiency": round(float(predicted_score), 2),
        "next_month": next_month
    }