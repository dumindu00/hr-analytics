from apscheduler.schedulers.background import BackgroundScheduler
from app.train_efficiency_model import main as retrain_model
import logging

logging.basicConfig(level=logging.INFO)

scheduler = BackgroundScheduler()

def start_scheduler():
    scheduler.add_job(
        retrain_model,
        trigger="cron",
        hour=2,        # 2 AM
        minute=0,
        id="efficiency_model_retrain",
        replace_existing=True,
    )
    scheduler.start()
    logging.info("Efficiency model retraining scheduler started")
