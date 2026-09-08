# AgentDesk Setup

## Recommended path (one command)

```bash
git clone https://github.com/princepal9120/agentdesk.git
cd agentdesk
make up
```

That boots the API + dashboard with **no `.env` file and no API keys**. Dashboard: <http://localhost:3000>. API: <http://localhost:8000>.

To add voice later:

```bash
make setup        # copies .env templates if missing
# edit backend/.env and set SARVAM_API_KEY or OPENAI_API_KEY
make voice        # starts the voice worker too
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

- `VOICE_PROVIDER=sarvam` uses Sarvam Saaras STT, Sarvam LLM, and Bulbul TTS
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

- OpenAI (legacy compatibility path)
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
