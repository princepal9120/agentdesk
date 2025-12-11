"""
Seed script to generate mock voice call records for Developer Dashboard testing.
Run from backend directory: python scripts/seed_calls.py
"""

import asyncio
import uuid
import random
from datetime import datetime, timedelta
from decimal import Decimal

import sys
import os

# Fix Python path to prioritize this project
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path = [backend_dir] + [p for p in sys.path if backend_dir not in p]

from sqlalchemy import select
from app.core.database import engine, AsyncSessionLocal
from app.models.voice_call_record import VoiceCallRecord
from app.models.patient import Patient


def generate_debug_trace():
    """Generate a realistic turn-by-turn debug trace."""
    turns = []
    intents = ["greeting", "schedule_appointment", "confirm_time", "provide_info", "farewell"]
    
    for i, intent in enumerate(intents):
        stt_latency = random.randint(80, 300)
        llm_latency = random.randint(200, 800)
        tts_latency = random.randint(100, 250)
        
        turns.append({
            "turn": i + 1,
            "speaker": "user" if i % 2 == 0 else "ai",
            "text": f"Sample {'user' if i % 2 == 0 else 'AI'} message for turn {i + 1}",
            "intent": intent,
            "latency": {
                "stt_ms": stt_latency,
                "llm_ms": llm_latency,
                "tts_ms": tts_latency,
                "total_ms": stt_latency + llm_latency + tts_latency
            },
            "timestamp": (datetime.utcnow() - timedelta(minutes=5 - i)).isoformat()
        })
    return {"turns": turns, "total_turns": len(turns)}


def generate_latency_metrics():
    """Generate aggregate latency metrics."""
    return {
        "stt": {"p50": 120, "p95": 250, "p99": 400},
        "llm": {"p50": 350, "p95": 600, "p99": 900},
        "tts": {"p50": 150, "p95": 220, "p99": 300},
        "e2e": {"p50": 620, "p95": 1070, "p99": 1600}
    }


def generate_sentiment_timeline():
    """Generate a list of sentiment scores over time."""
    sentiments = []
    current = 0.7  # Start positive
    for i in range(5):
        # Slight random walk
        current += random.uniform(-0.15, 0.1)
        current = max(0, min(1, current))  # Clamp to [0, 1]
        sentiments.append({
            "turn": i + 1,
            "score": round(current, 2),
            "label": "positive" if current > 0.6 else ("negative" if current < 0.4 else "neutral")
        })
    return sentiments


async def seed_calls():
    async with AsyncSessionLocal() as db:
        try:
            # Get a patient to associate calls with
            result = await db.execute(select(Patient).limit(1))
            patient = result.scalars().first()
            if not patient:
                print("ERROR: No patients found. Run seed_patient.py first.")
                return
            
            outcomes = ["completed", "completed", "completed", "failed", "interrupted"]
            intents = ["schedule_appointment", "reschedule", "cancel", "inquiry", "general"]
            
            for i in range(10):
                outcome = random.choice(outcomes)
                call = VoiceCallRecord(
                    id=uuid.uuid4(),
                    patient_id=patient.id,
                    call_sid=f"CA{uuid.uuid4().hex[:24]}",
                    call_type="inbound",
                    phone_number=f"+1555{random.randint(1000000, 9999999)}",
                    transcript=f"Sample transcript for call {i + 1}. Patient requested appointment.",
                    transcription_confidence=Decimal(str(round(random.uniform(0.85, 0.99), 2))),
                    detected_intent=random.choice(intents),
                    conversation_outcome=outcome,
                    call_started_at=datetime.utcnow() - timedelta(hours=random.randint(1, 48)),
                    call_ended_at=datetime.utcnow() - timedelta(hours=random.randint(0, 1)),
                    call_duration_seconds=random.randint(60, 300),
                    livekit_session_id=f"LK_{uuid.uuid4().hex[:16]}",
                    ai_model_version="gpt-4o-realtime-preview",
                    debug_trace=generate_debug_trace(),
                    latency_metrics=generate_latency_metrics(),
                    sentiment_timeline=generate_sentiment_timeline()
                )
                db.add(call)
            
            await db.commit()
            print("Successfully seeded 10 mock voice call records!")
            
        except Exception as e:
            await db.rollback()
            print(f"Error seeding calls: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_calls())
