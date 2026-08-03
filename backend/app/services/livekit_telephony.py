"""LiveKit SIP call orchestration for Exotel-backed phone agents."""

from __future__ import annotations

import json
import uuid

from app.core.config import get_settings
from app.services.telephony import TelephonyConfigurationError, normalize_e164


async def start_livekit_agent_call(
    *,
    business_id: str,
    phone_number: str,
    reminder_text: str = "",
    call_id: str | None = None,
    contact_id: str | None = None,
    campaign_id: str | None = None,
    flow_version_id: str | None = None,
    flow_data: dict | None = None,
) -> dict[str, str]:
    """Create a room, attach metadata, and dial through an Exotel SIP trunk.

    The LiveKit worker already runs the AgentDesk agent for newly populated
    rooms.  The room metadata lets the existing entrypoint load the correct
    business configuration and speak the reminder.
    """

    settings = get_settings()
    if settings.telephony_provider.lower() != "exotel":
        raise TelephonyConfigurationError(
            "LiveKit Exotel dialing requires TELEPHONY_PROVIDER=exotel"
        )
    missing = [
        name
        for name, value in (
            ("LIVEKIT_URL", settings.livekit_url),
            ("LIVEKIT_API_KEY", settings.livekit_api_key),
            ("LIVEKIT_API_SECRET", settings.livekit_api_secret),
            ("EXOTEL_CALLER_ID", settings.exotel_caller_id),
        )
        if not value
    ]
    if not settings.livekit_sip_outbound_trunk_id:
        missing.extend(
            name
            for name, value in (
                ("EXOTEL_SIP_HOSTNAME", settings.exotel_sip_hostname),
                ("EXOTEL_SIP_USERNAME", settings.exotel_sip_username),
                ("EXOTEL_SIP_PASSWORD", settings.exotel_sip_password),
            )
            if not value
        )
    if missing:
        raise TelephonyConfigurationError(
            "LiveKit/Exotel outbound calling is missing: " + ", ".join(missing)
        )

    target = normalize_e164(phone_number)
    room_name = f"outbound-{uuid.uuid4().hex}"
    metadata = json.dumps(
        {
            "business_id": business_id,
            "phone_number": target,
            "caller_number": target,
            "outbound": True,
            "reminder_text": reminder_text,
            "call_id": call_id,
            "contact_id": contact_id,
            "campaign_id": campaign_id,
            "flow_version_id": flow_version_id,
            "flow_data": flow_data,
        }
    )

    from livekit import api
    from livekit.protocol.sip import CreateSIPParticipantRequest, SIPOutboundConfig

    async with api.LiveKitAPI(
        url=settings.livekit_url,
        api_key=settings.livekit_api_key,
        api_secret=settings.livekit_api_secret,
    ) as livekit_api:
        await livekit_api.room.create_room(
            api.CreateRoomRequest(name=room_name, metadata=metadata, empty_timeout=300)
        )

        request_kwargs = {
            "sip_call_to": target,
            "room_name": room_name,
            "participant_identity": target,
            "participant_name": "Reminder recipient",
            "wait_until_answered": False,
        }
        if settings.livekit_sip_outbound_trunk_id:
            request_kwargs["sip_trunk_id"] = settings.livekit_sip_outbound_trunk_id
        else:
            request_kwargs["trunk"] = SIPOutboundConfig(
                hostname=settings.exotel_sip_hostname,
                destination_country="IN",
                auth_username=settings.exotel_sip_username,
                auth_password=settings.exotel_sip_password,
            )
            request_kwargs["sip_number"] = normalize_e164(settings.exotel_caller_id)

        participant = await livekit_api.sip.create_sip_participant(
            CreateSIPParticipantRequest(**request_kwargs)
        )

    return {
        "room_name": room_name,
        "participant_identity": target,
        "provider_call_id": getattr(participant, "sip_call_id", "") or "",
    }
