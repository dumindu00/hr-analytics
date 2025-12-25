# create_tables.py
from app.database import Base, engine
from app.models.user import User
from app.models.employee import MonthlyPerformance

# This will create all tables that don't exist yet
Base.metadata.create_all(bind=engine)

print("Tables created successfully!")
