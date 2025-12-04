"""
Notification Service
TRS Reference: Section 2.2.3 - Notification Endpoints
PRD Reference: FR-4 - Notifications & Reminders
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.notification import Notification, NotificationType, NotificationStatus
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.services.audit_service import log_phi_access
from app.core.config import settings


class NotificationService:
    """Service for notification management."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def schedule_appointment_reminders(
        self,
        appointment: Appointment,
        patient: Patient
    ) -> List[Notification]:
        """
        Schedule SMS and email reminders for an appointment.
        PRD FR-4: SMS 24h before, Email 48h before
        """
        notifications = []
        user = await self.db.get(Patient, patient.id)
        
        # Email reminder 48 hours before
        if patient.email_consent and user:
            email_time = appointment.start_time - timedelta(hours=48)
            if email_time > datetime.now(timezone.utc):
                email_notif = await self.create_notification(
                    patient_id=patient.id,
                    appointment_id=appointment.id,
                    notification_type=NotificationType.EMAIL,
                    recipient=user.user.email,
                    scheduled_for=email_time,
                    template="appointment_reminder_email"
                )
                notifications.append(email_notif)
        
        # SMS reminder 24 hours before
        if patient.sms_consent and user:
            sms_time = appointment.start_time - timedelta(hours=24)
            if sms_time > datetime.now(timezone.utc):
                sms_notif = await self.create_notification(
                    patient_id=patient.id,
                    appointment_id=appointment.id,
                    notification_type=NotificationType.SMS,
                    recipient=user.user.phone_number,
                    scheduled_for=sms_time,
                    template="appointment_reminder_sms"
                )
                notifications.append(sms_notif)
        
        return notifications
    
    async def create_notification(
        self,
        patient_id: UUID,
        notification_type: NotificationType,
        recipient: str,
        scheduled_for: Optional[datetime] = None,
        appointment_id: Optional[UUID] = None,
        template: Optional[str] = None,
        message: Optional[str] = None
    ) -> Notification:
        """Create a new notification."""
        notification = Notification(
            patient_id=patient_id,
            appointment_id=appointment_id,
            type=notification_type.value,
            recipient_address=recipient,
            scheduled_for=scheduled_for or datetime.now(timezone.utc),
            message_template=template,
            message_body=message,
            status=NotificationStatus.SCHEDULED.value
        )
        
        self.db.add(notification)
        await self.db.flush()
        
        await log_phi_access(
            self.db, None, "create", "notification",
            notification.id, new_values={"patient_id": str(patient_id)}
        )
        
        return notification
    
    async def get_pending_notifications(
        self,
        limit: int = 100
    ) -> List[Notification]:
        """Get notifications ready to be sent."""
        now = datetime.now(timezone.utc)
        
        result = await self.db.execute(
            select(Notification)
            .where(
                Notification.status == NotificationStatus.SCHEDULED.value,
                Notification.scheduled_for <= now
            )
            .limit(limit)
        )
        
        return list(result.scalars().all())
    
    async def mark_sent(
        self,
        notification_id: UUID
    ) -> Optional[Notification]:
        """Mark notification as sent."""
        notification = await self.db.get(Notification, notification_id)
        if notification:
            notification.status = NotificationStatus.SENT.value
            notification.sent_at = datetime.now(timezone.utc)
            notification.delivery_attempts += 1
            await self.db.flush()
        return notification
    
    async def mark_delivered(
        self,
        notification_id: UUID
    ) -> Optional[Notification]:
        """Mark notification as delivered."""
        notification = await self.db.get(Notification, notification_id)
        if notification:
            notification.status = NotificationStatus.DELIVERED.value
            notification.delivered_at = datetime.now(timezone.utc)
            await self.db.flush()
        return notification
    
    async def mark_failed(
        self,
        notification_id: UUID,
        reason: str,
        error_code: Optional[str] = None
    ) -> Optional[Notification]:
        """Mark notification as failed."""
        notification = await self.db.get(Notification, notification_id)
        if notification:
            notification.status = NotificationStatus.FAILED.value
            notification.failure_reason = reason
            notification.last_error_code = error_code
            notification.delivery_attempts += 1
            await self.db.flush()
        return notification


# Template messages
NOTIFICATION_TEMPLATES = {
    "appointment_reminder_sms": (
        "Reminder: You have an appointment on {date} at {time}. "
        "Reply CONFIRM to confirm or call us to reschedule."
    ),
    "appointment_reminder_email": (
        "Dear {patient_name},\n\n"
        "This is a reminder for your upcoming appointment:\n\n"
        "Date: {date}\n"
        "Time: {time}\n"
        "Doctor: {doctor_name}\n\n"
        "Please arrive 10 minutes early. If you need to reschedule, "
        "please call us or reply to this email.\n\n"
        "Best regards,\nHealthcare Voice Agent"
    ),
    "appointment_confirmation_sms": (
        "Your appointment has been booked! Confirmation: {confirmation_code}. "
        "Date: {date} at {time}."
    ),
    "appointment_cancelled_sms": (
        "Your appointment on {date} at {time} has been cancelled. "
        "Call us to reschedule."
    ),
}
