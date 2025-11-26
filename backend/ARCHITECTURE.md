# System Architecture - MedVoice Backend

## Overview

MedVoice is a production-ready voice AI agent backend built with NestJS, designed to handle real-time voice interactions for medical appointment scheduling. The system integrates multiple AI services (OpenAI, Deepgram, ElevenLabs) with LangChain for intelligent conversation management.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  Mobile App  │  │ Twilio Voice │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          │ HTTPS/WS         │ HTTPS/WS         │ Webhook
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼──────────────────┐
│                      API GATEWAY LAYER                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  NestJS Application (Port 3000)                            │  │
│  │  - Helmet (Security)                                       │  │
│  │  - CORS                                                    │  │
│  │  - Rate Limiting (Throttler)                               │  │
│  │  - JWT Authentication                                      │  │
│  │  - Request Validation (class-validator)                    │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Core Modules                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │   Auth   │  │  Users   │  │ Practices│              │  │
│  │  └──────────┘  └──────────┘  └──────────┘              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Voice AI Pipeline                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  1. Audio Input (WebSocket/HTTP)                 │   │  │
│  │  │  2. Speech-to-Text (Deepgram)                    │   │  │
│  │  │  3. LLM Agent (OpenAI + LangChain)               │   │  │
│  │  │  4. Tool Execution (Appointments)                │   │  │
│  │  │  5. Text-to-Speech (ElevenLabs)                  │   │  │
│  │  │  6. Audio Output (Stream)                        │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Business Modules                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │Appointments│ │Providers │  │Analytics │              │  │
│  │  └──────────┘  └──────────┘  └──────────┘              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │            Integration Modules                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │  Storage │  │   EHR    │  │Notifications│            │  │
│  │  │  (GCS)   │  │(Epic/Athena)│ (Twilio)  │            │  │
│  │  └──────────┘  └──────────┘  └──────────┘              │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          │                    │                    │
          │                    │                    │
┌─────────▼────────┐  ┌────────▼────────┐  ┌───────▼──────────┐
│  PostgreSQL      │  │     Redis       │  │  External APIs   │
│  (Prisma ORM)    │  │  - Cache        │  │  - OpenAI        │
│  - Users         │  │  - Sessions     │  │  - Deepgram      │
│  - Appointments  │  │  - Rate Limit   │  │  - ElevenLabs    │
│  - Conversations │  │  - Pub/Sub      │  │  - Twilio        │
│  - Messages      │  └─────────────────┘  │  - Epic/Athena   │
│  - Voice Chunks  │                       └──────────────────┘
└──────────────────┘
```

## Component Architecture

### 1. Voice Agent Pipeline

```typescript
// Flow: Audio → STT → Agent → TTS → Audio
┌─────────────────────────────────────────────────────────────┐
│                   VoiceAgentService                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  processAudioInput(audioBuffer)                       │  │
│  │    ↓                                                  │  │
│  │  1. SpeechToTextService.transcribe()                 │  │
│  │    ↓                                                  │  │
│  │  2. AgentService.processMessage()                    │  │
│  │    ├─→ LangChain Agent                               │  │
│  │    ├─→ Tool Execution (check_availability, book)     │  │
│  │    └─→ Memory Management                             │  │
│  │    ↓                                                  │  │
│  │  3. TextToSpeechService.generateSpeech()             │  │
│  │    ↓                                                  │  │
│  │  4. Return audio stream                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2. LangChain Agent Architecture

```typescript
┌─────────────────────────────────────────────────────────────┐
│                    AgentService                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Agent Executor                                       │  │
│  │  ├─ ChatOpenAI (GPT-4)                                │  │
│  │  ├─ System Prompt (Medical Receptionist)             │  │
│  │  ├─ Memory (BufferMemory)                             │  │
│  │  └─ Tools:                                            │  │
│  │     ├─ check_availability                             │  │
│  │     ├─ book_appointment                               │  │
│  │     ├─ reschedule_appointment                         │  │
│  │     └─ cancel_appointment                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3. Authentication Flow

```
1. User → POST /auth/signup
   ↓
2. Hash password (bcrypt, 12 rounds)
   ↓
3. Create user in PostgreSQL
   ↓
4. Generate JWT access token (15min)
   ↓
5. Generate refresh token (7 days)
   ↓
6. Store refresh token in DB
   ↓
7. Return tokens to user

Refresh Flow:
1. User → POST /auth/refresh {refreshToken}
   ↓
2. Verify refresh token
   ↓
3. Check if token exists and not revoked
   ↓
4. Revoke old refresh token
   ↓
5. Generate new access + refresh tokens
   ↓
