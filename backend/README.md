# Healthcare Voice Agent Backend

HIPAA-compliant AI voice agent for doctor appointment management.

## Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLAlchemy async
- **Cache**: Redis
- **Authentication**: JWT with MFA support

## Quick Start

1. **Install dependencies**:
```bash
cd backend
pip install -e ".[dev]"
```

2. **Set up environment**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start services** (PostgreSQL, Redis):
```bash
docker-compose up -d postgres redis
```

4. **Run migrations**:
```bash
alembic upgrade head
```

5. **Start server**:
```bash
uvicorn app.main:app --reload
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── core/           # Config, security, database
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── routers/        # API endpoints
│   └── main.py         # FastAPI app
├── tests/              # Test suite
├── alembic/            # Database migrations
└── pyproject.toml      # Project config
```

## API Endpoints

### Authentication (TRS 2.2.1)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/otp/request` - Request OTP
- `POST /api/v1/auth/otp/verify` - Verify OTP
- `POST /api/v1/auth/logout` - Logout

### Appointments (TRS 2.2.2)
- `GET /api/v1/appointments` - List appointments
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/appointments/{id}` - Get appointment
- `PUT /api/v1/appointments/{id}` - Update appointment
- `DELETE /api/v1/appointments/{id}` - Cancel appointment
- `GET /api/v1/doctors/{id}/availability` - Get availability

### Webhooks (TRS 2.2.4)
- `POST /api/v1/webhooks/twilio/call-status`
- `POST /api/v1/webhooks/twilio/sms-status`
- `POST /api/v1/webhooks/assemblyai/transcript`

## Testing

```bash
pytest tests/ -v --cov=app
```

## HIPAA Compliance

- All PHI is encrypted at rest (AES-256)
- All PHI access is logged to audit_logs table
- JWT tokens with short expiry
- Rate limiting on all endpoints
