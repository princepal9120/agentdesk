"""
Notification Tasks
Celery tasks for sending appointment reminders and notifications.
"""

from datetime import datetime, timedelta
from celery import shared_task
from sqlalchemy import select, and_

from app.core.database import sync_session
from app.models import Appointment, Patient, Doctor, User
from app.services.notification_service import NotificationService


@shared_task(name="app.tasks.notifications.send_appointment_reminders")
def send_appointment_reminders():
    """
    Send reminders for appointments in the next 24 hours.
    Runs every 30 minutes via Celery Beat.
    """
    with sync_session() as session:
        now = datetime.utcnow()
        reminder_window_start = now + timedelta(hours=23, minutes=30)
        reminder_window_end = now + timedelta(hours=24, minutes=30)
        
        # Find appointments in the reminder window that haven't been reminded
        appointments = session.execute(
            select(Appointment)
            .where(
                and_(
                    Appointment.start_time >= reminder_window_start,
                    Appointment.start_time <= reminder_window_end,
                    Appointment.status.in_(["scheduled", "confirmed"]),
                    Appointment.reminder_sent == False,
                )
            )
        ).scalars().all()
        
        notification_service = NotificationService()
        sent_count = 0
        
        for appointment in appointments:
            # Get patient info
            patient = session.get(Patient, appointment.patient_id)
            if not patient:
                continue
            
            patient_user = session.get(User, patient.user_id)
            if not patient_user:
                continue
            
            # Get doctor info
            doctor = session.get(Doctor, appointment.doctor_id)
            doctor_user = session.get(User, doctor.user_id) if doctor else None
            doctor_name = doctor_user.full_name if doctor_user else "your doctor"
            
            # Format appointment time
            appt_time = appointment.start_time.strftime("%B %d at %I:%M %p")
            
            # Send SMS reminder
            message = (
                f"Hi {patient_user.full_name}! "
                f"Reminder: You have an appointment with {doctor_name} "
                f"tomorrow {appt_time}. "
                f"Reply CANCEL to cancel or call us to reschedule."
            )
            
            try:
                notification_service.send_sms(
                    to=patient_user.phone_number,
                    message=message
                )
                
                # Mark as reminded
                appointment.reminder_sent = True
                sent_count += 1
                
            except Exception as e:
                print(f"Failed to send reminder for appointment {appointment.id}: {e}")
        
        session.commit()
        return f"Sent {sent_count} reminders"


@shared_task(name="app.tasks.notifications.check_no_shows")
def check_no_shows():
    """
    Check for appointments that were missed (no-shows).
    Runs every hour.
    """
    with sync_session() as session:
        now = datetime.utcnow()
        no_show_threshold = now - timedelta(hours=1)
        
        # Find appointments that should have started but aren't completed
        missed_appointments = session.execute(
            select(Appointment)
            .where(
                and_(
                    Appointment.end_time < no_show_threshold,
                    Appointment.status.in_(["scheduled", "confirmed"]),
                )
            )
        ).scalars().all()
        
        no_show_count = 0
        for appointment in missed_appointments:
            appointment.status = "no_show"
            no_show_count += 1
        
        session.commit()
        return f"Marked {no_show_count} appointments as no-show"


@shared_task(name="app.tasks.notifications.send_daily_summary")
def send_daily_summary():
    """
    Send daily appointment summary to doctors at 7 AM.
    """
    with sync_session() as session:
        today = datetime.utcnow().date()
        tomorrow = today + timedelta(days=1)
        
        # Get all doctors
        doctors = session.execute(select(Doctor)).scalars().all()
        notification_service = NotificationService()
        sent_count = 0
        
        for doctor in doctors:
            # Count today's appointments
            appointments = session.execute(
                select(Appointment)
                .where(
                    and_(
                        Appointment.doctor_id == doctor.id,
                        Appointment.start_time >= datetime.combine(today, datetime.min.time()),
                        Appointment.start_time < datetime.combine(tomorrow, datetime.min.time()),
                        Appointment.status.in_(["scheduled", "confirmed"]),
                    )
                )
            ).scalars().all()
            
            if not appointments:
                continue
            
            # Get doctor user
            doctor_user = session.get(User, doctor.user_id)
            if not doctor_user or not doctor_user.phone_number:
                continue
            
            # Send summary SMS
            message = (
                f"Good morning, Dr. {doctor_user.full_name.split()[-1]}! "
                f"You have {len(appointments)} appointments today. "
                f"First one at {appointments[0].start_time.strftime('%I:%M %p')}. "
                f"Check your dashboard for details."
            )
            
            try:
                notification_service.send_sms(
                    to=doctor_user.phone_number,
                    message=message
                )
                sent_count += 1
            except Exception as e:
                print(f"Failed to send summary to doctor {doctor.id}: {e}")
        
        return f"Sent {sent_count} daily summaries"


@shared_task(name="app.tasks.notifications.send_confirmation")
def send_confirmation(appointment_id: str):
    """
    Send confirmation after booking.
    Called immediately when an appointment is created.
    """
    with sync_session() as session:
        appointment = session.get(Appointment, appointment_id)
        if not appointment:
            return "Appointment not found"
        
        patient = session.get(Patient, appointment.patient_id)
        patient_user = session.get(User, patient.user_id) if patient else None
        
        doctor = session.get(Doctor, appointment.doctor_id)
        doctor_user = session.get(User, doctor.user_id) if doctor else None
        
        if not patient_user:
            return "Patient not found"
        
        notification_service = NotificationService()
        appt_time = appointment.start_time.strftime("%B %d, %Y at %I:%M %p")
        doctor_name = doctor_user.full_name if doctor_user else "your doctor"
        
        message = (
            f"Appointment Confirmed! "
            f"Your appointment with {doctor_name} is scheduled for {appt_time}. "
            f"You will receive a reminder 24 hours before."
        )
        
        try:
            notification_service.send_sms(
                to=patient_user.phone_number,
                message=message
            )
            return "Confirmation sent"
        except Exception as e:
            return f"Failed to send confirmation: {e}"
