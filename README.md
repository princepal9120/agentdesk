# AgentDesk

Open-source white-label AI voice agent platform. Deploy AI receptionists for any business in minutes.

> Built with FastAPI, Postgres, Redis, Next.js, and an OpenAI-first local onboarding path.

---

## Modes

### 1. OpenAI-first demo mode
Best for open source onboarding.

Use:
- Docker
- OpenAI API key
- `VOICE_MODE=demo`
- `VOICE_PROVIDER=openai`

What this gives you:
- dashboard access
- business creation
- API exploration
- local-first setup with fewer provider assumptions

### 2. Full production voice mode
Best for real phone calls.

Use:
- OpenAI
- Deepgram
- Cartesia
- LiveKit
- Twilio
- `VOICE_MODE=production`
- `VOICE_PROVIDER=full`

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
- `http://localhost:3000`
- `http://localhost:8000/docs`

---

## Important honesty note

AgentDesk is now structured for an OpenAI-only path, but **full end-to-end OpenAI-only telephony is not fully verified yet**.

What is true today:
- local onboarding is much smoother
- OpenAI-first provider mode exists in code/config
- full provider mode remains intact

What still needs runtime verification:
- full voice transport behavior in OpenAI-only mode
- call flow parity without the full provider stack

See `OPENAI_ONLY.md` for details.

---

## Local-first defaults

- Docker first
- local demo agency bootstrapped automatically
- Clerk optional for onboarding
- Stripe optional for onboarding
- OpenAI-first config path

---

## Production stack

For full production voice flow, keep using:
- OpenAI
- Deepgram
- Cartesia
- LiveKit
- Twilio

---

## License

MIT
