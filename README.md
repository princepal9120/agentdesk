# AgentDesk

**White-label AI voice agent platform for agencies.**

Deploy AI receptionists for your clients in 5 minutes. They answer calls 24/7, book appointments, and handle FAQs. Your clients get a white-labeled dashboard. You keep the margin.

> Inspired by [BookedIn.ai](https://bookedin.ai) ($56K MRR) — simpler, cheaper, faster to start.

---

## How It Works

```
Agency signs up → Adds clients → Picks a template → Gets a US phone number
→ AI agent answers all calls → Client sees dashboard with calls + bookings
→ Agency charges client $100-300/mo, pays us $49-99/mo
```

---

## Stack

- **Voice:** LiveKit + Deepgram Nova-3 + GPT-4o-mini + Cartesia Sonic
- **Backend:** FastAPI (Python 3.12) + PostgreSQL + Redis
- **Frontend:** Next.js 15 + Tailwind CSS v4 + shadcn/ui
- **Phone:** Twilio (SIP inbound)
- **Auth:** Clerk | **Payments:** Stripe | **Deploy:** Railway + Vercel

---

## Quick Start

```bash
git clone https://github.com/princepal9120/voicedesk
cd voicedesk

# Start backend + DB + Redis
cp backend/.env.example backend/.env
# Fill in your API keys in backend/.env
docker-compose up

# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

---

## Branches

| Branch | Description |
|--------|-------------|
| `main` | AgentDesk — full multi-tenant agency platform |
| `main-2` | VoiceDesk OSS — single-tenant, self-hostable, open source |

---

## Pricing

| Plan | Price | Clients | Calls/mo |
|------|-------|---------|----------|
| Starter | $49/mo | 3 | 300 |
| Pro | $99/mo | 10 | 1,000 |
| Agency | $199/mo | Unlimited | Unlimited |

---

## Project Structure

```
voicedesk/
├── backend/
│   ├── app/          # FastAPI application
│   ├── agent/        # LiveKit voice agent
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/         # Next.js 15 dashboard (coming soon)
├── docs/
│   └── PRD.md        # Full product requirements
└── docker-compose.yml
```

---

## License

AgentDesk (`main` branch): Proprietary
VoiceDesk (`main-2` branch): MIT
