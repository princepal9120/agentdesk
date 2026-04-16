# AgentDesk Setup

## Recommended path

Start with the local OpenAI-first demo path.

That is the most honest and supported way to experience the repo today.

## What you are setting up

The current launch flow is:

1. landing page at `/`
2. first-run local setup
3. dashboard workspace at `/dashboard`

The goal of local setup is to get that flow running quickly without requiring Clerk or a full production telephony stack.

## Requirements

- Docker
- Docker Compose
- OpenAI API key

## Quickstart

```bash
git clone https://github.com/princepal9120/agentdesk.git
cd agentdesk
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` to at least include:

```env
OPENAI_API_KEY=sk-...
VOICE_MODE=demo
VOICE_PROVIDER=openai
```

Then run:

```bash
docker compose up --build
```

## Local URLs

- Landing page: <http://localhost:3000>
- Dashboard: <http://localhost:3000/dashboard>
- API: <http://localhost:8000>
- API docs: <http://localhost:8000/docs>

## What demo mode gives you

Demo mode is for smooth open source onboarding.

It gives you:

- the public landing page
- the dashboard workspace
- local business creation
- API exploration
- a bootstrapped demo agency in development
- no Clerk dependency for first use

## What demo mode does not promise

Demo mode should not be treated as fully verified live telephony.

Important nuance:

- `VOICE_PROVIDER=openai` is the simplified local-first mode
- the runtime still keeps LiveKit-oriented infrastructure in the stack
- real phone workflows still belong in the production-oriented setup path

## Local auth behavior

In development:

- backend auto-creates `dev-agency`
- frontend talks directly to the local API
- no Clerk setup is required for the OSS demo path

## Optional services for local onboarding

You do **not** need these to get the local demo running:

- Clerk
- Stripe
- Twilio phone number provisioning

## Production-oriented mode

If you want to move beyond the demo experience, switch to:

```env
VOICE_MODE=production
VOICE_PROVIDER=full
```

Then expect to configure the broader provider stack, including:

- OpenAI
- LiveKit
- Twilio
- Deepgram
- Cartesia

That path is better understood as production-next, not the default OSS quickstart.

## Common commands

### Start
```bash
docker compose up --build
```

### Stop
```bash
docker compose down
```

### Reset
```bash
docker compose down -v
```

### Logs
```bash
docker compose logs api
docker compose logs frontend
docker compose logs agent
```
