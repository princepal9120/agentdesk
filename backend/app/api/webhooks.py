"""
Webhook handlers for Twilio and LiveKit.
"""

from fastapi import APIRouter, Request, Form, Response
from twilio.twiml.voice_response import VoiceResponse, Connect, Stream
from twilio.request_validator import RequestValidator
import structlog
import json

from app.core.config import get_settings
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from sqlalchemy import select
from app.models.business import Business

logger = structlog.get_logger()
settings = get_settings()
router = APIRouter()


@router.post("/twilio/voice")
async def twilio_voice_inbound(
    request: Request,
    To: str = Form(...),
    From: str = Form(...),
    CallSid: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    """
    Twilio webhook — called when an inbound call arrives.
    Looks up which business owns this phone number,
    creates a LiveKit room, and connects the call via SIP.
    """
    from livekit import api as lkapi
    import uuid

    # Look up business by phone number
    result = await db.execute(
        select(Business).where(
            Business.phone_number == To,
            Business.active == True,
        )
    )
    business = result.scalar_one_or_none()

    if not business:
        logger.warning("twilio_call_no_business", to=To, from_=From)
        response = VoiceResponse()
        response.say("We're sorry, this number is not configured. Goodbye.")
        response.hangup()
        return Response(content=str(response), media_type="application/xml")

    # Create a LiveKit room with business metadata
    room_name = f"call-{CallSid}"
    metadata = json.dumps({
        "business_id": str(business.id),
        "caller_number": From,
        "call_sid": CallSid,
    })

    lk = lkapi.LiveKitAPI(
        url=settings.livekit_url,
        api_key=settings.livekit_api_key,
        api_secret=settings.livekit_api_secret,
    )

    await lk.room.create_room(
        lkapi.CreateRoomRequest(
            name=room_name,
            metadata=metadata,
            empty_timeout=60,
        )
    )

    # Generate SIP participant token
    token = lkapi.AccessToken(
        api_key=settings.livekit_api_key,
        api_secret=settings.livekit_api_secret,
    ).with_identity(f"caller-{From}") \
     .with_name("Caller") \
     .with_grants(lkapi.VideoGrants(room_join=True, room=room_name)) \
     .to_jwt()

    # Return TwiML that connects the call to LiveKit via SIP/WebSocket
    response = VoiceResponse()
    connect = Connect()
    stream = Stream(url=f"{settings.livekit_url}/sip")
    stream.parameter(name="token", value=token)
    stream.parameter(name="roomName", value=room_name)
    connect.append(stream)
    response.append(connect)

    logger.info("twilio_call_routed", business=business.name, room=room_name)
    return Response(content=str(response), media_type="application/xml")


@router.post("/twilio/status")
async def twilio_call_status(
    request: Request,
    CallSid: str = Form(...),
    CallStatus: str = Form(...),
    CallDuration: str = Form(default="0"),
):
    """Twilio call status callback."""
    logger.info("twilio_status", sid=CallSid, status=CallStatus, duration=CallDuration)
    return {"ok": True}


@router.post("/livekit")
async def livekit_webhook(request: Request):
    """LiveKit webhook for room/participant events."""
    body = await request.body()
    try:
        event = json.loads(body)
        event_type = event.get("event")
        logger.info("livekit_event", type=event_type)
        # Handle room_finished, participant_joined, etc. as needed
    except Exception as e:
        logger.error("livekit_webhook_error", error=str(e))
    return {"ok": True}
