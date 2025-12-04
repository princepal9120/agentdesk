"""
Celery Task Queue Configuration
TRS Reference: Section 2.1 - Celery + Redis for async task processing
PRD Reference: FR-4 - Async notification processing
"""

from celery import Celery
from app.core.config import settings

# Create Celery app
celery_app = Celery(
    "healthcare_voice_agent",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.notification_tasks"]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes max per task
    task_soft_time_limit=240,  # Soft limit at 4 minutes
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    # Rate limiting for external APIs
    task_annotations={
        "app.tasks.notification_tasks.send_sms": {"rate_limit": "10/s"},
        "app.tasks.notification_tasks.send_email": {"rate_limit": "20/s"},
    },
    # Beat schedule for periodic tasks
    beat_schedule={
        "process-pending-notifications": {
            "task": "app.tasks.notification_tasks.process_pending_notifications",
            "schedule": 60.0,  # Every minute
        },
        "mark-no-shows": {
            "task": "app.tasks.notification_tasks.mark_no_shows",
            "schedule": 300.0,  # Every 5 minutes
        },
    }
)
