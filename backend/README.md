# AgentDesk Backend

FastAPI backend for AgentDesk.

## What this service does

The backend powers the current AgentDesk product flow:

- supports the dashboard workspace
- manages agencies and businesses
- stores business and call data
- exposes API routes used by the frontend
- includes webhook surfaces for production-oriented integrations
- starts the voice agent worker used by the runtime

## Current local reality

For open source local use, the backend is set up around a simple demo path:

- Docker-first local development
- auto-bootstrapped demo agency in development
- no Clerk requirement for the OSS path
- OpenAI-first config defaults

The current frontend flow is:

1. landing page
2. first-run setup
3. dashboard workspace

## Run locally

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

## Local demo agency bootstrap

In development, the backend auto-creates a demo agency:

- `DEV_AGENCY_ID=dev-agency`
- `DEV_AGENCY_NAME=Local Demo Agency`

The frontend uses that local agency path directly.

## Minimal local env

The most important local settings are:

```env
OPENAI_API_KEY=sk-...
VOICE_MODE=demo
VOICE_PROVIDER=openai
```

## Important voice runtime note

`VOICE_PROVIDER=openai` is the simplified local-first mode, but it does **not** mean the whole runtime has been reduced to OpenAI alone.

The repo still includes LiveKit-oriented runtime infrastructure, and the broader production stack is still represented in config and code.

For real phone workflows, expect production-oriented setup with services such as:

- LiveKit
- Twilio
- Deepgram
- Cartesia

## API docs

When running locally, API docs are available at:

`http://localhost:8000/docs`
