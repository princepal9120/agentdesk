"""
Notification Router
TRS Reference: Section 2.2.3 - Notification Endpoints
PRD Reference: FR-4 - Notifications & Reminders
"""

from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import User, UserRole
from app.services.notification_service import NotificationService
from app.services.audit_service import log_phi_access

router = APIRouter(prefix="/notifications", tags=["Notifications"])


class NotificationCreate(BaseModel):
    """POST /api/v1/notifications request body."""
    patient_id: UUID
    type: str  # sms, email, call
    message: str
    scheduled_time: Optional[str] = None


class NotificationResponse(BaseModel):
    """Notification response model."""
    id: UUID
    patient_id: UUID
    type: str
    status: str
    recipient_address: str
    message_body: Optional[str]
    scheduled_for: Optional[str]
    delivered_at: Optional[str]

    class Config:
        from_attributes = True


class NotificationCreateResponse(BaseModel):
    """POST response."""
    notification_id: UUID
    status: str
    delivery_time: Optional[str]


class DeliveryStatusResponse(BaseModel):
    """GET /delivery-status response."""
    reminders: List[dict]


@router.post("", response_model=NotificationCreateResponse, status_code=201)
async def create_notification(
    data: NotificationCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST)),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new notification.
    TRS 2.2.3: POST /api/v1/notifications
    """
    from app.models.notification import NotificationType
    from app.models.patient import Patient
    
    # Verify patient exists
    patient = await db.get(Patient, data.patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    user = await db.get(User, patient.user_id)
    
    # Get recipient based on type
    if data.type == "sms":
        recipient = user.phone_number
        notif_type = NotificationType.SMS
    elif data.type == "email":
        recipient = user.email
        notif_type = NotificationType.EMAIL
    else:
        raise HTTPException(status_code=400, detail="Invalid notification type")
    
    service = NotificationService(db)
    notification = await service.create_notification(
        patient_id=data.patient_id,
        notification_type=notif_type,
        recipient=recipient,
        message=data.message
    )
    
    await log_phi_access(
        db, current_user.id, "create", "notification",
        notification.id, new_values={"patient_id": str(data.patient_id)}
    )
    
    return NotificationCreateResponse(
        notification_id=notification.id,
        status=notification.status,
        delivery_time=notification.scheduled_for.isoformat() if notification.scheduled_for else None
    )


@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get notification by ID.
    TRS 2.2.3: GET /api/v1/notifications/{id}
    """
    from app.models.notification import Notification
    
    notification = await db.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    # Authorization: patient can only see their own
    if current_user.role == UserRole.PATIENT:
        if not current_user.patient or current_user.patient.id != notification.patient_id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    await log_phi_access(
        db, current_user.id, "read", "notification", notification_id
    )
    
    return NotificationResponse(
        id=notification.id,
        patient_id=notification.patient_id,
        type=notification.type,
        status=notification.status,
        recipient_address=notification.recipient_address,
        message_body=notification.message_body,
        scheduled_for=notification.scheduled_for.isoformat() if notification.scheduled_for else None,
        delivered_at=notification.delivered_at.isoformat() if notification.delivered_at else None
    )


@router.get("/delivery-status", response_model=DeliveryStatusResponse)
async def get_delivery_status(
    appointment_id: UUID = Query(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get notification delivery status for an appointment.
    TRS 2.2.3: GET /api/v1/notifications/delivery-status
    """
    from sqlalchemy import select
    from app.models.notification import Notification
    
    result = await db.execute(
        select(Notification).where(Notification.appointment_id == appointment_id)
    )
    notifications = result.scalars().all()
    
    reminders = [
        {
            "id": str(n.id),
            "type": n.type,
            "status": n.status,
            "delivered_at": n.delivered_at.isoformat() if n.delivered_at else None
        }
        for n in notifications
    ]
    
    return DeliveryStatusResponse(reminders=reminders)
