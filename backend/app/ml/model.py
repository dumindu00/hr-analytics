import joblib
from sklearn.linear_model import LinearRegression

MODEL_PATH = "model.joblib"

class EfficiencyModel:
    def __init__(self):
        self.model = LinearRegression()

    def train(self, df):
        X = df[['hours_worked', 'tasks_completed',
                'avg_task_difficulty', 'break_hours']]
        y = df['efficiency_score']

        self.model.fit(X, y)
        joblib.dump(self.model, MODEL_PATH)

    def predict(self, data):
        model = joblib.load(MODEL_PATH)
        return model.predict(data)
