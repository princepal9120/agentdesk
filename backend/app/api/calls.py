"""
Call log endpoints — list calls, get transcripts, get stats.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from pydantic import BaseModel
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models.call import Call, Booking

router = APIRouter()


class CallOut(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    twilio_call_sid: str | None
    caller_number: str | None
    duration_sec: int | None
    status: str
    outcome: str | None
    summary: str | None
    started_at: datetime
    ended_at: datetime | None

    class Config:
        from_attributes = True


class TranscriptOut(BaseModel):
    call_id: uuid.UUID
    transcript: list | None
    duration_sec: int | None
    outcome: str | None
    summary: str | None


class CallStatsOut(BaseModel):
    total_calls: int
    answered_calls: int
    bookings_made: int
    avg_duration_sec: float
    period: str


@router.get("/business/{business_id}", response_model=list[CallOut])
async def list_calls(
    business_id: uuid.UUID,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Call)
        .where(Call.business_id == business_id)
        .order_by(desc(Call.started_at))
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.get("/{call_id}/transcript", response_model=TranscriptOut)
async def get_transcript(call_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Call).where(Call.id == call_id))
    call = result.scalar_one_or_none()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return {
        "call_id": call.id,
        "transcript": call.transcript,
        "duration_sec": call.duration_sec,
        "outcome": call.outcome,
        "summary": call.summary,
    }


@router.get("/business/{business_id}/stats", response_model=CallStatsOut)
async def get_call_stats(
    business_id: uuid.UUID,
    period: str = "month",  # week|month|all
    db: AsyncSession = Depends(get_db),
):
    from datetime import timedelta

    now = datetime.utcnow()
    if period == "week":
        since = now - timedelta(days=7)
    elif period == "month":
        since = now - timedelta(days=30)
    else:
        since = datetime(2020, 1, 1)

    # Total + answered
    total_result = await db.execute(
        select(func.count()).where(
            Call.business_id == business_id,
            Call.started_at >= since,
        )
    )
    total = total_result.scalar() or 0

    answered_result = await db.execute(
        select(func.count()).where(
            Call.business_id == business_id,
            Call.started_at >= since,
            Call.status == "answered",
        )
    )
    answered = answered_result.scalar() or 0

    # Bookings
    bookings_result = await db.execute(
        select(func.count()).where(
            Booking.business_id == business_id,
            Booking.created_at >= since,
        )
    )
    bookings = bookings_result.scalar() or 0

    # Avg duration
    avg_result = await db.execute(
        select(func.avg(Call.duration_sec)).where(
            Call.business_id == business_id,
            Call.started_at >= since,
            Call.duration_sec.isnot(None),
        )
    )
    avg_duration = float(avg_result.scalar() or 0)

    return {
        "total_calls": total,
        "answered_calls": answered,
        "bookings_made": bookings,
        "avg_duration_sec": avg_duration,
        "period": period,
    }
