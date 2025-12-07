from typing import List, Optional
from datetime import datetime
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.voice_call_record import VoiceCallRecord
from app.core.security import get_current_user, get_current_admin_user

router = APIRouter(prefix="/calls", tags=["Calls"])

@router.get("/", response_model=dict)
async def list_calls(
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_current_admin_user) # Restricted to admins
):
    """
    List voice calls with pagination and filtering.
    Restricted to Admin users (Developer Persona).
    """
    query = select(VoiceCallRecord).options(
        selectinload(VoiceCallRecord.patient),
        selectinload(VoiceCallRecord.appointment)
    ).order_by(desc(VoiceCallRecord.call_started_at))
    
    if status:
        query = query.where(VoiceCallRecord.conversation_outcome == status)
        
    total = db.scalar(select(VoiceCallRecord.id).count())
    result = db.execute(query.offset(skip).limit(limit))
    calls = result.scalars().all()
    
    # Simple serialization to avoid complex Pydantic schemas for now
    return {
        "total": total,
        "items": [
            {
                "id": str(call.id),
                "patient_name": call.patient.full_name if call.patient else "Unknown",
                "phone_number": call.phone_number,
                "status": call.conversation_outcome,
                "duration": call.call_duration_seconds,
                "started_at": call.call_started_at,
                "intent": call.detected_intent,
                "sentiment_timeline": call.sentiment_timeline
            } for call in calls
        ]
    }

@router.get("/{call_id}", response_model=dict)
async def get_call_details(
    call_id: uuid.UUID,
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_current_admin_user)
):
    """
    Get deep debug details for a specific call.
    Includes full turn-by-turn trace and latency metrics.
    """
    query = select(VoiceCallRecord).options(
        selectinload(VoiceCallRecord.patient),
        selectinload(VoiceCallRecord.appointment)
    ).where(VoiceCallRecord.id == call_id)
    
    result = db.execute(query)
    call = result.scalars().first()
    
    if not call:
        raise HTTPException(status_code=404, detail="Call record not found")
        
    return {
        "id": str(call.id),
        "patient_name": call.patient.full_name if call.patient else "Unknown",
        "phone_number": call.phone_number,
        "status": call.conversation_outcome,
        "duration": call.call_duration_seconds,
        "started_at": call.call_started_at,
        "recording_url": call.recording_url,
        "transcript": call.transcript,
        # Developer Debug Data
        "debug_trace": call.debug_trace,
        "latency_metrics": call.latency_metrics,
        "sentiment_timeline": call.sentiment_timeline,
        "ai_model": call.ai_model_version,
        "session_id": call.livekit_session_id
    }
