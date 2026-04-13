# Local Setup

Get AgentDesk running on your machine in under 10 minutes.

## What you need

- [Docker + Docker Compose](https://docs.docker.com/get-docker/)
- API keys for: OpenAI, Deepgram, Cartesia, LiveKit, Twilio

That's it. Python and Node are not required locally — Docker handles everything.

---

## Step 1: Clone

```bash
git clone https://github.com/princepal9120/agentdesk.git
cd agentdesk
git checkout agentdesk-oss
```

---

## Step 2: Configure environment

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in your keys:

```env
# Required — AI
OPENAI_API_KEY=sk-...
DEEPGRAM_API_KEY=...
CARTESIA_API_KEY=...

# Required — LiveKit (get one free at livekit.io)
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=API...
LIVEKIT_API_SECRET=...

# Required — Twilio (for inbound calls)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...

# Auth (leave as-is for local dev — no Clerk needed)
DEV_AGENCY_ID=dev-agency
APP_ENV=development
```

> For local dev you do NOT need Clerk, Stripe, or a domain. The API accepts
> `X-Dev-Agency-Id: dev-secret-key` for auth when `APP_ENV=development`.

---

## Step 3: Start everything

```bash
docker compose up --build
```

First run takes 2-3 minutes to build the images.

Once up:

| Service | URL |
|---|---|
| Dashboard | http://localhost:3000 |
| API | http://localhost:8000 |
| API docs | http://localhost:8000/docs |
| Postgres | localhost:5432 |
| Redis | localhost:6379 |

The API container automatically runs `alembic upgrade head` on startup — no manual migration step needed.

---

## Step 4: Add your first business

1. Open http://localhost:3000
2. Click **Add business**
3. Enter a name and pick a vertical (salon, restaurant, repair, general)
4. On the business page, enter an area code and click **Get a number** to provision a Twilio number

---

## Step 5: Receive calls

When a call comes in to your Twilio number:

1. Twilio sends the call to `/webhooks/twilio/voice`
2. The API creates a LiveKit room and redirects via SIP
3. The voice agent joins the room and handles the call

For Twilio to reach your local machine you need a tunnel:

```bash
# Install ngrok (or use Cloudflare Tunnel)
ngrok http 8000
```

Then in your Twilio console, set the inbound call webhook to:
```
https://YOUR-NGROK-URL.ngrok.io/webhooks/twilio/voice
```

---

## Stopping

```bash
docker compose down
```

To also wipe the database:

```bash
docker compose down -v
```

---

## Rebuilding after code changes

```bash
docker compose up --build api agent
```

Frontend only:

```bash
docker compose up --build frontend
```

---

## Troubleshooting

**API fails to start**
Check `docker compose logs api` — usually a missing env var.

**"relation does not exist" error**
Migration didn't run. Try:
```bash
docker compose exec api alembic upgrade head
```

**Agent won't connect to LiveKit**
Make sure `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` are set correctly.

**Twilio call doesn't reach the agent**
Make sure your ngrok URL is set as the Twilio webhook and the tunnel is running.
