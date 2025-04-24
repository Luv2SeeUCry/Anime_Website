import schedule
import time
from anime_updater import AnimeUpdater
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_job():
    try:
        updater = AnimeUpdater()
        updater.run_update()
        logger.info("Successfully updated anime data")
    except Exception as e:
        logger.error(f"Error updating anime data: {e}")

# Run every hour
schedule.every(1).hour.do(update_job)

if __name__ == "__main__":
    logger.info("Starting anime updater service...")
    update_job()  # Run immediately on start
    
    while True:
        schedule.run_pending()
        time.sleep(60)