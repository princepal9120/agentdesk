"""Provider-aware phone number assignment."""

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


@router.get("/config")
async def telephony_config():
    """Expose non-secret provider readiness for the dashboard."""

    provider = settings.telephony_provider.lower()
    if provider == "exotel":
        configured = all(
            (
                settings.exotel_api_key,
                settings.exotel_api_token,
                settings.exotel_account_sid,
                settings.exotel_caller_id,
            )
        )
        return {
            "provider": "exotel",
            "configured": configured,
            "number_mode": "existing_exophone",
            "setup_hint": "Set EXOTEL_CALLER_ID to the verified Exotel trial ExoPhone.",
        }

    return {
        "provider": "twilio",
        "configured": bool(
            settings.twilio_account_sid
            and settings.twilio_auth_token
            and settings.twilio_phone_number
        ),
        "number_mode": "provisioned",
        "setup_hint": "Twilio provisions a new US number during onboarding.",
    }


class ProvisionRequest(BaseModel):
    business_id: str
    area_code: str = "415"  # Default SF area code


class NumberOut(BaseModel):
    phone_number: str
    provider: str
    provider_number_id: str | None = None


@router.post("/provision", response_model=NumberOut)
async def provision_number(
    payload: ProvisionRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Business).where(Business.id == payload.business_id))
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    if business.phone_number:
        raise HTTPException(status_code=409, detail="Business already has a phone number")

    if settings.telephony_provider.lower() == "exotel":
        # Exotel trial accounts assign an ExoPhone in the dashboard.  We attach
        # that verified number to this workspace rather than pretending the API
        # can purchase arbitrary local numbers.
        if not settings.exotel_caller_id:
            raise HTTPException(
                status_code=503,
                detail="Configure EXOTEL_CALLER_ID with your Exotel trial ExoPhone first",
            )

        from app.services.telephony import normalize_e164

        try:
            exotel_number = normalize_e164(settings.exotel_caller_id)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

        business.phone_number = exotel_number
        business.telephony_provider = "exotel"
        business.provider_number_id = exotel_number
        await db.commit()
        return {
            "phone_number": business.phone_number,
            "provider": "exotel",
            "provider_number_id": business.provider_number_id,
        }

    from twilio.rest import Client

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
    business.telephony_provider = "twilio"
    business.provider_number_id = purchased.sid
    business.twilio_sid = purchased.sid
    await db.commit()

    return {
        "phone_number": purchased.phone_number,
        "provider": "twilio",
        "provider_number_id": purchased.sid,
    }


@router.post("/business/{business_id}/provision", response_model=NumberOut)
async def provision_business_number(
    business_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Dashboard-friendly alias for provisioning a workspace number."""

    return await provision_number(ProvisionRequest(business_id=business_id), db)


@router.delete("/{business_id}/release")
async def release_number(
    business_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Business).where(Business.id == business_id))
    business = result.scalar_one_or_none()
    if not business or not business.phone_number:
        raise HTTPException(status_code=404, detail="No number to release")

    if business.telephony_provider == "exotel":
        # Exotel owns the ExoPhone lifecycle.  Clearing the workspace mapping
        # avoids releasing a shared/customer-owned trial number accidentally.
        business.phone_number = None
        business.provider_number_id = None
        await db.commit()
        return {"released": True, "provider": "exotel"}

    from twilio.rest import Client

    client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
    client.incoming_phone_numbers(business.provider_number_id or business.twilio_sid).delete()

    business.phone_number = None
    business.provider_number_id = None
    business.twilio_sid = None
    await db.commit()

    return {"released": True, "provider": "twilio"}
