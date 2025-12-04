"""
Celery Beat Schedule Configuration
Handles periodic tasks like appointment reminders.

Add to your Celery app configuration.
"""

from celery.schedules import crontab

# Celery Beat Schedule
CELERYBEAT_SCHEDULE = {
    # Send reminders every 30 minutes
    "send-appointment-reminders": {
        "task": "app.tasks.notifications.send_appointment_reminders",
        "schedule": crontab(minute="*/30"),  # Every 30 minutes
    },
    # Check for no-shows every hour
    "check-no-shows": {
        "task": "app.tasks.notifications.check_no_shows",
        "schedule": crontab(minute=0),  # Every hour at :00
    },
    # Daily summary for doctors at 7 AM
    "send-daily-summary": {
        "task": "app.tasks.notifications.send_daily_summary",
        "schedule": crontab(hour=7, minute=0),  # 7:00 AM daily
    },
}
