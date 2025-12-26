from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    company_name = Column(String(100), nullable=False)
    hashed_password = Column(String(225), nullable=False)

    monthly_performances = relationship(
        "MonthlyPerformance",
        back_populates="user",
        cascade="all, delete"
    )
