# AgentDesk

Open-source white-label AI voice agent platform with a branding-first landing page, a simple first-run setup path, and a dashboard workspace behind it.

> Built with FastAPI, Postgres, Redis, Next.js, and an OpenAI-first local demo path.

---

## Current product flow

Today the product is shaped like this:

1. **Branding-first landing page** at `/`
2. **First-run setup path** for local demo configuration
3. **Dashboard workspace** at `/dashboard`

This repo already reflects that launch flow in the frontend.

---

## What is ready now

For local open source use, AgentDesk is best understood as an **OpenAI-first demo environment**:

- landing page is the public-facing entry point
- dashboard loads locally and lists or creates businesses
- backend bootstraps a local demo agency automatically in development
- Clerk is **not required** for the local OSS path
- local API docs are available at `http://localhost:8000/docs`
- Docker compose starts the main app stack quickly

---

## What is production-next

The repo still contains production-oriented voice integrations and webhook surfaces, including:

- LiveKit
- Twilio
- Deepgram
- Cartesia
- Stripe

Those pieces are part of the broader production direction, but the polished public launch story right now is the landing page, setup path, and dashboard workspace, not a fully verified end-to-end phone deployment.

In particular:

- `VOICE_PROVIDER=openai` is the simplified local-first mode
- the backend and agent still assume LiveKit-based runtime infrastructure
- real phone calling still depends on production provider wiring and verification

---

## Quickstart

```bash
git clone https://github.com/princepal9120/agentdesk.git
cd agentdesk
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set at least this in `backend/.env`:

```env
OPENAI_API_KEY=sk-...
VOICE_MODE=demo
VOICE_PROVIDER=openai
```

Then run:

```bash
docker compose up --build
```

Open:

- Landing page: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- API docs: `http://localhost:8000/docs`

---

## Local OSS mode

Use this mode if you want the simplest path to trying the project locally.

### Local defaults

- Docker-first startup
- local demo agency bootstrapped automatically
- no Clerk setup required
- no Stripe setup required
- OpenAI-first config path

### What to expect

This mode is good for:

- exploring the product flow
- creating businesses in the dashboard
- testing the API locally
- iterating on the landing page and workspace experience

This mode should **not** be described as fully production-ready telephony.

---

## Environment overview

### Backend

Common local minimum:

```env
OPENAI_API_KEY=sk-...
VOICE_MODE=demo
VOICE_PROVIDER=openai
```

Production-oriented integrations remain available in the backend env file for later rollout:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `DEEPGRAM_API_KEY`
- `CARTESIA_API_KEY`
- Stripe keys

### Frontend

Local frontend env is intentionally minimal:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

No Clerk env vars are needed for the OSS demo path.

---

## Repo structure

- `frontend/app/page.tsx` - branding-first landing page
- `frontend/app/dashboard/page.tsx` - dashboard workspace
- `backend/app/main.py` - API app and local demo agency bootstrap
- `backend/agent/provider_factory.py` - OpenAI-first vs full provider runtime selection

---

## Honest status

AgentDesk has a strong local product shell today.

What feels real now:

- the landing page
- the first-run local setup path
- the dashboard workspace
- the OpenAI-first onboarding story

What should still be treated as production-next:

- full end-to-end phone flow validation
- hardened multi-provider voice deployment
- production auth and billing rollout

---

## License

MIT
