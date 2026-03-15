# VoiceDesk — AI Receptionist for US Small Businesses
## Product Requirements Document v1.0
*Created: 2026-03-15 | Author: Prince Pal*

---

## 1. Executive Summary

VoiceDesk is an AI-powered phone receptionist that answers calls, books appointments, and handles FAQs for small US businesses 24/7. Targeting the 33 million small businesses in the USA that cannot afford human receptionists ($35K-60K/yr salary) but lose an estimated $300+ per missed call.

**One-liner:** Never miss a customer call again — VoiceDesk answers 24/7 for $49/mo.

---

## 2. The Problem

- 62% of small business calls go to voicemail (Hiya, 2024)
- 85% of callers who hit voicemail don't call back
- A receptionist costs $35K-60K/yr in the USA
- Missed calls = missed bookings = lost revenue

**Primary targets (USA):**
- Medical/dental clinics (without HIPAA scope — appointment only)
- Hair salons, spas, barbershops
- Auto repair shops
- Plumbers, electricians, contractors
- Restaurants (reservations)
- Law firm intake (tier 2)

**India secondary market:**
- Same verticals but 10x lower willingness to pay ($5-10/mo)
- Best angle: reseller/white-label for Indian agencies
- Focus USA first, India expansion after $10K MRR

---

## 3. Solution

A web app where a business owner:
1. Signs up in 5 minutes
2. Configures their agent (name, business info, services, hours)
3. Gets a dedicated US phone number (via Twilio)
4. Agent handles all inbound calls with human-like voice
5. Owner sees call logs, transcripts, bookings in dashboard

---

## 4. Tech Stack (2026 Best Practices)

### Backend
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **FastAPI** (Python 3.12) | Async, fast, standard for AI agents |
| Voice Infra | **LiveKit Cloud** | Best WebRTC + agent framework, managed |
| STT | **Deepgram Nova-3** | Lowest latency (~300ms), best accuracy |
| LLM | **GPT-4o-mini** (primary) / Claude Haiku (fallback) | Fast, cheap, good tool use |
| TTS | **Cartesia Sonic** | Ultra-low latency (~90ms), most natural |
| Phone | **Twilio Voice** | Industry standard, SIP trunking |
| DB | **PostgreSQL 16** (Supabase) | Managed, row-level security, free tier |
| Cache | **Redis** (Upstash) | Session state, rate limiting, serverless |
| Queue | **BullMQ** via Upstash | Job queue for async tasks |
| Auth | **Clerk** | Best DX, pre-built UI, free tier |
| Payments | **Stripe** | Subscriptions + usage billing |

### Frontend
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15** (App Router) | Latest, server components |
| Styling | **Tailwind CSS v4** | Latest, faster builds |
| Components | **shadcn/ui** | Best OSS component library |
| Animations | **Framer Motion** | Smooth UX |
| State | **Zustand** | Lightweight, no boilerplate |
| Forms | **React Hook Form + Zod** | Type-safe validation |
| Charts | **Recharts** | Call analytics dashboard |

### Infrastructure
| Layer | Choice | Why |
|-------|--------|-----|
| Backend deploy | **Railway** | Git push deploy, free tier starts |
| Frontend deploy | **Vercel** | Best Next.js hosting |
| DB | **Supabase** | Postgres + realtime + storage |
| Monitoring | **Sentry** | Error tracking |
| Logs | **Axiom** | Structured logging |
| CI/CD | **GitHub Actions** | Standard |

### Voice Pipeline Architecture
```
Inbound Call (Twilio) 
    → SIP Trunk 
    → LiveKit Room 
    → Agent (Python)
        → Deepgram Nova-3 (STT, streaming)
        → GPT-4o-mini (LLM + tool calls)
            → book_appointment()
            → check_availability()
            → get_business_hours()
            → send_sms_confirmation()
        → Cartesia Sonic (TTS, streaming)
    → Caller hears response
    → Postgres (call log + transcript)
    → Webhook → Dashboard
```

---

## 5. Core Features

### MVP (Phase 1 — 3 weeks)
- [ ] Inbound call handling via Twilio + LiveKit
- [ ] Configurable agent (name, personality, business info)
- [ ] 3 agent tools: book, cancel, check_availability
- [ ] Call transcripts stored in Postgres
- [ ] Basic dashboard: calls list + transcript view
- [ ] Phone number provisioning (Twilio)
- [ ] SMS confirmation to caller after booking
- [ ] Auth (Clerk)
- [ ] Stripe subscription ($29/mo Starter, $49/mo Pro)

### Post-MVP (Phase 2 — weeks 4-6)
- [ ] Calendar integrations (Google Calendar, Calendly)
- [ ] Business hours enforcement
- [ ] Custom knowledge base (upload FAQ PDF)
- [ ] Call recording toggle
- [ ] Voicemail fallback
- [ ] Multi-language support (Spanish for USA market)
- [ ] Analytics: call volume, booking rate, peak hours

### Growth (Phase 3)
- [ ] Outbound appointment reminders
- [ ] White-label for agencies
- [ ] API access (Pro tier)
- [ ] Zapier integration
- [ ] Industry templates (salon, clinic, restaurant)

---

## 6. Pricing

| Plan | Price | Limits | Target |
|------|-------|--------|--------|
| Starter | $29/mo | 200 calls/mo, 1 number | Solo operators |
| Pro | $49/mo | 500 calls/mo, 2 numbers, analytics | Growing SMBs |
| Business | $99/mo | Unlimited calls, 5 numbers, white-label | Multi-location |

