# AgentDesk

Open-source white-label AI voice agent platform. Deploy AI receptionists for any business in minutes.

> Built with LiveKit, Deepgram, GPT-4o-mini, and Cartesia.

---

## What it does

AgentDesk lets you run an AI receptionist that:
- Answers inbound calls with a natural voice
- Books appointments, answers FAQs, takes messages, handles reservations
- Works out of the box for salons, restaurants, repair shops, or any general business
- Gives you a dashboard to manage multiple client businesses

---

## Stack

| Layer | Tech |
|---|---|
| Voice pipeline | LiveKit + Deepgram STT + GPT-4o-mini + Cartesia TTS |
| Backend API | FastAPI + SQLAlchemy async + PostgreSQL |
| Phone numbers | Twilio SIP |
| Auth | Clerk (JWT) |
| Frontend | Next.js 15 + Tailwind |
| Cache | Redis |
| Billing | Stripe (optional) |

---

## Quick start

### Prerequisites

- Docker + Docker Compose
- Python 3.12+
- Node 20+
- API keys: OpenAI, Deepgram, Cartesia, Twilio, LiveKit

### 1. Clone and configure

```bash
git clone https://github.com/princepal9120/agentdesk.git
cd agentdesk

cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

### 2. Start backend

```bash
docker compose up -d
```

This starts:
- FastAPI on `http://localhost:8000`
- PostgreSQL on `5432`
- Redis on `6379`

### 3. Run database migrations

```bash
cd backend
pip install uv && uv sync
uv run alembic upgrade head
```

### 4. Start the voice agent

```bash
cd backend
uv run python run_agent.py
```

### 5. Start frontend

```bash
cd frontend
cp .env.example .env
# Add your Clerk + API URL
npm install
npm run dev
```

Dashboard at `http://localhost:3000`

---

## Architecture

```
Inbound call
    |
Twilio SIP
    |
LiveKit room (room = call-{CallSid})
    |
VoiceDeskAgent
    |-- Deepgram Nova-3 (STT)
    |-- GPT-4o-mini (LLM + tools)
    |-- Cartesia Sonic (TTS)
    |-- Silero (VAD)
    |
Tools: book_appointment, check_availability, answer_faq,
       take_message, list_services, schedule_callback ...
```

---

## Agent verticals

| Vertical | Template | Tools enabled |
|---|---|---|
| `salon` | Hair/nail salon receptionist | Booking, services, hours |
| `restaurant` | Restaurant host | Reservations, menu, hours |
| `repair` | Repair shop | Intake, estimates, callbacks |
| `general` | General business | FAQ, messages, callbacks |

---

## API

```
POST   /api/v1/agencies/           Create agency
GET    /api/v1/agencies/me         Get my agency
GET    /api/v1/agencies/me/usage   Usage stats

POST   /api/v1/businesses/         Add client business
GET    /api/v1/businesses/         List businesses
GET    /api/v1/businesses/{id}     Get business
POST   /api/v1/businesses/{id}/provision-number  Get a Twilio number

GET    /api/v1/calls/              List calls (filter by business)

POST   /api/v1/billing/checkout    Stripe checkout
POST   /api/v1/billing/portal      Stripe portal

POST   /webhooks/twilio/voice      Inbound call hook
POST   /webhooks/twilio/status     Call status updates
POST   /webhooks/livekit           LiveKit room events
```

---

## Environment variables

```env
# App
DATABASE_URL=postgresql+asyncpg://agentdesk:agentdesk_dev@localhost:5432/agentdesk
REDIS_URL=redis://localhost:6379/0
APP_ENV=development

# Auth (Clerk)
CLERK_SECRET_KEY=sk_...
CLERK_JWT_ISSUER=https://...clerk.accounts.dev

# AI
OPENAI_API_KEY=sk-...
DEEPGRAM_API_KEY=...
CARTESIA_API_KEY=...

# Voice / Telephony
LIVEKIT_URL=wss://...
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...

# Billing (optional)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## License

MIT — use it however you want.

---

## Contributing

PRs welcome. Open an issue first for anything non-trivial.
