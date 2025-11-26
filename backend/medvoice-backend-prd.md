# MedVoice Scheduler - Backend & Voice AI Engine (PRD #2)

## 1. Product Overview

**Product Name:** MedVoice Scheduler - Backend & Voice AI Engine  
**Version:** MVP 1.0  
**Target Release:** 8 weeks from kickoff  
**Product Type:** RESTful API + Real-time Voice AI Agent

**Purpose:**  
A robust backend system that manages appointment data, integrates with EHR systems, and powers an intelligent Voice AI agent capable of handling inbound/outbound calls for scheduling, rescheduling, cancellations, and patient inquiries.

---

## 2. Success Metrics

| **Metric**                        | **Target (Month 3)**              |
|-----------------------------------|-----------------------------------|
| API uptime                        | 99.9%                             |
| API response time (p95)           | < 500ms                           |
| Voice AI call completion rate     | > 85%                             |
| Voice AI booking accuracy         | > 90%                             |
| Average call handling time        | < 3 minutes                       |
| Escalation rate (to human)        | < 15%                             |
| Concurrent call capacity          | 50+ simultaneous calls            |
| Transcription accuracy (WER)      | < 5%                              |

---

## 3. System Architecture

**High-Level Architecture:**
```
FRONTEND (React Dashboard - PRD #1)
  | HTTPS/REST + WebSocket
API GATEWAY (Authentication, Rate Limiting, Routing)
  |
BACKEND SERVICES (Node.js): Appointment, User/Auth, Analytics, Voice AI Orchestrator, Notification, Integration
  |
DATA LAYER: PostgreSQL (Primary DB), Redis (Cache/Queue), MongoDB (Call Logs)
  |
VOICE AI PIPELINE: [Twilio] → [ASR] → [LLM] → [TTS] → [Twilio]
             Phone     Speech   GPT-4   Voice    Phone
            Deepgram  Claude  ElevenLabs
  |
EXTERNAL INTEGRATIONS: EHR APIs (Epic/Athena), SMS (Twilio), Email (SendGrid)
```

---

## 4. Core Features

### 4.1 RESTful API
#### 4.1.1 Authentication Service
- **Endpoints:**
    - `/api/auth/signup` (POST): Register new practice
    - `/api/auth/login` (POST): User login
    - `/api/auth/refresh` (POST): Refresh access token
    - `/api/auth/logout` (POST): Invalidate session
    - `/api/auth/forgot-password` (POST): Reset password email
    - `/api/auth/reset-password` (POST): Set new password
- **Security:** Passwords hashed (bcrypt 12 rounds), JWT tokens, refresh rotation, 5 attempt lockout

#### 4.1.2 Appointment Service
- **Endpoints:** CRUD for appointments, confirm, reschedule, cancel, check availability
- **Data Model:** PostgreSQL: `appointments` table with constraints preventing double-bookings, index optimization
- **Business Logic:** Validate hours, calculate end time, emit events, SMS reminders, audit logging

#### 4.1.3 Voice AI Call Service
- **Endpoints:** Call logs, call details, transcripts, call recording, flagging, inbound webhooks (Twilio)
- **Data Model:** MongoDB document with transcripts, sentiment, metadata, outcome, indexing for performance and tracking

#### 4.1.4 Settings & Configuration Service
- **Endpoints:** Practice, providers, appointment types, AI script config, notifications, EHR integrations
- **Data Models:** Providers, appointment types, and AI scripts for customization

### 4.2 Voice AI Agent Pipeline
#### 4.2.1 Call Flow Architecture
- **Call lifecycle:** Inbound webhook (Twilio) → initialize log, get script, cache availability → greeting (TTS) → dialogue loop (ASR to LLM to TTS back via Twilio/Speech streaming) → close, log, update outcome

#### 4.2.2 Speech Recognition (ASR)
- **Provider:** Deepgram Nova-2 (main), OpenAI Whisper fallback
- **Features:** Real-time streaming, confidence scoring, fallback on poor confidence

#### 4.2.3 LLM Orchestration
- **Engines:** GPT-4 Turbo, Claude 3.5 Sonnet with function calling (check_availability, book_appointment, transfer_to_staff, etc.)
- **Prompting:** Friendly medical receptionist; concise, escalates complex/urgent cases, offers available slots

#### 4.2.4 Text-to-Speech (TTS)
- **Providers:** ElevenLabs (main), Deepgram Aura (fast alternative)
- **Features:** Streaming TTS, customizable voices, audio caching for speed

#### 4.2.5 Twilio Integration
- **Inbound webhook:** Initializes log, passes audio to ASR
- **WebSocket handler:** Connects to pipeline, manages dialogue, logs transcripts, manages call events

