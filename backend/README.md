# Healthcare Voice Agent Backend

HIPAA-compliant AI voice agent for doctor appointment management.

## Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15+ with SQLAlchemy async
- **Cache**: Redis 7+
- **Authentication**: JWT with MFA support
- **Task Queue**: Celery + Redis

## Features

- ✅ Authentication (register, login, OTP verification)
- ✅ Appointment CRUD with double-booking prevention
- ✅ Real-time availability with 5-second Redis cache
- ✅ Patient/Doctor management with PHI encryption (AES-256)
- ✅ HIPAA-compliant audit logging
- ✅ Voice agent tools for LLM function calling
- ✅ Rate limiting (TRS 2.5)
- ✅ Async notification processing (SMS, Email)

## Quick Start

```bash
cd backend

# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# 2. Install dependencies
pip install -e ".[dev]"

# 3. Start PostgreSQL and Redis
docker-compose up -d postgres redis

# 4. Copy environment file
cp .env.example .env

# 5. Run migrations
alembic upgrade head

# 6. Start server
uvicorn app.main:app --reload
```

## Running Celery Workers

```bash
# Start worker
celery -A app.core.celery_app worker --loglevel=info

# Start beat scheduler (for periodic tasks)
celery -A app.core.celery_app beat --loglevel=info
```

## Running Voice Agent Worker

The voice agent connects to LiveKit and handles inbound/outbound calls using:
- **Deepgram** for Speech-to-Text
- **OpenAI GPT-4** for conversation
- **Cartesia** for Text-to-Speech
- **Silero** for Voice Activity Detection

### Prerequisites

1. Get API keys from:
   - [OpenAI](https://platform.openai.com/api-keys) - for LLM
   - [Deepgram](https://console.deepgram.com/) - for STT
   - [Cartesia](https://cartesia.ai/) - for TTS

2. Set up LiveKit:
   - Local: `docker run -d -p 7880:7880 livekit/livekit-server --dev`
   - Cloud: Use [LiveKit Cloud](https://cloud.livekit.io/)

### Start the Agent

```bash
cd backend

# 1. Set environment variables (or create .env)
export OPENAI_API_KEY=sk-xxx
export DEEPGRAM_API_KEY=xxx
export CARTESIA_API_KEY=xxx

# Optional: Configure LiveKit (defaults to local)
export LIVEKIT_URL=ws://localhost:7880
export LIVEKIT_API_KEY=devkey
export LIVEKIT_API_SECRET=secret

# 2. Install dependencies (includes LiveKit agent packages)
pip install -e ".[dev]"

# 3. Run the agent
python run_agent.py dev   # Development mode with auto-reload
# OR
python run_agent.py start # Production mode
```

### Testing the Agent

1. Start the backend API: `uvicorn app.main:app --reload`
2. Start the agent: `python run_agent.py dev`
3. Use the LiveKit CLI or web client to join a room
4. Speak to test the voice interaction


## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── core/           # Config, security, database, rate limiting
│   ├── models/         # SQLAlchemy models (TRS 2.3)
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic, voice agent tools
│   ├── routers/        # API endpoints (TRS 2.2)
│   ├── tasks/          # Celery tasks
│   └── main.py         # FastAPI app
├── alembic/            # Database migrations
├── tests/              # Test suite
└── docker-compose.yml  # Local development
```

## API Endpoints

### Authentication (TRS 2.2.1)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/otp/request` | Request OTP |
| POST | `/api/v1/auth/otp/verify` | Verify OTP |
| POST | `/api/v1/auth/logout` | Logout |

### Appointments (TRS 2.2.2)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/appointments` | List appointments |
| POST | `/api/v1/appointments` | Create appointment |
| GET | `/api/v1/appointments/{id}` | Get appointment |
| PUT | `/api/v1/appointments/{id}` | Update appointment |
| DELETE | `/api/v1/appointments/{id}` | Cancel appointment |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/doctors` | List doctors |
| GET | `/api/v1/doctors/{id}` | Get doctor |
| GET | `/api/v1/doctors/{id}/availability` | Check availability |

### Notifications (TRS 2.2.3)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/notifications` | Send notification |
| GET | `/api/v1/notifications/{id}` | Get notification |
| GET | `/api/v1/notifications/delivery-status` | Check delivery |

### Webhooks (TRS 2.2.4)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/webhooks/twilio/call-status` | Twilio call status |
| POST | `/api/v1/webhooks/twilio/sms-status` | Twilio SMS status |
| POST | `/api/v1/webhooks/assemblyai/transcript` | Transcript callback |

## Voice Agent Tools (TRS 4.3)

Tools available for LLM function calling:

```python
- check_availability(doctor_id, date_from, date_to)
- book_appointment(patient_phone, doctor_id, start_time)
- reschedule_appointment(appointment_id, new_start_time)
- cancel_appointment(appointment_id, reason)
- list_doctors(specialization)
- get_patient_info(patient_phone)
- transfer_to_agent(reason)
```

## Rate Limits (TRS 2.5)

| Endpoint Type | Limit |
|---------------|-------|
| Auth | 5/minute |
| Appointments | 100/minute |
| Availability | 500/minute |
| Webhooks | Unlimited |

## Testing

```bash
# Run all tests
pytest tests/ -v

# With coverage
pytest tests/ -v --cov=app --cov-report=html

# Specific test file
pytest tests/test_auth.py -v
```

## HIPAA Compliance

- ✅ PHI encrypted at rest (AES-256)
- ✅ All PHI access logged to audit_logs
- ✅ JWT tokens with short expiry
- ✅ Rate limiting on all endpoints
- ✅ Role-based access control (RBAC)

## Environment Variables

See `.env.example` for all configuration options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET_KEY` - JWT signing key
- `ENCRYPTION_KEY` - PHI encryption key
- `TWILIO_*` - Twilio credentials (optional)
- `SENDGRID_*` - SendGrid credentials (optional)
