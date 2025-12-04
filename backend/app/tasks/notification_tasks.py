"""
Notification Celery Tasks
TRS Reference: Section 2.2.3 - Notification queue processing
PRD Reference: FR-4 - Notifications & Reminders
"""

import asyncio
from datetime import datetime, timezone, timedelta
from typing import Optional

from app.core.celery_app import celery_app
from app.core.config import settings


@celery_app.task(bind=True, max_retries=3)
def send_sms(self, phone_number: str, message: str, notification_id: Optional[str] = None):
    """
    Send SMS via Twilio.
    PRD FR-4: SMS reminders 24h before appointment
    """
    try:
        if not settings.TWILIO_ACCOUNT_SID:
            print(f"[DEV] SMS to {phone_number}: {message}")
            return {"status": "sent", "sid": "dev_mode"}
        
        from twilio.rest import Client
        
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        msg = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        
        return {"status": "sent", "sid": msg.sid}
    
    except Exception as e:
        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))


@celery_app.task(bind=True, max_retries=3)
def send_email(
    self,
    to_email: str,
    subject: str,
    body: str,
    notification_id: Optional[str] = None
):
    """
    Send email via Resend.
    PRD FR-4: Email reminders 48h before appointment
    """
    try:
        if not settings.RESEND_API_KEY:
            print(f"[DEV] Email to {to_email}: {subject}")
            return {"status": "sent", "message_id": "dev_mode"}
        
        import resend
        
        resend.api_key = settings.RESEND_API_KEY
        
        params = {
            "from": settings.RESEND_FROM_EMAIL or "HealthVoice <noreply@healthvoice.com>",
            "to": [to_email],
            "subject": subject,
            "text": body,
        }
        
        response = resend.Emails.send(params)
        
        return {"status": "sent", "message_id": response.get("id")}
    
    except Exception as e:
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))


@celery_app.task(bind=True, max_retries=3)
def make_confirmation_call(
    self,
    phone_number: str,
    appointment_id: str,
    notification_id: Optional[str] = None
):
    """
    Make outbound confirmation call.
    PRD US-3: Confirmation call 24h before appointment
    """
    try:
        if not settings.TWILIO_ACCOUNT_SID:
            print(f"[DEV] Call to {phone_number} for appointment {appointment_id}")
            return {"status": "initiated", "call_sid": "dev_mode"}
        
        from twilio.rest import Client
        
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # TwiML for confirmation call
        twiml = f"""
        <Response>
            <Say voice="alice">
                This is a reminder for your upcoming appointment.
                Press 1 to confirm, or press 2 to cancel.
            </Say>
            <Gather numDigits="1" action="/api/v1/webhooks/twilio/confirmation-response?appointment_id={appointment_id}">
                <Say>Please press 1 to confirm or 2 to cancel.</Say>
            </Gather>
        </Response>
        """
        
        call = client.calls.create(
            twiml=twiml,
            to=phone_number,
            from_=settings.TWILIO_PHONE_NUMBER,
            status_callback=f"{settings.API_V1_PREFIX}/webhooks/twilio/call-status"
        )
        
        return {"status": "initiated", "call_sid": call.sid}
    
    except Exception as e:
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))


@celery_app.task
def process_pending_notifications():
    """
    Process pending notifications from database.
    Runs every minute via Celery Beat.
    """
    async def _process():
        from app.core.database import AsyncSessionLocal
        from app.models.notification import Notification, NotificationStatus
        from sqlalchemy import select
        
        async with AsyncSessionLocal() as db:
            now = datetime.now(timezone.utc)
            
            result = await db.execute(
                select(Notification)
                .where(
                    Notification.status == NotificationStatus.SCHEDULED.value,
                    Notification.scheduled_for <= now
                )
                .limit(100)
            )
            notifications = result.scalars().all()
            
            for notif in notifications:
                if notif.type == "sms":
                    send_sms.delay(
                        notif.recipient_address,
                        notif.message_body,
                        str(notif.id)
                    )
                elif notif.type == "email":
                    send_email.delay(
                        notif.recipient_address,
                        "Appointment Reminder",
                        notif.message_body,
                        str(notif.id)
                    )
                elif notif.type == "call":
                    make_confirmation_call.delay(
                        notif.recipient_address,
                        str(notif.appointment_id),
                        str(notif.id)
                    )
                
                notif.status = NotificationStatus.SENT.value
                notif.sent_at = now
            
            await db.commit()
            return len(notifications)
    
    return asyncio.run(_process())


@celery_app.task
def mark_no_shows():
    """
    Mark appointments as no-show if past and not checked in.
    PRD FR-2: Track no-shows
    """
    async def _mark():
        from app.core.database import AsyncSessionLocal
        from app.models.appointment import Appointment, AppointmentStatus
        from sqlalchemy import select
        
        async with AsyncSessionLocal() as db:
            # Find appointments that ended 30+ min ago and still "confirmed"
            cutoff = datetime.now(timezone.utc) - timedelta(minutes=30)
            
            result = await db.execute(
                select(Appointment)
                .where(
                    Appointment.status == AppointmentStatus.CONFIRMED.value,
                    Appointment.end_time <= cutoff
                )
                .limit(100)
            )
            appointments = result.scalars().all()
            
            for apt in appointments:
                apt.status = AppointmentStatus.NO_SHOW.value
                apt.no_show_recorded_at = datetime.now(timezone.utc)
            
            await db.commit()
            return len(appointments)
    
    return asyncio.run(_mark())


@celery_app.task
def schedule_appointment_reminders(appointment_id: str):
    """
    Schedule reminders for a new appointment.
    Called after appointment creation.
    """
    async def _schedule():
        from app.core.database import AsyncSessionLocal
        from app.models.appointment import Appointment
        from app.models.notification import Notification, NotificationType, NotificationStatus
        from app.models.patient import Patient
        from app.models.user import User
        
        async with AsyncSessionLocal() as db:
            apt = await db.get(Appointment, appointment_id)
            if not apt:
                return
            
            patient = await db.get(Patient, apt.patient_id)
            user = await db.get(User, patient.user_id)
            
            # SMS reminder 24h before
            if patient.sms_consent:
                sms_time = apt.start_time - timedelta(hours=24)
                if sms_time > datetime.now(timezone.utc):
                    sms_notif = Notification(
                        patient_id=patient.id,
                        appointment_id=apt.id,
                        type=NotificationType.SMS.value,
                        recipient_address=user.phone_number,
                        scheduled_for=sms_time,
                        message_body=f"Reminder: Appointment on {apt.start_time.strftime('%m/%d at %I:%M %p')}. Reply CONFIRM or CANCEL.",
                        status=NotificationStatus.SCHEDULED.value
                    )
                    db.add(sms_notif)
            
            # Email reminder 48h before
            if patient.email_consent:
                email_time = apt.start_time - timedelta(hours=48)
                if email_time > datetime.now(timezone.utc):
                    email_notif = Notification(
                        patient_id=patient.id,
                        appointment_id=apt.id,
                        type=NotificationType.EMAIL.value,
                        recipient_address=user.email,
                        scheduled_for=email_time,
                        message_body=f"Reminder for your appointment on {apt.start_time.strftime('%B %d, %Y at %I:%M %p')}",
                        status=NotificationStatus.SCHEDULED.value
                    )
                    db.add(email_notif)
            
            await db.commit()
    
    return asyncio.run(_schedule())