### 4.3 Notification Service
- **Capabilities:** SMS reminders and confirmations, SMS reply parsing (confirm/reschedule), cron job for reminders, manual SMS via dashboard
- **Implementation:** Twilio SMS, date logic for 1-day/2-hour reminders, webhook for handling replies

### 4.4 EHR Service
- **Supported EHRs:** Epic (FHIR), Athena Health (API)
- **Sync strategy:** Real-time push + periodic pull, EHR as source of truth, automatic conflict detection
- **Security:** OAuth2/JWT auth, audit logging, role-based access

### 4.5 Analytics Service
- **Metrics:** Appointments, AI-handled calls, no-shows, call volume by time, conversion rates
- **Implementation:** Aggregates from call/appointment logs, exposes metrics endpoints for dashboards

---

## 5. Technical Stack

- **Runtime:** Node.js 20+ (TypeScript)
- **Framework:** Nestjs(express)
- **Databases:** PostgreSQL (RDBMS), Redis (cache/jobs), MongoDB (call logs)
- **Voice AI APIs:** Twilio, Deepgram, OpenAI, ElevenLabs
- **Infra:** AWS, Vercel, Neon, Upstash (for managed/cloud deployments)
- **Monitoring:** Sentry, DataDog or Prometheus for perf/errors

---

## 6. Project Structure Example

```
backend/
├── src/
│   ├── api/routes/           # routes: auth, appointments, calls, analytics, settings
│   ├── api/middlewares/      # middleware: auth, validation, rate limiting
│   ├── api/validators/       # input validators
│   ├── services/             # business logic per module
│   ├── voiceAgent/           # ASR, LLM, TTS, Twilio handlers
│   ├── models/               # ORM models for PostgreSQL/MongoDB
│   ├── integrations/         # EHR/Twilio
│   ├── jobs/                 # cron/job queues
│   ├── utils/                # logger, JWT, validation utils
│   ├── config/               # DB, Redis, env config
│   └── websocket/            # live updates
│   └── index.ts
├── prisma/schema.prisma      # Prisma DB schema
├── tests/                    # Unit, integration, e2e tests
├── ...
```

---

## 7. Database Schema (Prisma)

- **Practice, User, Provider, AppointmentType, Appointment, AIScript**
- Fields for multi-tenancy, roles, phone/email validation, provider/appointment relations, EHR support
- Indexing for scalable querying

---

## 8. Development Phases

**Phase 1 (Weeks 1-2):**
- Project setup, database, Auth API, CRUD endpoints, Redis

**Phase 2 (Weeks 3-4):**
- Twilio/Voice pipeline, ASR/LLM/TTS integration, logging

**Phase 3 (Weeks 5-6):**
- Notifications, SMS/webhooks, outbound call trigger, real-time WebSocket

**Phase 4 (Weeks 7-8):**
- Analytics, EHR integration, load/perf testing, documentation & deployment

---

## 9. Non-Functional Requirements

- **Performance:** <500ms API, <2s voice pipeline, concurrency, cache, horizontal scaling
- **Security:** HIPAA (encryption, audits, RBAC), API rate limiting, JWT, XSS/SQLi protection
- **Compliance:** Vendor BAA, audit trails
- **Observability:** Structured logs, metrics, alerts (API, voice failure, DB load, queues)

---

## 10. API Documentation

- **Format:** OpenAPI/Swagger
- **Security:** JWT bearer
- **Example endpoints:** `/auth/login`, `/appointments`, `/calls`, settings, analytics, EHR

---

## 11. Testing Strategy

- **Coverage:** 80%+, unit/integration/e2e
- **Tools:** Jest, Supertest, MSW, K6/Artillery
- **Targets:** Endpoint logic, workflow, error cases, EHR/SMS mocks, load concurrency

---

## 12. Deployment

- **Infra:** AWS (EC2, RDS PostgreSQL, ElastiCache, DocumentDB, Route 53, CloudFront, ALB)
- **Envs:** DATABASE_URL, REDIS_URL, MONGODB_URL, JWT, Twilio keys, AI/EHR vendor keys, monitoring keys
- **CI/CD:** GitHub Actions, test then deploy pipeline

---

## 13. Open Questions & Recommendations

- **Multi-tenancy:** Use single DB with partitioning for MVP, optional separate DBs for enterprise
- **Vendor fallback:** If ASR/LLM service fails, auto-transfer call to human, notify via SMS
- **Call Recordings:** Default retention 90 days (configurable 30-365)
- **Outbound AI Calling:** v2+ only (MVP: SMS reminders), multi-language: English/Spanish MVP

---

## 14. MVP Launch Criteria

- 99.9% uptime, < 500ms API, 85%+ call completion, 90%+ booking accuracy
- All P0 endpoints (auth, appointment, call, analytics) live
- 5+ beta practices, 50+ calls/wk
- HIPAA audit, 50+ concurrent calls handled

---

**End of Document**
