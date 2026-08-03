"""
AgentDesk Voice Agent — Core LiveKit agent class.

Architecture:
  Exotel/Twilio SIP → LiveKit room → This agent
  Local pipeline: Saaras (STT) → Sarvam-30B (LLM) → Bulbul (TTS)
  Legacy production pipeline: Deepgram (STT) → GPT-4o-mini (LLM) → Cartesia (TTS)
"""

import logging

from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    RoomInputOptions,
    WorkerOptions,
    cli,
)
from livekit.plugins import cartesia, deepgram, openai, sarvam, silero

from agent.provider_factory import (
    get_runtime_capabilities,
    is_full_provider_mode,
    is_sarvam_provider_mode,
)
from agent.templates import get_template
from agent.tools import get_tools_for_template
from agent.flow_runtime import flow_instructions
from app.core.config import get_settings

logger = logging.getLogger("agentdesk.agent")
settings = get_settings()


class VoiceDeskAgent(Agent):
    """
    A configured voice agent for a specific business.
    Initialized from AgentConfig pulled from Postgres.
    """

    def __init__(self, system_prompt: str, tools: list):
        capabilities = get_runtime_capabilities()

        stt = (
            sarvam.STT(
                language=settings.sarvam_language,
                model=settings.sarvam_stt_model,
                api_key=settings.sarvam_api_key,
            )
            if is_sarvam_provider_mode()
            else (
                deepgram.STT(
                    model="nova-3",
                    language="en-US",
                    api_key=settings.deepgram_api_key,
                )
                if is_full_provider_mode()
                else None
            )
        )

        tts = (
            sarvam.TTS(
                target_language_code=settings.sarvam_language,
                model=settings.sarvam_tts_model,
                speaker=settings.sarvam_tts_speaker,
                api_key=settings.sarvam_api_key,
            )
            if is_sarvam_provider_mode()
            else (
                cartesia.TTS(
                    model="sonic-english",
                    voice="79a125e8-cd45-4c13-8a67-188112f4dd22",
                    api_key=settings.cartesia_api_key,
                )
                if is_full_provider_mode()
                else None
            )
        )

        vad = silero.VAD.load() if capabilities["uses_silero"] else None

        # The installed Sarvam plugin provides native STT/TTS.  Its LLM
        # export is not present in all supported plugin versions, so use
        # Sarvam's documented OpenAI-compatible chat endpoint for this leg.
        llm = (
            openai.LLM(
                model=settings.sarvam_model,
                base_url=settings.sarvam_base_url,
                api_key=settings.sarvam_api_key,
                temperature=0.7,
                extra_headers={"api-subscription-key": settings.sarvam_api_key},
            )
            if is_sarvam_provider_mode()
            else openai.LLM(
                model="gpt-4o-mini",
                api_key=settings.openai_api_key,
                temperature=0.7,
            )
        )

        super().__init__(
            instructions=system_prompt,
            tools=tools,
            stt=stt,
            llm=llm,
            tts=tts,
            vad=vad,
        )
        logger.info("voice_agent_initialized", capabilities=capabilities)


async def load_agent_config(business_id: str) -> dict | None:
    """Load agent config from database for a given business."""
    from sqlalchemy import select

    from app.core.database import AsyncSessionLocal
    from app.models.business import AgentConfig, Business
    from app.models.call import FlowVersion

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
        flow = None
        if config.active_flow_version_id:
            flow_result = await db.execute(
                select(FlowVersion).where(FlowVersion.id == config.active_flow_version_id)
            )
            flow = flow_result.scalar_one_or_none()
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
            "flow_data": ({"start_node_id": flow.start_node_id, "nodes": flow.nodes} if flow else config.flow_data),
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


