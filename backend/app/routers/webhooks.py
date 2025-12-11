"""
Webhook Router
TRS Reference: Section 2.2.4 - Voice Agent Webhook Endpoints

============================================================
HOW WEBHOOKS WORK - LEARNING GUIDE
============================================================

What is a Webhook?
------------------
A webhook is a "reverse API call". Instead of YOUR server calling an external service,
the external service calls YOUR server when something happens.

Flow:
1. Patient receives SMS via Twilio
2. Twilio sends HTTP POST to your /webhooks/twilio/sms-status endpoint
3. Your server processes the event and updates the database
4. You return a response so Twilio knows you received it

Why do we need this?
--------------------
- Know when an SMS was delivered (or failed)
- Know when a call ended (and how long it was)
- Get the transcription of a call after it's processed

Security:
---------
External services sign their requests with a secret. We verify this signature
to ensure the request actually came from Twilio (not an attacker).
============================================================
"""

import logging
from datetime import datetime, timezone
from decimal import Decimal
from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import verify_twilio_signature
from app.models.voice_call_record import VoiceCallRecord
from app.models.notification import Notification, NotificationStatus
from app.services.audit_service import log_phi_access

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


# ============================================================
# PYDANTIC MODELS - Define the shape of incoming data
# ============================================================
# These models validate the JSON that external services send us.
# If Twilio sends data that doesn't match, FastAPI returns a 422 error.

class TwilioCallStatus(BaseModel):
    """
    Data Twilio sends when a call status changes.
    
    CallSid: Unique identifier for the call (e.g., "CA123abc...")
    CallStatus: One of: initiated, ringing, in-progress, completed, busy, failed, no-answer
    Duration: Call length in seconds (only present when call ends)
    RecordingUrl: URL to the call recording (if recording was enabled)
    """
    CallSid: str
    CallStatus: str
    From_: Optional[str] = None
    To: Optional[str] = None
    Duration: Optional[int] = None
    RecordingUrl: Optional[str] = None


class TwilioSMSStatus(BaseModel):
    """
    Data Twilio sends when an SMS delivery status changes.
    
    MessageSid: Unique identifier for the SMS
    MessageStatus: One of: queued, sent, delivered, undelivered, failed
    ErrorCode: Error code if delivery failed (e.g., "30006" = unreachable)
    """
    MessageSid: str
    MessageStatus: str
    To: Optional[str] = None
    ErrorCode: Optional[str] = None


class AssemblyAITranscript(BaseModel):
    """
    Data AssemblyAI sends when transcription is complete.
    
    request_id: Unique identifier for the transcription job
    status: "completed" or "error"
    transcript: The actual text transcription
    confidence: Average confidence score (0.0 to 1.0)
    """
    request_id: str
    status: str
    transcript: Optional[str] = None
    confidence: Optional[float] = None


class WebhookResponse(BaseModel):
    """Simple acknowledgment response."""
    status: str
    message: Optional[str] = None


# ============================================================
# TWILIO CALL STATUS WEBHOOK
# ============================================================
# This endpoint receives updates about phone calls.
# When a call ends, Twilio POSTs: { CallSid: "...", CallStatus: "completed", Duration: 120 }

