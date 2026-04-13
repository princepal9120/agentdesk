# AgentDesk Backend

FastAPI backend for AgentDesk, an open-source white-label AI voice agent platform.

## What this service does

- manages agencies and client businesses
- stores agent configuration
- tracks call logs
- handles Twilio and LiveKit webhooks
- provides the API used by the dashboard

## Local development

AgentDesk is designed to run Docker-first for local setup.

From the repo root:

```bash
docker compose up --build
```

That starts:
- Postgres
- Redis
- FastAPI API
- voice agent worker
- Next.js frontend

## Dev auth

In local development, the backend auto-creates a demo agency:

- `DEV_AGENCY_ID=dev-agency`
- `DEV_AGENCY_NAME=Local Demo Agency`

The frontend uses this automatically through the `X-Dev-Agency-Id` header.

No Clerk setup is required for basic local usage.

## Notes

- Twilio, LiveKit, OpenAI, Deepgram, and Cartesia are still required for real voice calls.
- You can still explore the dashboard and create businesses locally before wiring production telephony.
- API docs are available at `http://localhost:8000/docs`