async def finalize_call(call_id: str, transcript: list, duration_sec: int, outcome: str | None = None):
    """Save transcript + duration when call ends."""
    from datetime import datetime

    from sqlalchemy import select

    from app.core.database import AsyncSessionLocal
    from app.models.call import Call

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Call).where(Call.id == call_id))
        call = result.scalar_one_or_none()
        if call:
            call.transcript = transcript
            call.duration_sec = duration_sec
            call.status = "answered" if call.status not in {"failed", "missed"} else call.status
            call.outcome = outcome or call.outcome or "completed"
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
    # Outbound LiveKit dispatch stores metadata on the job; inbound SIP
    # dispatch rules commonly store it on the room.  Support both paths.
    for metadata_source in (
        getattr(getattr(ctx, "job", None), "metadata", ""),
        ctx.room.metadata,
    ):
        if not metadata_source:
            continue
        try:
            metadata = json.loads(metadata_source)
            break
        except (TypeError, ValueError):
            continue

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

    # The API creates outbound call records before dialing so the attempt can
    # be correlated even if the recipient never answers.
    call_id = metadata.get("call_id")
    if not call_id:
        call_id = await create_call_record(
            business_id=config["business_id"],
            agency_id=config["agency_id"],
            room_name=ctx.room.name,
            caller_number=caller_number,
        )

    # Build template + tools
    template = get_template(config["vertical"])
    tools = get_tools_for_template(template.available_tools)
    from agent.tools import set_call_outcome
    tools.append(set_call_outcome)
    system_prompt = config["system_prompt"] + "\n\n" + flow_instructions(
        metadata.get("flow_data") or config.get("flow_data")
    )

    from app.core.database import AsyncSessionLocal
    from app.models.call import Call
    from sqlalchemy import select

    # db stays open for the whole call (tools query/mutate it live), so it
    # must wrap everything through finalize_call, not just the initial query.
    async with AsyncSessionLocal() as db:
        existing_call = await db.execute(select(Call).where(Call.id == call_id))
        call_row = existing_call.scalar_one_or_none()
        if call_row:
            call_row.livekit_room_id = ctx.room.name
            call_row.status = "in_progress"
            await db.commit()
        # LiveKit passes userdata to tools unchanged. Keep it dictionary-shaped so
        # custom tools can update outcome and collected values during a call.
        userdata = {
            "business_id": config["business_id"],
            "agency_id": config["agency_id"],
            "call_id": call_id,
            "agent_name": config["agent_name"],
            "faq": config["faq"],
            "services": config["services"],
            "db": db,
            "outcome": None,
            "contact": metadata.get("contact", {}),
        }

        # Create and start agent session
        agent = VoiceDeskAgent(system_prompt=system_prompt, tools=tools)
        session = AgentSession(userdata=userdata)

        transcript = []
        start_time = __import__("time").time()
        outbound = bool(metadata.get("outbound"))
        outbound_number = metadata.get("phone_number")

        @session.on("conversation_item_added")
        def on_message(event):
            transcript.append({
                "role": event.item.role,
                "content": event.item.text_content,
                "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
            })

        logger.info(f"Starting agent for business={config['business_name']} call={call_id}")

        if outbound and outbound_number:
            # Do not speak the greeting while the recipient's phone is still
            # ringing.  LiveKit's SIP participant uses the target number as its
            # identity in the outbound-call service.
            await ctx.wait_for_participant(identity=outbound_number)

        await session.start(
            agent=agent,
            room=ctx.room,
            room_input_options=RoomInputOptions(),
        )

        # Generate greeting
        greeting = metadata.get("reminder_text") or "Start the configured customer call flow now."
        await session.generate_reply(instructions=greeting)

        await session.wait_for_disconnect()

        # Finalize
        duration_sec = int(__import__("time").time() - start_time)
        await finalize_call(call_id, transcript, duration_sec, userdata.get("outcome"))

    # Send pending SMS if any
    pending_sms = userdata.get("pending_sms")
    if pending_sms:
        await send_sms_confirmation(pending_sms["to"], pending_sms["message"])

    await db.close()

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
