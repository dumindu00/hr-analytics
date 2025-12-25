from app.database import engine, Base
from app.models.employee import MonthlyPerformance  # IMPORTANT: import model

def init():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")

if __name__ == "__main__":
    init()
