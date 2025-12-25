import os
import pandas as pd
from sqlalchemy import create_engine
from xgboost import XGBRegressor
import joblib

def main():
    # Database connection
    DATABASE_URL = "mysql+pymysql://hr_user:hrpassword123@localhost/hr_analytics"
    engine = create_engine(DATABASE_URL)

    # Load data
    df = pd.read_sql("SELECT * FROM monthly_performance", engine)

    # Safety check
    if df.shape[0] < 20:
        raise Exception("Not enough data to train efficiency model")

    # Features and target
    X = df[
        [
            "hours_worked",
            "tasks_completed",
            "avg_task_difficulty",
            "break_hours",
        ]
    ]

    y = df["efficiency_score"]

    # Train XGBoost model
    model = XGBRegressor(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
    )

    model.fit(X, y)

    # Ensure app folder exists
    os.makedirs("app", exist_ok=True)

    # Save model inside backend/app/model.joblib
    joblib.dump(model, os.path.join("app", "model.joblib"))

    print("XGBoost efficiency model trained and saved successfully at app/model.joblib")


if __name__ == "__main__":
    main()
