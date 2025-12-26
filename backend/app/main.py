from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import employee, predict, auth
from app.retrain_scheduler import start_scheduler
from contextlib import asynccontextmanager
from app.database import Base, engine  # <-- import Base and engine
from app.models.user import User        # <-- import User model
from app.models.employee import MonthlyPerformance  # <-- import Employee model
import os
# Lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    start_scheduler()  # start the retraining scheduler

    # ✅ Create tables if they do not exist
    Base.metadata.create_all(bind=engine)

    yield
    # Shutdown code (if needed)
    print("Application shutting down")

# Create FastAPI app with lifespan
app = FastAPI(title="HR Analytics System", lifespan=lifespan)

# CORS configuration for React frontend

# frontend_url = os.getenv("FRONTEND_URL", "https://*.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(employee.router)
app.include_router(predict.router)
app.include_router(auth.router)


# Root endpoint
@app.get("/")
def root():
    return {"status": "HR Analytics Backend Running"}
