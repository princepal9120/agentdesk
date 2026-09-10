# AgentDesk ☎

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Deploy a custom AI voice receptionist for ANY business in 5 minutes — no database setup required.**

AgentDesk is an open-source, white-label voice agent platform. Pick a template, answer 5 questions, and have a live AI phone agent handling real calls.

```bash
python -m cli.init
```

---

## ✨ What It Does

| Feature | Description |
|---|---|
| 🎙 **Live voice calls** | Real phone calls via Twilio or Exotel + LiveKit/Sarvam voice models |
| 🧠 **Niche templates** | Restaurant, dental, real estate, HR, e-commerce |
| 📊 **Dashboard** | Call logs, transcripts, bookings, analytics |
| 🗄 **Zero-install DB** | SQLite by default — no Postgres/Redis needed |
| 🌐 **Auto tunnel** | Cloudflare tunnel auto-configured for Twilio |
| 🔒 **Self-hosted** | Your data stays on your server |

---

## ⚡ Quickstart (5 minutes)

### Option A — Interactive Setup Wizard (recommended)

```bash
# 1. Clone the repo
git clone https://github.com/princepal9120/agentdesk
cd agentdesk

# 2. Run the setup wizard (no dependencies needed!)
python -m cli.init

# 3. Start the backend
cd backend && uvicorn app.main:app --reload

# 4. Start the frontend
cd frontend && npm install && npm run dev
```

### Option B — Docker (single command)

```bash
git clone https://github.com/princepal9120/agentdesk
cd agentdesk

# Copy and fill in ONLY your Sarvam key
cp backend/.env.example backend/.env
# Edit backend/.env and add: SARVAM_API_KEY=sk_...

docker compose up
```

Open **http://localhost:3000** → dashboard ready.

Live landing: **https://agentdesk.princepal.dev**

---

## 🧩 Templates

The setup wizard lets you pick a niche preset. Each template includes a battle-tested system prompt, tool definitions, and FAQ data.

| Template | Use Case | Agent Name |
|---|---|---|
| `restaurant` | Table reservations, menu questions | Bella |
| `dental` | Appointment scheduling, insurance queries | Aria |
| `real-estate` | Lead qualification, property viewings | Max |
| `hr` | Candidate phone screening | Sam |
| `ecommerce` | Order tracking, returns, support | Nova |
| `custom` | Blank scaffold — fully configurable | Alex |

---

## 🏗 Architecture

```
agentdesk/
├── cli/               # Setup wizard (python -m cli.init)
├── backend/           # FastAPI + SQLAlchemy + SQLite/Postgres
│   ├── app/
│   │   ├── api/       # REST endpoints
│   │   ├── core/      # DB, config, rate limiting
│   │   └── models/    # Agency, Business, Call, Booking
│   ├── templates/     # Niche preset JSON files
│   └── agent/         # LiveKit voice agent runtime
└── frontend/          # Next.js dashboard
```

**Default stack (local dev):**
- Database: SQLite (zero install — file at `agentdesk.db`)
- Rate limiting: In-memory (no Redis needed)
- Voice: Sarvam Saaras + Sarvam-30B + Bulbul

**Production stack:**
- Database: PostgreSQL (`DATABASE_URL=postgresql+asyncpg://...`)
- Rate limiting: Redis (`REDIS_URL=redis://...`)
- Voice: LiveKit + Deepgram + Cartesia

---

## 🔑 Minimum Configuration

Only **one** variable required for local demo:

```env
SARVAM_API_KEY=sk_...
```

For real US phone calls with the legacy path, add:

```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

For Indian/local-number testing, use the Exotel trial path. Configure the
trial ExoPhone and API credentials, then follow [EXOTEL_SETUP.md](EXOTEL_SETUP.md):

```env
TELEPHONY_PROVIDER=exotel
EXOTEL_API_KEY=...
EXOTEL_API_TOKEN=...
EXOTEL_ACCOUNT_SID=...
EXOTEL_CALLER_ID=+919876543210
```

Exotel inbound AI calls use SIP → LiveKit; reminder calls can use an Exotel
Flow or the LiveKit SIP agent path. A regular personal SIM number cannot be
used directly without carrier forwarding, SIP/BYOC, or porting.

---

## 📖 How It Works

1. **`agentdesk init`** — wizard asks your business type, name, website URL, and API keys
2. Scrapes your website to build an instant knowledge base
3. Generates a custom system prompt from your template
4. Auto-configures Twilio webhooks via Cloudflare tunnel
5. Saves everything to local SQLite — no external DB needed

---

## 🗺 Roadmap

- [x] Call-flow builder (step-based MVP)
- [x] Local-first Sarvam voice provider
- [ ] PDF/document knowledge base upload
- [ ] Multi-language voice support
- [ ] One-click Railway/Render deploy button

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on local environment setup, style guidelines, and our pull request process.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Add a template or improve DX
4. Open a PR

New templates especially welcome — each niche helps more businesses deploy voice AI.

---

## 📄 License

[MIT](https://opensource.org/licenses/MIT) — OSI-approved. SPDX: `MIT`. Full text in [LICENSE](LICENSE).

---

Built with ❤ by [Prince Pal](https://github.com/princepal9120)
