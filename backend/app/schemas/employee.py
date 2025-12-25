from pydantic import BaseModel


class MonthlyPerformanceCreate(BaseModel):
    employee_id: int
    month: int
    hours_worked: int
    tasks_completed: int
    avg_task_difficulty: float
    break_hours: int
    efficiency_score: float