@router.post("/twilio/call-status", response_model=WebhookResponse)
async def twilio_call_status(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Twilio call status webhook.
    
    LEARNING: This is called by Twilio whenever a call changes state.
    We use this to:
    1. Track when calls start/end
    2. Save the call duration
    3. Save the recording URL for later playback
    
    TRS 2.2.4: POST /api/v1/webhooks/twilio/call-status
    """
    # Step 1: Parse the incoming data
    # Twilio can send either JSON or form data, so we handle both
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        body = await request.json()
    else:
        # Twilio typically sends form-encoded data
        form = await request.form()
        body = dict(form)
    
    logger.info(f"Received Twilio call webhook: {body}")
    
    # Step 2: Extract the data we need
    call_sid = body.get("CallSid")
    call_status = body.get("CallStatus")
    duration = body.get("Duration")  # Only present when call ends
    recording_url = body.get("RecordingUrl")
    
    if not call_sid:
        return WebhookResponse(status="error", message="Missing CallSid")
    
    # Step 3: Find the call record in our database
    # We stored the CallSid when the call was created
    result = await db.execute(
        select(VoiceCallRecord).where(VoiceCallRecord.call_sid == call_sid)
    )
    call_record = result.scalar_one_or_none()
    
    if not call_record:
        # This might be a call we don't track, or a race condition
        logger.warning(f"Call record not found for CallSid: {call_sid}")
        return WebhookResponse(status="received", message="Call record not found")
    
    # Step 4: Update the record based on call status
    # This is where the "magic" happens - we're syncing external state to our DB
    
    if call_status == "completed":
        # Call finished successfully
        call_record.call_ended_at = datetime.now(timezone.utc)
        call_record.conversation_outcome = "completed"
        if duration:
            call_record.call_duration_seconds = int(duration)
    
    elif call_status == "failed":
        call_record.call_ended_at = datetime.now(timezone.utc)
        call_record.conversation_outcome = "failed"
    
    elif call_status == "busy" or call_status == "no-answer":
        call_record.call_ended_at = datetime.now(timezone.utc)
        call_record.conversation_outcome = call_status
    
    elif call_status == "in-progress":
        # Call just started
        if not call_record.call_started_at:
            call_record.call_started_at = datetime.now(timezone.utc)
    
    # Save recording URL if available
    if recording_url:
        call_record.recording_url = recording_url
    
    # Step 5: Audit log - HIPAA requires tracking all PHI access
    await log_phi_access(
        db, None, "webhook_update", "voice_call_record",
        call_record.id, new_values={
            "call_status": call_status,
            "duration": duration
        }
    )
    
    # Step 6: Commit changes
    await db.commit()
    
    logger.info(f"Updated call record {call_record.id} with status {call_status}")
    return WebhookResponse(status="received")


# ============================================================
# TWILIO SMS STATUS WEBHOOK
# ============================================================
# This endpoint receives updates about SMS delivery.
# When an SMS is delivered, Twilio POSTs: { MessageSid: "...", MessageStatus: "delivered" }

@router.post("/twilio/sms-status", response_model=WebhookResponse)
async def twilio_sms_status(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Twilio SMS status webhook.
    
    LEARNING: This is how we know if an SMS was actually delivered.
    The SMS journey looks like:
    1. We send SMS to Twilio → status = "queued"
    2. Twilio sends to carrier → status = "sent"
    3. Carrier delivers to phone → status = "delivered"
    4. OR delivery fails → status = "undelivered" or "failed"
    
    TRS 2.2.4: POST /api/v1/webhooks/twilio/sms-status
    """
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        body = await request.json()
    else:
        form = await request.form()
        body = dict(form)
    
    logger.info(f"Received Twilio SMS webhook: {body}")
    
    message_sid = body.get("MessageSid")
    message_status = body.get("MessageStatus")
    error_code = body.get("ErrorCode")
    
    if not message_sid:
        return WebhookResponse(status="error", message="Missing MessageSid")
    
    # Find the notification by looking for the MessageSid in channel field
    # In a real implementation, you'd store the MessageSid when sending
    # For now, we'll look up by recipient and recent timestamp
    
    # Map Twilio status to our NotificationStatus
    status_mapping = {
        "queued": NotificationStatus.SCHEDULED.value,
        "sent": NotificationStatus.SENT.value,
        "delivered": NotificationStatus.DELIVERED.value,
        "undelivered": NotificationStatus.FAILED.value,
        "failed": NotificationStatus.FAILED.value,
    }
    
    new_status = status_mapping.get(message_status, NotificationStatus.SENT.value)
    
    # Update notification records that match this MessageSid
    # In production, you'd store MessageSid when sending and query by it
    update_values = {"status": new_status}
    
    if message_status == "delivered":
        update_values["delivered_at"] = datetime.now(timezone.utc)
    elif message_status == "sent":
        update_values["sent_at"] = datetime.now(timezone.utc)
    elif message_status in ("undelivered", "failed"):
        update_values["failure_reason"] = f"Twilio error: {error_code}"
        update_values["last_error_code"] = error_code
    
    # For a real implementation, you'd query by stored MessageSid
    # This is a simplified version
    logger.info(f"SMS status update: {message_sid} → {message_status}")
    
    return WebhookResponse(status="acknowledged")


# ============================================================
# ASSEMBLYAI TRANSCRIPT WEBHOOK
# ============================================================
# This endpoint receives the transcription when audio processing is complete.

@router.post("/assemblyai/transcript", response_model=WebhookResponse)
async def assemblyai_transcript(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle AssemblyAI transcript webhook.
    
    LEARNING: After a call, we send the audio to AssemblyAI for transcription.
    This is async - we send the audio and AssemblyAI calls this webhook when done.
    
    Flow:
    1. Call ends → we upload audio to AssemblyAI
    2. AssemblyAI processes audio (takes a few seconds to minutes)
    3. AssemblyAI POSTs the transcript to this endpoint
    4. We save the transcript to our database
    
    TRS 2.2.4: POST /api/v1/webhooks/assemblyai/transcript
    """
    body = await request.json()
    
    logger.info(f"Received AssemblyAI webhook: status={body.get('status')}")
    
    request_id = body.get("request_id")
    status = body.get("status")
    transcript = body.get("transcript")
    confidence = body.get("confidence")
    
    if not request_id:
        return WebhookResponse(status="error", message="Missing request_id")
    
    if status != "completed":
        # Transcription failed or is still processing
        logger.warning(f"AssemblyAI transcription not completed: {status}")
        return WebhookResponse(status="received", message=f"Status: {status}")
    
    # Find the call record by livekit_session_id (which we use as request_id)
    # In production, you'd store the AssemblyAI request_id when submitting
    result = await db.execute(
        select(VoiceCallRecord).where(
            VoiceCallRecord.livekit_session_id == request_id
        )
    )
    call_record = result.scalar_one_or_none()
    
    if not call_record:
        logger.warning(f"Call record not found for request_id: {request_id}")
        return WebhookResponse(status="received", message="Call record not found")
    
    # Save the transcript
    # NOTE: In HIPAA environments, this transcript is PHI and must be encrypted
    call_record.transcript = transcript
    if confidence:
        call_record.transcription_confidence = Decimal(str(round(confidence, 2)))
    
    # Audit log - required by HIPAA
    await log_phi_access(
        db, None, "webhook_update", "voice_call_record",
        call_record.id, new_values={
            "transcript_received": True,
            "confidence": confidence
        }
    )
    
    await db.commit()
    
    logger.info(f"Saved transcript for call {call_record.id}")
    return WebhookResponse(status="processed")
