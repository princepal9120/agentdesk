# AgentDesk Setup

## Recommended onboarding path

Use OpenAI-only demo mode first.

### Requirements
- Docker
- Docker Compose
- OpenAI API key

### Quickstart

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
```

Then run:

```bash
docker compose up --build
```

## Local URLs

- Dashboard: <http://localhost:3000>
- API: <http://localhost:8000>
- API docs: <http://localhost:8000/docs>

## Demo mode

Demo mode is for smooth OSS onboarding.

It gives users:
- local dashboard access
- local business creation
- API exploration
- a non-blocking agent container even when full telephony stack is not configured

Demo mode does **not** mean full live phone calling works.

## Production mode

For real phone calls, switch to:

```env
VOICE_MODE=production
```

Then also provide:
- OpenAI
- Deepgram
- Cartesia
- LiveKit
- Twilio

## Local auth behavior

In development:
- backend auto-creates `dev-agency`
- frontend talks directly to the local API without extra auth headers
- Clerk is not required for initial use

## Optional services

Not needed for local-first onboarding:
- Clerk
- Stripe

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
