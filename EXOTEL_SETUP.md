# Exotel trial + AgentDesk

This is the supported Indian/local-number setup for AgentDesk. Exotel's trial
assigns an ExoPhone; it does not attach a normal personal SIM number directly
to cloud code.

## 1. Create the trial

Create and verify an Exotel trial account. Exotel currently documents a limited
trial credit balance and a trial phone number. Before KYC, outbound calls may
be limited to verified users.

Set the API credentials from the Exotel dashboard:

```env
TELEPHONY_PROVIDER=exotel
EXOTEL_API_KEY=...
EXOTEL_API_TOKEN=...
EXOTEL_ACCOUNT_SID=...
EXOTEL_API_BASE_URL=https://api.in.exotel.com
EXOTEL_CALLER_ID=+919876543210
PUBLIC_BASE_URL=https://your-public-api.example.com
```

`EXOTEL_CALLER_ID` must be the verified ExoPhone in E.164 format. Restart the
backend, then open a workspace and click **Claim Number**. AgentDesk will attach
that ExoPhone to the workspace.

## 2. Test a reminder call through an Exotel Flow

Create an Exotel Flow that contains the reminder greeting/IVR, then set:

```env
EXOTEL_OUTBOUND_MODE=flow
EXOTEL_FLOW_URL=https://my.exotel.in/exoml/start/your-app-id
```

The reminder task calls Exotel's `Calls/connect` endpoint and sends status
updates to:

```text
POST {PUBLIC_BASE_URL}/webhooks/exotel/status
```

This is the fastest trial path. Exotel calls the customer and connects them to
the configured Flow.

## 3. Connect conversational AgentDesk calls through LiveKit SIP

Enable LiveKit Cloud Telephony and configure an Exotel SIP trunk. Exotel's
official LiveKit guide requires:

1. An Exotel DID, KYC, and SIP trunk.
2. A LiveKit inbound trunk containing that DID.
3. A LiveKit individual dispatch rule that creates `call-` rooms and dispatches
   the AgentDesk worker.
4. The Exotel trunk destination URI set to the LiveKit SIP endpoint.
5. An Exotel SIP digest credential for outbound calls.

For outbound conversational reminders, set:

```env
EXOTEL_OUTBOUND_MODE=livekit
EXOTEL_SIP_HOSTNAME=edge.in.exotel.com:443
EXOTEL_SIP_USERNAME=...
EXOTEL_SIP_PASSWORD=...
```

Then call the AgentDesk API:

```bash
curl -X POST http://localhost:8000/api/v1/calls/outbound \
  -H 'Content-Type: application/json' \
  -d '{
    "business_id": "YOUR_BUSINESS_ID",
    "phone_number": "+919876543210",
    "reminder_text": "This is a reminder for your appointment tomorrow."
  }'
```

The API creates a LiveKit room, writes the business/reminder metadata, and
creates a SIP participant through Exotel. The running AgentDesk worker answers
the room.

Use the exact SIP edge hostname and port Exotel assigns to your account. Do not
assume that one region or port works for every account.

## Troubleshooting

- `EXOTEL_CALLER_ID` missing: set it to the trial ExoPhone and restart the API.
- `401`: check API key/token/account SID and use the Mumbai API base URL.
- `403`/SIP failure: check Exotel digest credentials and LiveKit trunk config.
- Ringing with no agent audio: ensure the AgentDesk worker is running and the
  LiveKit room has an agent dispatched.
- Inbound call not routed: verify the Exotel Flow uses `sip:<trunk_sid>` and its
  destination URI points to LiveKit.

References:

- [Exotel trial account](https://docs.exotel.com/business-phone-system/create-a-trial-account)
- [Exotel Connect Two Numbers API](https://developer.exotel.com/docs/voice-v1/api-reference/connect-two-numbers)
- [Exotel SIP to LiveKit](https://docs.exotel.com/dynamic-sip-trunking/connect-exotel-sip-trunk-to-livekit)
- [LiveKit outbound SIP calls](https://docs.livekit.io/telephony/making-calls/outbound-calls/)
