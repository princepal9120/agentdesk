"""
AgentDesk Voice Agent — Core LiveKit agent class.

Architecture:
  Twilio inbound call → SIP → LiveKit room → This agent
  Pipeline: Deepgram (STT) → GPT-4o-mini (LLM) → Cartesia (TTS)
"""

import logging
from dataclasses import dataclass
from typing import Any

from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    WorkerOptions,
    cli,
    RoomInputOptions,
    function_tool,
)
from livekit.plugins import deepgram, openai, cartesia, silero

from agent.templates import get_template, render_system_prompt, Vertical
from agent.tools import get_tools_for_template
from app.core.config import get_settings

logger = logging.getLogger("agentdesk.agent")
settings = get_settings()


@dataclass
class AgentUserdata:
    """Runtime context passed to tool calls."""
    business_id: str
    agency_id: str
    call_id: str | None
    agent_name: str
    faq: list
    services: list
    db: Any = None
    pending_sms: dict | None = None
    message: dict | None = None
    callback: dict | None = None


class VoiceDeskAgent(Agent):
    """
    A configured voice agent for a specific business.
    Initialized from AgentConfig pulled from Postgres.
    """

    def __init__(self, system_prompt: str, tools: list):
        super().__init__(
            instructions=system_prompt,
            tools=tools,
            stt=deepgram.STT(
                model="nova-3",
                language="en-US",
                api_key=settings.deepgram_api_key,
            ),
            llm=openai.LLM(
                model="gpt-4o-mini",
                api_key=settings.openai_api_key,
                temperature=0.7,
            ),
            tts=cartesia.TTS(
                model="sonic-english",
                voice="79a125e8-cd45-4c13-8a67-188112f4dd22",  # Friendly female voice
                api_key=settings.cartesia_api_key,
            ),
            vad=silero.VAD.load(),
        )


async def load_agent_config(business_id: str) -> dict | None:
    """Load agent config from database for a given business."""
    from sqlalchemy.ext.asyncio import AsyncSession
    from sqlalchemy import select
    from app.core.database import AsyncSessionLocal
    from app.models.business import Business, AgentConfig

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Business, AgentConfig)
            .join(AgentConfig, Business.id == AgentConfig.business_id)
            .where(Business.id == business_id, Business.active == True)
        )
        row = result.first()
        if not row:
            return None

        business, config = row
        return {
            "business_id": str(business.id),
            "agency_id": str(business.agency_id),
            "business_name": business.name,
            "vertical": business.vertical or "general",
            "phone_number": business.phone_number,
            "agent_name": config.agent_name,
            "voice_id": config.voice_id,
            "template": config.template,
            "system_prompt": config.system_prompt,
            "business_hours": config.business_hours,
            "services": config.services or [],
            "faq": config.faq or [],
        }


async def create_call_record(business_id: str, agency_id: str, room_name: str, caller_number: str) -> str:
    """Create a call record in Postgres and return its ID."""
    from app.core.database import AsyncSessionLocal
    from app.models.call import Call

    async with AsyncSessionLocal() as db:
        call = Call(
            business_id=business_id,
            agency_id=agency_id,
            livekit_room_id=room_name,
            caller_number=caller_number,
            status="in_progress",
        )
        db.add(call)
        await db.commit()
        await db.refresh(call)
        return str(call.id)


async def finalize_call(call_id: str, transcript: list, duration_sec: int):
    """Save transcript + duration when call ends."""
    from app.core.database import AsyncSessionLocal
    from app.models.call import Call
    from sqlalchemy import select
    from datetime import datetime

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Call).where(Call.id == call_id))
        call = result.scalar_one_or_none()
        if call:
            call.transcript = transcript
            call.duration_sec = duration_sec
            call.status = "answered"
            call.ended_at = datetime.utcnow()
            await db.commit()


async def send_sms_confirmation(to: str, message: str):
    """Send SMS via Twilio."""
    from twilio.rest import Client
    client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
    try:
        client.messages.create(
            body=message,
            from_=settings.twilio_phone_number,
            to=to,
        )
        logger.info(f"SMS sent to {to}")
    except Exception as e:
        logger.error(f"SMS failed: {e}")


async def entrypoint(ctx: JobContext):
    """
    LiveKit agent entrypoint — called when a new room/call is created.
    Room metadata should contain: {"business_id": "...", "caller_number": "..."}
    """
    await ctx.connect()

    # Parse room metadata
    import json
    metadata = {}
    try:
        metadata = json.loads(ctx.room.metadata or "{}")
    except Exception:
        pass

    business_id = metadata.get("business_id")
    caller_number = metadata.get("caller_number", "unknown")

    if not business_id:
        logger.error("No business_id in room metadata — cannot route call")
        return

    # Load config from DB
    config = await load_agent_config(business_id)
    if not config:
        logger.error(f"No active business/config found for business_id={business_id}")
        return

    # Create call record
    call_id = await create_call_record(
        business_id=config["business_id"],
        agency_id=config["agency_id"],
        room_name=ctx.room.name,
        caller_number=caller_number,
    )

    # Build template + tools
    template = get_template(config["vertical"])
    tools = get_tools_for_template(template.available_tools)
    system_prompt = config["system_prompt"]  # Already rendered and stored in DB

    # Userdata for tool context
    userdata = AgentUserdata(
        business_id=config["business_id"],
        agency_id=config["agency_id"],
        call_id=call_id,
        agent_name=config["agent_name"],
        faq=config["faq"],
        services=config["services"],
    )

    # Create and start agent session
    agent = VoiceDeskAgent(system_prompt=system_prompt, tools=tools)
    session = AgentSession(userdata=userdata)

    transcript = []
    start_time = __import__("time").time()

    @session.on("conversation_item_added")
    def on_message(event):
        transcript.append({
            "role": event.item.role,
            "content": event.item.text_content,
            "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
        })

    logger.info(f"Starting agent for business={config['business_name']} call={call_id}")

    await session.start(
        agent=agent,
        room=ctx.room,
        room_input_options=RoomInputOptions(),
    )

    # Generate greeting
    greeting = f"Thank you for calling {config['business_name']}. This is {config['agent_name']}. How can I help you today?"
    await session.generate_reply(instructions=greeting)

    await session.wait_for_disconnect()

    # Finalize
    duration_sec = int(__import__("time").time() - start_time)
    await finalize_call(call_id, transcript, duration_sec)

    # Send pending SMS if any
    pending_sms = userdata.pending_sms
    if pending_sms:
        await send_sms_confirmation(pending_sms["to"], pending_sms["message"])

    logger.info(f"Call ended: call_id={call_id} duration={duration_sec}s turns={len(transcript)}")


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            api_key=settings.livekit_api_key,
            api_secret=settings.livekit_api_secret,
            ws_url=settings.livekit_url,
        )
    )
