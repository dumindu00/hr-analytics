import joblib
from pathlib import Path

class EfficiencyModel:
    def __init__(self):
        base_dir = Path(__file__).resolve().parent.parent
        model_path = base_dir / "model.joblib"

        if not model_path.exists():
            raise FileNotFoundError(f"Efficiency model not found at {model_path}")

        self.model = joblib.load(model_path)
