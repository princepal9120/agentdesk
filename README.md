# AgentDesk ☎

> **Run a white-label AI voice-agent dashboard locally in ONE command — no database, no keys required to boot.**

AgentDesk is an open-source, white-label voice agent platform. Pick a template, answer 5 questions, and have a live AI phone agent handling real calls. The dashboard, templates, businesses, and API all run with zero configuration; voice needs one API key.

```bash
make up
```

---

## ✨ What It Does

| Feature | Description |
|---|---|
| 🎙 **Live voice calls** | Real phone calls via Twilio or Exotel + LiveKit/Sarvam voice models |
| 🧠 **Niche templates** | Restaurant, dental, real estate, HR, e-commerce |
| 📊 **Dashboard** | Call logs, transcripts, bookings, analytics |
| 🗄 **Zero-install DB** | SQLite by default — no Postgres/Redis needed |
| 🐳 **One-command Docker** | `make up` boots API + dashboard, zero keys |
| 🔒 **Self-hosted** | Your data stays on your server |

---

## ⚡ Quickstart (one command)

### Zero-key dashboard (recommended)

```bash
git clone https://github.com/princepal9120/agentdesk
cd agentdesk
make up
```

That's it. No `.env` file, no API keys. Open **http://localhost:3000** → dashboard ready. API docs at **http://localhost:8000/docs**.

### Add voice (one key)

```bash
cp backend/.env.example backend/.env
# edit backend/.env and set SARVAM_API_KEY=sk_... (or OPENAI_API_KEY=sk-...)
make voice
```

The voice worker only starts with `--profile voice`, so a key-free `make up` never waits on a missing key.

### Legacy manual path (no Docker)

```bash
# backend
cd backend && uv pip install --system -e . && uvicorn app.main:app --reload
# frontend (another terminal)
cd frontend && npm install && npm run dev
```

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
├── cli/               # (deprecated) use `make up` for local onboarding
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

**Zero variables required to boot the dashboard.** `make up` runs with no `.env` and no keys.

For voice, set **one** variable in `backend/.env`:

```env
SARVAM_API_KEY=sk_...      # or OPENAI_API_KEY=sk-...
```

Then run `make voice`. For real US phone calls with the legacy path, add:

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
4. Connects to the local API for dashboard + call logs
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤ by [Prince Pal](https://github.com/princepal9120)