6. Return new tokens
```

### 4. WebSocket Communication

```
Client                          Server
  │                               │
  ├──── connect ──────────────────▶│
  │◀──── connected ────────────────┤
  │                               │
  ├──── start_session ────────────▶│
  │                               ├─ Create conversation
  │                               ├─ Initialize agent
  │◀──── session_started ──────────┤
  │                               │
  ├──── audio_stream ─────────────▶│
  │                               ├─ STT
  │                               ├─ Agent processing
  │                               ├─ TTS
  │◀──── agent_response ───────────┤
  │◀──── audio_response ───────────┤
  │                               │
  ├──── end_session ──────────────▶│
  │                               ├─ Update conversation
  │                               ├─ Clear memory
  │◀──── session_ended ────────────┤
  │                               │
```

## Data Models

### Core Entities

1. **User**
   - Authentication & authorization
   - Role-based access control
   - Practice association

2. **Practice**
   - Multi-tenant support
   - Business hours configuration
   - EHR integration settings

3. **Provider**
   - Healthcare providers
   - Specialty information
   - Appointment associations

4. **Appointment**
   - Scheduling data
   - Patient information
   - Status tracking
   - AI booking flag

5. **Conversation**
   - Voice/chat sessions
   - Channel tracking
   - Outcome recording

6. **Message**
   - Conversation history
   - Role-based messages
   - Tool call tracking

7. **VoiceChunk**
   - Audio data storage
   - Transcripts
   - Metadata

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────┐
│  Request Flow                                            │
│                                                          │
│  1. Client sends request with JWT Bearer token          │
│  2. JwtAuthGuard intercepts request                     │
│  3. Extract token from Authorization header             │
│  4. Verify token signature                              │
│  5. Validate expiration                                 │
│  6. Load user from database                             │
│  7. Check user status (ACTIVE)                          │
│  8. RolesGuard checks required roles                    │
│  9. Allow/Deny request                                  │
└─────────────────────────────────────────────────────────┘
```

### Rate Limiting

- Global: 100 requests/minute per IP
- Login: 5 attempts per 15 minutes
- API endpoints: Configurable via decorators
- Redis-backed for distributed systems

### Data Protection

- Passwords: bcrypt with 12 rounds
- JWT secrets: Environment variables
- Database: SSL connections
- API keys: Secret management (GCP/AWS)
- CORS: Configured origins only

## Scalability

### Horizontal Scaling

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Instance 1  │  │  Instance 2  │  │  Instance N  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                ┌────────▼────────┐
                │  Load Balancer  │
                └─────────────────┘
```

### Caching Strategy

1. **Redis Cache**
   - Session data
   - Rate limit counters
   - Frequently accessed data
   - Real-time state

2. **Application Cache**
   - AI script configurations
   - Provider schedules
   - Appointment types

### Database Optimization

- Indexed queries (user email, appointment times)
- Connection pooling
- Read replicas for analytics
- Partitioning for large tables

## Monitoring & Observability

### Logging

```typescript
Winston Logger
├─ Console (Development)
├─ File (error.log)
├─ File (combined.log)
└─ External (Sentry, DataDog)
```

### Metrics

- Active voice sessions
- API response times (p50, p95, p99)
- Database query performance
- Error rates
- Cache hit rates

### Health Checks

- `/api/v1/health` - Application health
- Database connectivity
- Redis connectivity
- External API availability

## Event System

```typescript
EventEmitter2 Events:
├─ voice.session.started
├─ voice.session.ended
├─ voice.message.processed
├─ stt.transcript
├─ appointment.booked
├─ appointment.cancelled
└─ notification.sent
```

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL 14+ |
| ORM | Prisma |
| Cache | Redis 7+ |
| Auth | JWT + Passport |
| WebSocket | Socket.io |
| AI/LLM | OpenAI GPT-4 |
| Agent Framework | LangChain |
| STT | Deepgram Nova-2 |
| TTS | ElevenLabs |
| Voice | Twilio |
| Storage | GCP Cloud Storage |
| Deployment | GCP Cloud Run / AWS ECS |
| Monitoring | Winston + Sentry |

## Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time (p95) | < 500ms |
| Voice Pipeline Latency | < 2s |
| Concurrent Sessions | 50+ |
| Database Queries | < 100ms |
| Uptime | 99.9% |

## Future Enhancements

1. **Multi-language Support**
   - Spanish, French, etc.
   - Language detection

2. **Advanced Analytics**
   - Sentiment analysis
   - Call quality metrics
   - Conversion tracking

3. **Outbound Calling**
   - Appointment reminders
   - Follow-up calls

4. **EHR Integration**
   - Epic FHIR
   - Athena Health
   - Real-time sync

5. **Advanced AI Features**
   - Voice cloning
   - Emotion detection
   - Context-aware responses

---

This architecture is designed for production use with scalability, security, and maintainability as core principles.
