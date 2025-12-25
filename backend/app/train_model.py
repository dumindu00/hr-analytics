import pandas as pd
from sqlalchemy import create_engine
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
import joblib

# 1. Connect to MySQL
DATABASE_URL = "mysql+pymysql://hr_user:hrpassword123@localhost/hr_analytics"
engine = create_engine(DATABASE_URL)

# 2. Fetch all data from monthly_performance table
df = pd.read_sql("SELECT * FROM monthly_performance", engine)
print("Data fetched from MySQL:")
print(df.head())

# 3. Select features for ML
features = ["hours_worked", "tasks_completed", "avg_task_difficulty", "break_hours", "efficiency_score"]
X = df[features]

# 4. Scale data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 5. Train Isolation Forest for anomaly detection
model = IsolationForest(contamination=0.1, random_state=42)
model.fit(X_scaled)

# 6. Predict anomalies and add to dataframe
df['anomaly'] = model.predict(X_scaled)
print("\nAnomalies found (-1 = anomaly):")
print(df[df['anomaly'] == -1])

# 7. Save model and scaler for FastAPI use
joblib.dump(model, "app/anomaly_model.pkl")
joblib.dump(scaler, "app/scaler.pkl")

print("\nModel and scaler saved successfully!")
