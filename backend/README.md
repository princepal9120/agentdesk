# MedVoice Backend - Microservices Architecture

> **Voice Intelligence Agent Backend** - Production-ready NestJS microservices for healthcare appointment scheduling

## 🏗️ Architecture

This is a **microservices architecture** built with NestJS monorepo:

```
┌─────────────┐
│   Clients   │
└──────┬──────┘
       │
┌──────▼──────────┐
│  API Gateway    │ :3000
│  (HTTP/WS)      │
└────────┬────────┘
         │
    ┌────┴────┬────────┬──────────┬──────────┐
    │         │        │          │          │
┌───▼───┐ ┌──▼──┐ ┌───▼────┐ ┌───▼────┐ ┌──▼────┐
│ Auth  │ │Voice│ │Appoint.│ │Notif.  │ │ ...   │
│ :3001 │ │:3002│ │ :3003  │ │ :3004  │ │       │
└───┬───┘ └──┬──┘ └───┬────┘ └───┬────┘ └───────┘
    │        │        │          │
    └────────┴────────┴──────────┘
                  │
         ┌────────┴────────┐
         │                 │
    ┌────▼────┐      ┌────▼────┐
    │PostgreSQL│      │  Redis  │
    └─────────┘      └─────────┘
```

### Services

| Service | Port | Purpose |
|---------|------|---------|
| **Gateway** | 3000 | API Gateway, WebSocket, Routing |
| **Auth** | 3001 | Authentication & Authorization |
| **Voice Agent** | 3002 | Speech-to-Text, LLM, Text-to-Speech |
| **Appointments** | 3003 | Appointment Management |
| **Notifications** | 3004 | Email & SMS Notifications |

### Shared Infrastructure

- **PostgreSQL** (5432) - Shared database
- **Redis** (6379) - Caching & Pub/Sub
- **TCP** - Inter-service communication

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+**
- **Docker & Docker Compose**
- **API Keys**: OpenAI, Deepgram, ElevenLabs

### 1. Clone & Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your API keys
```

### 2. Start All Services

```bash
# Start infrastructure + all microservices
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Run Migrations

```bash
npm install --legacy-peer-deps
npm run prisma:generate
npm run prisma:migrate
```

### 4. Test

```bash
# Health check
curl http://localhost:3000/api/v1/health

# API Docs
open http://localhost:3000/api/docs
```

## 📁 Project Structure

```
backend/
├── apps/                    # Microservices
│   ├── gateway/            # API Gateway (Port 3000)
│   ├── auth/               # Auth Service (Port 3001)
│   ├── voice-agent/        # Voice Agent (Port 3002)
│   ├── appointments/       # Appointments (Port 3003)
│   └── notifications/      # Notifications (Port 3004)
├── libs/                    # Shared Libraries
│   ├── common/             # Redis, Storage, Decorators
│   └── database/           # Prisma Client & Schema
├── docker-compose.yml       # All services orchestration
├── Dockerfile.*            # Per-service Dockerfiles
└── package.json            # Monorepo dependencies
```

## 🛠️ Development

### Start Individual Services

```bash
# Terminal 1 - Gateway
npm run start:dev gateway

# Terminal 2 - Auth
npm run start:dev auth

# Terminal 3 - Voice Agent
npm run start:dev voice-agent

# Terminal 4 - Appointments
npm run start:dev appointments

# Terminal 5 - Notifications
npm run start:dev notifications
```

### Build Services

```bash
# Build all
npm run build

# Build specific service
npx @nestjs/cli build gateway
npx @nestjs/cli build auth
```

### Database

```bash
npm run prisma:studio      # Open database GUI
npm run prisma:migrate     # Run migrations
npm run db:reset           # Reset database
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment
- **[API Docs](http://localhost:3000/api/docs)** - Swagger UI (when running)

## 🔑 Environment Variables

Key variables in `.env`:

```bash
# Database
DATABASE_URL=postgresql://medvoice:password@localhost:5432/medvoice

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# AI Services
OPENAI_API_KEY=sk-...
DEEPGRAM_API_KEY=...
ELEVENLABS_API_KEY=...

# Cloud Storage (Optional)
GCP_PROJECT_ID=...
GCP_BUCKET_NAME=...
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f gateway
docker-compose logs -f auth

# Rebuild specific service
docker-compose up -d --build gateway

# Remove volumes (clean slate)
docker-compose down -v
```

## 🌐 API Endpoints

### Gateway (Port 3000)

- `GET /api/v1/health` - Health check
- `GET /api/docs` - Swagger documentation
- `POST /api/v1/auth/*` - Proxied to Auth service
- `POST /api/v1/agent/*` - Proxied to Voice Agent
- `WS /voice` - WebSocket for real-time voice

### Auth Service (Port 3001)

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token

### Voice Agent (Port 3002)

- `POST /agent/start-session` - Start voice session
- `POST /agent/text-query` - Text-based query
- `POST /agent/process-audio` - Process audio

### Appointments (Port 3003)

- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `PATCH /appointments/:id` - Update appointment

### Notifications (Port 3004)

- `POST /notifications/email` - Send email
- `POST /notifications/sms` - Send SMS

## 🔧 Tech Stack

- **Framework**: NestJS (Microservices)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Communication**: TCP (NestJS Microservices)
- **AI**: OpenAI, LangChain, Deepgram, ElevenLabs
- **Container**: Docker + Docker Compose

## 📊 Monitoring

```bash
# View service logs
docker-compose logs -f

# Check service health
curl http://localhost:3000/api/v1/health
curl http://localhost:3001/health
curl http://localhost:3002/health

# Database GUI
npm run prisma:studio
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests: `npm run test`
4. Build: `npm run build`
5. Submit PR

## 📝 License

MIT

## 🆘 Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Email**: support@medvoice.com

---

Built with ❤️ using NestJS Microservices