**Unit economics:**
- Deepgram: ~$0.004/min × 3 min avg = $0.012/call
- Cartesia: ~$0.005/min × 3 min avg = $0.015/call
- GPT-4o-mini: ~$0.001/call (150 tokens in + out)
- Twilio: $0.0085/min × 3 min = $0.026/call
- **Total COGS per call: ~$0.054**
- 200 calls on $29 plan = $10.80 COGS → **$18.20 gross profit**

---

## 7. Folder Structure

```
voicedesk/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── api/
│   │   │   ├── calls.py         # Call endpoints
│   │   │   ├── agents.py        # Agent config CRUD
│   │   │   ├── webhooks.py      # Twilio + LiveKit webhooks
│   │   │   └── billing.py       # Stripe endpoints
│   │   ├── core/
│   │   │   ├── config.py        # Settings (pydantic-settings)
│   │   │   ├── database.py      # SQLAlchemy + Postgres
│   │   │   └── redis.py         # Upstash Redis client
│   │   └── models/
│   │       ├── business.py      # Business + agent config
│   │       ├── call.py          # Call logs + transcripts
│   │       └── booking.py       # Appointment bookings
│   ├── agent/
│   │   ├── agent.py             # LiveKit agent (VoiceDeskAgent class)
│   │   ├── tools.py             # Agent tools (book/cancel/faq)
│   │   ├── prompts.py           # System prompts per vertical
│   │   └── runner.py            # LiveKit worker entrypoint
│   ├── pyproject.toml
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── (auth)/              # Login, signup (Clerk)
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Overview + recent calls
│   │   │   ├── calls/           # Call logs + transcripts
│   │   │   ├── agent/           # Configure agent
│   │   │   ├── numbers/         # Phone number management
│   │   │   └── settings/        # Billing + account
│   │   ├── onboarding/          # 5-step setup wizard
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                  # shadcn components
│   │   ├── call-log.tsx
│   │   ├── agent-config.tsx
│   │   └── transcript-view.tsx
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   └── types.ts             # Shared types
│   └── package.json
├── docs/
│   ├── PRD.md                   # This file
│   ├── TECH_SPEC.md
│   └── API.md
└── README.md
```

---

## 8. Database Schema (Postgres)

```sql
-- Businesses (one per Clerk user)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  vertical TEXT, -- salon, clinic, restaurant, etc.
  phone_number TEXT, -- Twilio provisioned number
  timezone TEXT DEFAULT 'America/New_York',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'starter', -- starter|pro|business
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent configurations
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  agent_name TEXT DEFAULT 'Alex',
  voice_id TEXT DEFAULT 'cartesia-sonic-english',
  system_prompt TEXT NOT NULL,
  business_hours JSONB, -- {mon: {open: "09:00", close: "18:00"}, ...}
  services JSONB, -- [{name, duration_min, price}]
  faq JSONB, -- [{question, answer}]
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  livekit_room_id TEXT,
  twilio_call_sid TEXT UNIQUE,
  caller_number TEXT,
  duration_sec INTEGER,
  status TEXT, -- answered|missed|voicemail
  transcript JSONB, -- [{role, content, timestamp}]
  summary TEXT, -- LLM-generated summary
  outcome TEXT, -- booked|cancelled|inquiry|other
  recording_url TEXT,
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
  duration_min INTEGER,
  status TEXT DEFAULT 'confirmed', -- confirmed|cancelled|completed
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 9. Go-to-Market

### Launch Sequence
1. **Week 1-3:** Build MVP
2. **Week 4:** Post on GitHub (OSS core, no auth/billing)
3. **Week 4:** Post on Product Hunt + Hacker News "Show HN"
4. **Week 4-5:** Twitter thread: "I built an AI receptionist in 3 weeks"
5. **Week 5:** Reddit: r/smallbusiness, r/entrepreneur, r/SaaS
6. **Week 6:** Cold DM 50 salon owners on Instagram

### Content Angles
- "Your receptionist costs $40K/yr. Mine costs $49/mo."
- "I called 100 small businesses. 67 went to voicemail. Here's what I built."
- Build-in-public thread series on Twitter

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| TCPA compliance (outbound) | High | Inbound only for MVP |
| Twilio cost spikes | Medium | Hard limits per plan |
| LLM hallucinations on bookings | High | Confirm before booking, send SMS |
| Calendar sync complexity | Medium | Phase 2, manual entry first |
| Low conversion from OSS | Low | Landing page + demo video |

---

## 11. Success Metrics

| Metric | Week 4 | Month 3 | Month 6 |
|--------|--------|---------|---------|
| GitHub stars | 50 | 500 | 2K |
| Signups | 10 | 100 | 500 |
| Paid customers | 2 | 20 | 100 |
| MRR | $58 | $580 | $4,900 |

---

## 12. Open Source Strategy

**What to OSS (Apache 2.0):**
- Core voice pipeline (agent.py + tools.py)
- Self-host guide (Docker Compose)
- Industry prompt templates

**What stays closed (SaaS):**
- Dashboard UI
- Twilio number provisioning
- Stripe billing
- Multi-tenant management

This drives GitHub stars → free marketing → paid signups.

---

*Next step: Build Phase 1. Start with `backend/agent/agent.py`.*
