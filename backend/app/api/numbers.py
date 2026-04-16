"""
Twilio phone number provisioning.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import uuid

from app.core.config import get_settings
from app.core.database import get_db
from app.models.business import Business

settings = get_settings()
router = APIRouter()


class ProvisionRequest(BaseModel):
    business_id: uuid.UUID
    area_code: str = "415"  # Default SF area code


class NumberOut(BaseModel):
    phone_number: str
    twilio_sid: str


@router.post("/provision", response_model=NumberOut)
async def provision_number(
    payload: ProvisionRequest,
    db: AsyncSession = Depends(get_db),
):
    """Buy and assign a Twilio phone number to a business."""
    from twilio.rest import Client

    result = await db.execute(select(Business).where(Business.id == payload.business_id))
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    if business.phone_number:
        raise HTTPException(status_code=409, detail="Business already has a phone number")

    client = Client(settings.twilio_account_sid, settings.twilio_auth_token)

    # Search for available number
    available = client.available_phone_numbers("US").local.list(
        area_code=payload.area_code,
        voice_enabled=True,
        limit=1,
    )

    if not available:
        # Fallback: no area code filter
        available = client.available_phone_numbers("US").local.list(
            voice_enabled=True,
            limit=1,
        )

    if not available:
        raise HTTPException(status_code=503, detail="No phone numbers available")

    # Purchase the number
    webhook_base = settings.public_base_url.rstrip("/")
    purchased = client.incoming_phone_numbers.create(
        phone_number=available[0].phone_number,
        voice_url=f"{webhook_base}/webhooks/twilio/voice",
        voice_method="POST",
        status_callback=f"{webhook_base}/webhooks/twilio/status",
        status_callback_method="POST",
    )

    # Save to DB
    business.phone_number = purchased.phone_number
    business.twilio_sid = purchased.sid
    await db.commit()

    return {
        "phone_number": purchased.phone_number,
        "twilio_sid": purchased.sid,
    }


@router.delete("/{business_id}/release")
async def release_number(
    business_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Release a Twilio number (when client is deleted)."""
    from twilio.rest import Client

    result = await db.execute(select(Business).where(Business.id == business_id))
    business = result.scalar_one_or_none()
    if not business or not business.twilio_sid:
        raise HTTPException(status_code=404, detail="No number to release")

    client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
    client.incoming_phone_numbers(business.twilio_sid).delete()

    business.phone_number = None
    business.twilio_sid = None
    await db.commit()

    return {"released": True}
