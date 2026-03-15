# AgentDesk — White-Label AI Voice Agent Platform
## Product Requirements Document v2.0
*Created: 2026-03-15 | Updated: 2026-03-15 | Author: Prince Pal*
*Inspired by: BookedIn.ai ($56K MRR) — simpler, faster to build*

---

## 1. Executive Summary

AgentDesk is a B2B2C platform where AI freelancers and small agencies deploy white-labeled voice agents for their clients (salons, restaurants, repair shops, etc.) without building the infra themselves.

**Competitor:** BookedIn.ai ($56K MRR) — they have a full no-code visual builder.
**Our edge:** Simpler (template-based), cheaper, faster to start. Target the solo dev/freelancer who just wants something that works.

**One-liner:** Launch an AI receptionist for your client in 5 minutes. Charge them $150/mo. Keep the margin.

---

## 2. Who Buys This (ICP)

**Primary:** AI freelancers and micro-agencies (1-5 person shops)
- They promise clients "AI automation" but hate stitching Vapi + n8n + Zapier
- They want a white-label platform they can resell
- They're active on Twitter, Reddit r/agency, YouTube

**Secondary:** Solo entrepreneurs who want a done-for-them solution
- Local business consultant
- Marketing agency adding AI as a service

**End clients (who don't touch the platform):**
- Hair salons, spas, barbershops
- Restaurants (reservations)
- Auto repair shops
- Plumbers, electricians (lead capture)
- Gyms and fitness studios

---

## 3. How It Works

```
Agency signs up on AgentDesk
  → Creates a workspace (white-labeled)
  → Adds a client (business name, vertical, hours)
  → Picks a template (Salon / Restaurant / General)
  → Agent auto-configured from template
  → Gets a dedicated US phone number (Twilio)
  → Shares client dashboard link with their client
  → Client sees calls, transcripts, bookings
  → Agency charges client $100-300/mo, pays us $49-99/mo
```

---

## 4. Tech Stack

### Backend
| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **FastAPI** (Python 3.12) | Async, production-grade |
| Voice Infra | **LiveKit Cloud** | Best WebRTC agent framework |
| STT | **Deepgram Nova-3** | Best accuracy + streaming |
| LLM | **GPT-4o-mini** | Fast, cheap, great tool use |
| TTS | **Cartesia Sonic** | Lowest latency (~90ms) |
| Phone | **Twilio Voice** (SIP) | Industry standard |
| Database | **PostgreSQL 16** (Supabase) | Multi-tenant, row-level security |
| Cache | **Redis** (Upstash serverless) | Session state, rate limiting |
| Auth | **Clerk** (multi-tenant orgs) | Built-in agency + client roles |
| Payments | **Stripe** | Subscriptions + per-seat billing |

### Why Not One Provider?

> **Prince's question: "Why not just use one service for everything?"**

Short answer: No single provider does all three well yet.

| Provider | STT | LLM | TTS | Verdict |
|----------|-----|-----|-----|---------|
| OpenAI Realtime API | ✅ Whisper | ✅ GPT-4o | ✅ Built-in | **Best single option** — but $0.06/min, no streaming control |
| Vapi.ai | ✅ (wraps others) | ✅ | ✅ | Does everything but $0.05/min + 10% margin fee |
| ElevenLabs | ❌ | ❌ | ✅ only | Voice only |
| Deepgram | ✅ only | ❌ | ✅ Aura | STT is best, TTS mediocre |
| Google Gemini Live | ✅ | ✅ Gemini | ✅ | New, good quality, less production proven |

**Why we separate them:**
- Deepgram STT = 2x more accurate than OpenAI Whisper in real conditions
- Cartesia = 2x lower latency than OpenAI TTS
- GPT-4o-mini = cheapest capable LLM for tool calls
- Total COGS: ~$0.054/call vs OpenAI Realtime ~$0.18/call (3x cheaper)

**Alternative (simpler, higher cost):**
If you want zero complexity in MVP, use **OpenAI Realtime API** for everything.
- Pro: 1 API key, 1 SDK, simpler code
- Con: 3x higher cost, less control over voice quality

We'll abstract providers behind interfaces so you can swap later.

### Frontend
| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Animations | Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

### Infrastructure
| Layer | Choice |
|-------|--------|
| Backend | Railway |
| Frontend | Vercel |
| DB | Supabase (Postgres) |
| Monitoring | Sentry |
| Logs | Axiom |

---

## 5. Multi-Tenant Architecture

```
Agency (Organization in Clerk)
  └── Workspace (white-label settings: logo, colors, domain)
       ├── Client 1 (Business)
       │    ├── Agent Config (name, template, voice)
       │    ├── Phone Number (Twilio)
       │    ├── Call Logs + Transcripts
       │    └── Bookings
       ├── Client 2 (Business)
       └── Client 3 (Business)
```

**White-label features (Pro+):**
- Custom domain (clientdashboard.theiragency.com)
- Remove "AgentDesk" branding
- Custom logo + colors in client portal

---

## 6. Database Schema

```sql
-- Agencies (map to Clerk org)
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE, -- for white-label: agency.agentdesk.app
  custom_domain TEXT,    -- for white-label: portal.theiragency.com
  branding JSONB,        -- {logo_url, primary_color, company_name}
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'starter', -- starter|pro|agency
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses (end clients of the agency)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  vertical TEXT, -- salon|restaurant|repair|general
  phone_number TEXT,   -- Twilio provisioned
  twilio_sid TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent configurations (one per business)
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  template TEXT NOT NULL, -- salon|restaurant|repair|general
  agent_name TEXT DEFAULT 'Alex',
  voice_id TEXT DEFAULT 'cartesia-sonic-english',
  system_prompt TEXT NOT NULL,
  business_hours JSONB,
  services JSONB,   -- [{name, duration_min, price}]
  faq JSONB,        -- [{question, answer}]
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  agency_id UUID REFERENCES agencies(id),
  twilio_call_sid TEXT UNIQUE,
  livekit_room_id TEXT,
  caller_number TEXT,
  duration_sec INTEGER,
  status TEXT, -- answered|missed|voicemail
  transcript JSONB,
  summary TEXT,
  outcome TEXT,  -- booked|cancelled|inquiry|other
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  call_id UUID REFERENCES calls(id),
  customer_name TEXT,
  customer_phone TEXT,
  service TEXT,
  appointment_at TIMESTAMPTZ,
  duration_min INTEGER DEFAULT 60,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking (for billing)
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id),
  business_id UUID REFERENCES businesses(id),
  month TEXT NOT NULL, -- YYYY-MM
  calls_count INTEGER DEFAULT 0,
  call_minutes INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, business_id, month)
);
```

---

## 7. Agent Templates

Three templates for MVP. Each pre-fills the system prompt.

### Template 1: Salon
```
"You are {agent_name}, a friendly receptionist at {business_name}.
You help customers book haircuts, color treatments, and spa services.
Business hours: {hours}. You can book appointments, check availability,
and answer questions about services and pricing."
```
Tools: `book_appointment`, `check_availability`, `list_services`

### Template 2: Restaurant
```
"You are {agent_name} at {business_name}. You help customers make
table reservations. Party size, date, time, and name.
Hours: {hours}. Max party size: {max_party}."
```
Tools: `make_reservation`, `check_availability`, `cancel_reservation`

### Template 3: General Business
```
"You are {agent_name}, a receptionist at {business_name}.
You answer general inquiries, take messages, and schedule callbacks."
```
Tools: `take_message`, `schedule_callback`, `answer_faq`

---

## 8. Folder Structure

```
agentdesk/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── agencies.py      # Agency CRUD
│   │   │   ├── businesses.py    # Client management
│   │   │   ├── calls.py         # Call logs
│   │   │   ├── webhooks.py      # Twilio + LiveKit
│   │   │   ├── billing.py       # Stripe
│   │   │   └── numbers.py       # Twilio provisioning
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── redis.py
│   │   └── models/
│   │       ├── agency.py
│   │       ├── business.py
│   │       ├── call.py
│   │       └── booking.py
│   ├── agent/
│   │   ├── agent.py             # Core LiveKit agent class
│   │   ├── tools.py             # book/cancel/faq tools
│   │   ├── templates.py         # Prompt templates per vertical
│   │   ├── providers.py         # STT/LLM/TTS abstraction layer
│   │   └── runner.py            # LiveKit worker entrypoint
│   ├── pyproject.toml
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── (auth)/              # Clerk auth pages
│   │   ├── dashboard/           # Agency dashboard
│   │   │   ├── page.tsx         # Overview
│   │   │   ├── clients/         # Manage clients
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   ├── calls/           # All call logs
│   │   │   ├── billing/         # Plan + usage
│   │   │   └── settings/        # White-label config
│   │   ├── client/[token]/      # Client portal (read-only)
│   │   └── onboarding/
│   └── package.json
└── docs/
    ├── PRD.md                   # This file
    ├── TECH_SPEC.md
    └── API.md
```

---

## 9. Pricing

| Plan | Price | Clients | Calls/mo | White-label |
|------|-------|---------|----------|-------------|
| Starter | $49/mo | 3 | 300 total | ❌ |
| Pro | $99/mo | 10 | 1,000 total | ✅ |
| Agency | $199/mo | Unlimited | Unlimited | ✅ + custom domain |

**Unit economics (Pro plan, 10 clients, 100 calls each):**
- COGS: 1,000 calls × $0.054 = $54
- Revenue: $99
- Gross profit: $45/mo per agency customer
- At 100 agency customers: $9,900 MRR, $4,500 gross profit

**Agency margin:**
- Agency charges client: $150/mo
- Agency pays us: $99/mo ÷ 10 clients = $9.90/client
- Agency profit per client: $140/mo
- This is why agencies are sticky — their revenue depends on us

---

## 10. Build Phases

### Phase 1 — Core (Week 1-2)
- [ ] Voice pipeline: LiveKit + Deepgram + GPT-4o-mini + Cartesia
- [ ] Single business, single agent, working calls
- [ ] Postgres schema + Supabase setup
- [ ] Twilio inbound call → LiveKit routing
- [ ] Call transcripts saved
- [ ] Basic dashboard: call list + transcript view

### Phase 2 — Multi-tenant (Week 2-3)
- [ ] Clerk auth + org support
- [ ] Agency creates clients
- [ ] Template selection (salon/restaurant/general)
- [ ] Phone number provisioning (Twilio)
- [ ] Client portal (read-only dashboard)
- [ ] Stripe subscription

### Phase 3 — White-label + Polish (Week 3-4)
- [ ] Custom subdomain (agency.agentdesk.app)
- [ ] Remove AgentDesk branding on Pro
- [ ] Custom logo + colors
- [ ] Onboarding wizard
- [ ] SMS confirmation after booking
- [ ] Landing page + demo video

---

## 11. Go-to-Market

**Target:** AI freelancers / micro-agencies on Twitter who already sell "AI automation"

**Channels:**
1. Twitter/X: "Built a white-label AI receptionist platform. My first agency customer set up 3 clients in 20 min."
2. Reddit: r/agency, r/freelance, r/artificial
3. Cold DM: People selling "AI automations" on Twitter
4. Product Hunt + Hacker News Show HN

**Positioning vs BookedIn:**
- BookedIn: Feature-rich, no-code builder, $299/mo+
- AgentDesk: Simple, works out of the box, $49/mo starter
- "AgentDesk if you want to start today. BookedIn if you want to build a full agency OS."

---

## 12. MVP Success Metrics

| Metric | Week 4 | Month 3 | Month 6 |
|--------|--------|---------|---------|
| GitHub stars | 100 | 800 | 3K |
| Agency signups | 10 | 80 | 300 |
| Paid agencies | 3 | 25 | 100 |
| MRR | $147 | $1,225 | $7,350 |

---

*Next: Scaffold `backend/agent/agent.py` — the clean voice pipeline.*
