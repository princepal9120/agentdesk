---
title: "Keep PSTN provider logic behind a telephony boundary"
date: 2026-08-03
category: architecture-patterns
module: "telephony and LiveKit integration"
problem_type: architecture_pattern
component: service_object
severity: medium
applies_when:
  - "A voice agent must support regional PSTN carriers or more than one provider"
  - "A trial carrier assigns a verified number instead of provisioning one through the application"
  - "PSTN signaling and realtime media are owned by different services"
related_components:
  - background_job
  - database
  - assistant
tags:
  - telephony
  - exotel
  - livekit
  - sip
  - pstn
---

# Keep PSTN provider logic behind a telephony boundary

## Context

AgentDesk originally treated Twilio as both the phone-number lifecycle and call-execution layer. That becomes restrictive for Indian/local-number deployments: an Exotel trial provides a verified ExoPhone and Voice Flow, while conversational calls still need a realtime media system such as LiveKit.

The durable boundary is therefore not “replace Twilio with Exotel.” It is a provider-neutral telephony layer that separates four concerns:

1. Carrier credentials, number ownership, and provider call IDs.
2. Simple reminder calls through a carrier-managed flow.
3. Conversational calls through a SIP connection into the agent room.
4. Status callbacks and local call records.

## Guidance

Keep provider-specific code in small services and store provider-neutral identifiers on domain models. In this implementation, `ExotelClient` owns the Voice API request and `start_livekit_agent_call` owns room/SIP orchestration; the API, notification task, webhook, and dashboard use provider-neutral fields.

```python
class OutboundCallResult:
    provider_call_id: str
    status: str
    raw: dict[str, Any]
```

Use two outbound modes instead of forcing every trial account to support SIP:

- **Flow mode:** call the customer with Exotel's `Calls/connect` endpoint and connect them to an Exotel Flow. This is the smallest trial-compatible reminder path.
- **LiveKit mode:** create a room with business and reminder metadata, then create a LiveKit SIP participant through the Exotel trunk. This is the conversational-agent path.

Number lifecycle must also reflect provider semantics. Twilio can provision and release a number through its API. Exotel trial onboarding assigns an ExoPhone in the dashboard, so “Claim Number” attaches the configured verified number to a workspace and “Release” clears only the workspace mapping.

Normalize every customer and caller number at the boundary. The current implementation accepts common formatting characters, then requires E.164 output before sending a carrier request (`backend/app/services/telephony.py:34-40`). This prevents provider-specific formatting from leaking into tasks, routes, or database records.

For conversational calls, put the business ID, target number, outbound marker, reminder text, and optional flow metadata in room metadata. The worker reads job metadata first and room metadata second, waits for the SIP participant before greeting, and then uses the reminder text (`backend/agent/agent.py:225-314`). This avoids speaking while the phone is still ringing and keeps the worker independent of the carrier API.

Treat provider callbacks as idempotent. The Exotel webhook accepts JSON or form payloads, finds the local record by `provider_call_id`, maps provider statuses to local statuses, and safely ignores callbacks for calls created only during a provider smoke test (`backend/app/api/webhooks.py:128-175`).

## Why This Matters

The carrier and realtime-agent layers have different regional, commercial, and operational constraints. Keeping them separate allows AgentDesk to use Exotel for Indian PSTN access, Twilio for an existing US installation, and LiveKit for the agent media path without rewriting business flows or notification jobs.

It also makes trial limitations explicit. A normal personal SIM is not silently treated as an application-owned number; the configured ExoPhone is verified and attached deliberately. Provider-specific credentials remain in configuration, while the database stores stable `telephony_provider`, `provider_number_id`, and `provider_call_id` fields (`backend/app/models/business.py:16-23`, `backend/app/models/call.py:18-25`).

## When to Apply

- When the application may serve multiple countries or carriers.
- When a carrier's trial, KYC, or number-provisioning workflow differs from its paid workflow.
- When a phone provider supplies PSTN connectivity but an agent platform owns realtime rooms, dispatch, and media.
- When background reminders and interactive calls share call records but use different provider paths.

## Examples

Trial reminder configuration:

```env
TELEPHONY_PROVIDER=exotel
EXOTEL_API_KEY=...
EXOTEL_API_TOKEN=...
EXOTEL_ACCOUNT_SID=...
EXOTEL_CALLER_ID=+919876543210
EXOTEL_OUTBOUND_MODE=flow
EXOTEL_FLOW_URL=https://my.exotel.in/exoml/start/your-app-id
```

Conversational-agent configuration:

```env
TELEPHONY_PROVIDER=exotel
EXOTEL_OUTBOUND_MODE=livekit
EXOTEL_SIP_HOSTNAME=edge.in.exotel.com:443
EXOTEL_SIP_USERNAME=...
EXOTEL_SIP_PASSWORD=...
```

The resulting call path is:

```text
Reminder task or API
        ↓
Provider-neutral telephony service
        ├── Exotel Calls/connect → Exotel Flow
        └── LiveKit room + SIP participant → Exotel trunk → PSTN
        ↓
Exotel callback → local provider_call_id/status
```

The implementation and setup guide are [EXOTEL_SETUP.md](../../../EXOTEL_SETUP.md). The external integration boundaries are documented by [Exotel's trial guide](https://docs.exotel.com/business-phone-system/create-a-trial-account), [Exotel's Voice API](https://developer.exotel.com/docs/voice-v1/api-reference/connect-two-numbers), [Exotel's LiveKit SIP guide](https://docs.exotel.com/dynamic-sip-trunking/connect-exotel-sip-trunk-to-livekit), and [LiveKit outbound calls](https://docs.livekit.io/telephony/making-calls/outbound-calls/).

## Related

- [EXOTEL_SETUP.md](../../../EXOTEL_SETUP.md)
- `backend/app/services/telephony.py`
- `backend/app/services/livekit_telephony.py`
