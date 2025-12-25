from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class MonthlyPerformance(Base):
    __tablename__ = "monthly_performance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    employee_id = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)

    hours_worked = Column(Integer)
    tasks_completed = Column(Integer)
    avg_task_difficulty = Column(Float)
    break_hours = Column(Integer)
    efficiency_score = Column(Float)

    user = relationship("User", back_populates="monthly_performances")
