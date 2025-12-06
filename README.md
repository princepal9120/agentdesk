# 🏥 HealthVoice - AI Voice Agent for Doctor Appointment Management

A **HIPAA-compliant AI voice agent system** that automates doctor appointment booking, rescheduling, cancellations, and confirmations for healthcare providers. Patients can manage appointments 24/7 through natural voice conversations.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/Frontend-React%2018-61DAFB)
![Voice](https://img.shields.io/badge/Voice-LiveKit-FF6B35)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Voice Agent](#-voice-agent)
- [Deployment](#-deployment)
- [PRD Compliance](#-prd-compliance)

---

## ✨ Features

### Voice Agent Capabilities
- 🎙️ **Natural Language Understanding** - Understand patient intent with 95%+ accuracy
- 🔄 **Appointment Booking** - Book, reschedule, and cancel appointments via voice
- 📞 **24/7 Availability** - Automated voice responses around the clock
- 🔀 **Human Handoff** - Seamless transfer to human agents when needed
- 📝 **Call Recording** - Transcription and storage for quality assurance

### Patient Portal
- 📅 **Dashboard** - View upcoming appointments and activity
- 📖 **Booking Interface** - Browse doctors and book appointments online
- 🔔 **Notifications** - SMS, Email, and Voice reminders
- 📱 **Mobile Responsive** - Works on all devices

### Doctor Dashboard
- 📊 **Analytics** - Patient count, revenue, and no-show metrics
- 📋 **Today's Schedule** - Real-time view of daily appointments
- ⚠️ **Alerts** - High-risk patient notifications
- ⏰ **Availability Management** - Set working hours and block time

### Security & Compliance
- 🔒 **HIPAA Compliant** - PHI encryption (AES-256), audit logging
- 🛡️ **Role-Based Access Control** - Patient, Doctor, Receptionist, Admin roles
- 🔐 **Multi-Factor Authentication** - SMS/Email OTP support
- 📊 **Rate Limiting** - Protection against abuse

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PATIENT INTERFACES                          │
├─────────────────────────────────────────────────────────────────────┤
│  📱 Web Portal (React)  │  📞 Voice Calls (PSTN/WebRTC)  │  💬 SMS  │
└───────────────┬─────────────────────────┬───────────────────────────┘
                │                         │
                ▼                         ▼
┌───────────────────────────┐   ┌─────────────────────────────────────┐
│   FRONTEND (React 18)     │   │     LIVEKIT VOICE AGENT SERVER     │
├───────────────────────────┤   ├─────────────────────────────────────┤
│ • TanStack Router         │   │ • Deepgram STT (Speech-to-Text)    │
│ • Redux Toolkit           │   │ • OpenAI GPT-4 (LLM Processing)    │
│ • Shadcn/UI Components    │   │ • Cartesia TTS (Text-to-Speech)    │
│ • LiveKit Client          │   │ • Silero VAD (Voice Detection)     │
└───────────────┬───────────┘   └──────────────┬──────────────────────┘
                │                              │
                ▼                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND API (FastAPI)                           │
├─────────────────────────────────────────────────────────────────────┤
│  • Authentication & Authorization (JWT)                             │
│  • Appointment Management (CRUD + Conflict Detection)               │
│  • Real-time Availability Engine (Redis Cache)                      │
│  • Notification Service (Twilio SMS, SendGrid Email)                │
│  • HIPAA Audit Logging                                              │
│  • Voice Agent Tool Execution                                       │
└───────────────┬─────────────────────────────┬───────────────────────┘
                │                             │
                ▼                             ▼
┌───────────────────────────┐   ┌─────────────────────────────────────┐
│   PostgreSQL Database     │   │         Redis Cache                 │
├───────────────────────────┤   ├─────────────────────────────────────┤
│ • Users & Roles           │   │ • Session Management                │
│ • Appointments            │   │ • Real-time Availability (5s TTL)  │
│ • Doctors & Patients      │   │ • Rate Limiting                     │
│ • Audit Logs              │   │ • OTP Storage                       │
└───────────────────────────┘   └─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, TanStack Router, Redux Toolkit, Shadcn/UI, Tailwind CSS |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic V2, Celery |
| **Voice Agent** | LiveKit Agents, Deepgram (STT), OpenAI GPT-4 (LLM), Cartesia (TTS) |
| **Database** | PostgreSQL 15+, Redis 7+ |
| **Auth** | JWT, bcrypt, TOTP (MFA) |
| **Infrastructure** | Docker, Docker Compose |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Docker** and Docker Compose
- **API Keys** (for voice features):
  - [OpenAI](https://platform.openai.com/api-keys)
  - [Deepgram](https://console.deepgram.com/)
  - [Cartesia](https://cartesia.ai/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/voice-agent.git
cd voice-agent
```

### 2. Start Infrastructure

```bash
cd backend
docker-compose up -d postgres redis livekit
```

### 3. Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Copy environment file and configure
cp env.template .env
# Edit .env with your API keys

# Run database migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload
```

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Start Voice Agent (Optional)

```bash
cd backend
python3 run_agent.py dev
```

### 6. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

---

## 📁 Project Structure

```
voice-agent/
├── 01_PRD.md                 # Product Requirements Document
├── README.md                 # This file
│
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── core/            # Config, security, database
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── routers/         # API endpoints
│   │   ├── tasks/           # Celery background tasks
│   │   └── main.py          # FastAPI application
│   ├── agent/               # LiveKit Voice Agent
│   │   ├── agent.py         # Main agent logic
│   │   ├── config.py        # Agent configuration
│   │   └── tools.py         # Tool executor
│   ├── alembic/             # Database migrations
│   ├── tests/               # Test suite
│   ├── docker-compose.yml   # Local infrastructure
│   ├── pyproject.toml       # Python dependencies
│   └── README.md            # Backend documentation
│
└── frontend/                 # React Frontend
    ├── app/
    │   └── routes/          # TanStack Router pages
    ├── src/
    │   ├── components/      # UI components
    │   │   ├── ui/          # Shadcn/UI primitives
    │   │   ├── features/    # Feature components
    │   │   └── layout/      # Layout components
    │   ├── store/           # Redux store & slices
    │   ├── services/        # API client
    │   ├── types/           # TypeScript types
    │   └── utils/           # Utility functions
    ├── package.json         # Node dependencies
    └── README.md            # Frontend documentation
```

---

## 📚 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user (supports `role`: patient, doctor) |
| POST | `/api/v1/auth/login` | Login with email/phone |
| POST | `/api/v1/auth/otp/request` | Request OTP |
| POST | `/api/v1/auth/otp/verify` | Verify OTP |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/appointments` | List appointments |
| POST | `/api/v1/appointments` | Create appointment |
| PUT | `/api/v1/appointments/{id}` | Update appointment |
| DELETE | `/api/v1/appointments/{id}` | Cancel appointment |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/doctors` | List doctors |
| GET | `/api/v1/doctors/{id}/availability` | Check availability |

### LiveKit
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/livekit/token` | Get room access token |

---

## 🎙️ Voice Agent

The voice agent uses LiveKit's real-time infrastructure with:

- **Speech-to-Text**: Deepgram Nova-2
- **LLM**: OpenAI GPT-4-mini
- **Text-to-Speech**: Cartesia Sonic English
- **VAD**: Silero Voice Activity Detection

### Available Tools

The agent can execute these actions via function calling:

```python
check_availability(doctor_id, date_from, date_to)
book_appointment(patient_phone, doctor_id, start_time)
reschedule_appointment(appointment_id, new_start_time)
cancel_appointment(appointment_id, reason)
list_doctors(specialization)
get_patient_info(patient_phone)
transfer_to_agent(reason)
```

---

## 🚢 Deployment

### Docker Compose (Development)

```bash
docker-compose up -d
```

### Production

1. Set environment variables for production
2. Use a managed PostgreSQL (e.g., AWS RDS, Supabase)
3. Use managed Redis (e.g., Redis Cloud, AWS ElastiCache)
4. Deploy backend to cloud platform (e.g., Railway, Render, AWS ECS)
5. Deploy frontend to static hosting (e.g., Vercel, Netlify)

---

## ✅ PRD Compliance

See [01_PRD.md](./01_PRD.md) for full requirements.

| Requirement | Status | Notes |
|-------------|--------|-------|
| **FR-1: Voice Agent Core** | ✅ Complete | LiveKit agent with STT/LLM/TTS |
| **FR-2: Appointment Management** | ✅ Complete | CRUD with conflict detection |
| **FR-3: Patient Data Management** | ✅ Complete | Encrypted PHI, MFA support |
| **FR-4: Notifications** | ✅ Complete | SMS/Email services ready |
| **FR-5: Analytics** | ⚠️ Partial | Basic stats, full analytics pending |
| **NFR-1: Performance** | ✅ Complete | Redis caching, async operations |
| **NFR-2: Security** | ✅ Complete | AES-256 encryption, audit logs |
| **NFR-3: Availability** | ⚠️ Partial | Single instance, HA pending |
| **NFR-4: Scalability** | ⚠️ Partial | Horizontal scaling ready |
| **NFR-5: Usability** | ✅ Complete | Professional voice, responsive UI |

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ for Healthcare Providers**
