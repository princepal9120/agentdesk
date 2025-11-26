# MedVoice Backend - Voice Intelligence Agent

Production-ready NestJS backend for AI-powered voice agent with real-time appointment scheduling.

## 🚀 Features

- ✅ **Voice AI Pipeline**: Real-time speech-to-text, LLM processing, and text-to-speech
- ✅ **LangChain Integration**: Advanced agent with tools for appointment management
- ✅ **WebSocket Support**: Bidirectional real-time communication
- ✅ **JWT Authentication**: Secure auth with refresh tokens
- ✅ **PostgreSQL + Prisma**: Type-safe database access
- ✅ **Redis Caching**: Session management and rate limiting
- ✅ **GCP Integration**: Cloud Storage and Pub/Sub
- ✅ **Swagger Documentation**: Auto-generated API docs
- ✅ **Production Ready**: Docker, health checks, logging

## 📋 Prerequisites

- Node.js 20+ and npm 9+
- PostgreSQL 14+
- Redis 7+
- GCP account (for storage)
- API keys for:
  - OpenAI
  - Deepgram
  - ElevenLabs
  - Twilio (optional)

## 🛠️ Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- Database URL
- Redis connection
- API keys (OpenAI, Deepgram, ElevenLabs)
- JWT secrets
- GCP credentials

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

The server will start at `http://localhost:3000`

API Documentation: `http://localhost:3000/api/docs`

## 🐳 Docker Setup

### Using Docker Compose (Recommended for Local Development)

```bash
# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Build Docker Image

```bash
docker build -t medvoice-backend .
docker run -p 3000:3000 --env-file .env medvoice-backend
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Voice Agent
- `POST /api/v1/agent/start-session` - Start voice session
- `POST /api/v1/agent/text-query` - Send text query
- `POST /api/v1/agent/audio-query/:id` - Send audio query
- `POST /api/v1/agent/end-session/:id` - End session
- `GET /api/v1/agent/stats` - Get statistics

### WebSocket
- `ws://localhost:3000/voice` - WebSocket connection
  - Events: `start_session`, `audio_stream`, `text_message`, `end_session`

### Users
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users` - List all users (admin)
- `PATCH /api/v1/users/:id` - Update user

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/              # Authentication & JWT
│   │   ├── users/             # User management
│   │   ├── voice-agent/       # Voice AI services (STT, TTS)
│   │   ├── agent-core/        # LangChain agent & tools
│   │   ├── websocket/         # WebSocket gateway
│   │   ├── appointments/      # Appointment management
│   │   ├── conversations/     # Conversation history
│   │   ├── storage/           # GCP Cloud Storage
│   │   ├── notifications/     # SMS/Email notifications
│   │   ├── prisma/            # Database service
│   │   └── redis/             # Redis service
│   ├── common/
│   │   └── utils/             # Shared utilities
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry
├── prisma/
│   └── schema.prisma          # Database schema
├── test/                      # Tests
├── docker-compose.yml         # Docker Compose config
├── Dockerfile                 # Production Dockerfile
└── package.json
```

## 🔧 Development

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npm run prisma:migrate

# Reset database
npm run db:reset
```

### Prisma Studio

```bash
npm run prisma:studio
```

Opens Prisma Studio at `http://localhost:5555`

## 🚢 Deployment

### GCP Cloud Run

1. **Build and push Docker image:**

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/medvoice-backend
```

2. **Deploy to Cloud Run:**

```bash
gcloud run deploy medvoice-backend \
  --image gcr.io/PROJECT_ID/medvoice-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=postgresql://... \
  --set-env-vars REDIS_HOST=... \
  --add-cloudsql-instances PROJECT_ID:REGION:INSTANCE
```

3. **Set up Cloud SQL:**

```bash
gcloud sql instances create medvoice-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1
```

4. **Configure environment variables** in Cloud Run console

### Environment Variables for Production

Required:
- `DATABASE_URL`
- `REDIS_HOST`, `REDIS_PORT`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `OPENAI_API_KEY`
- `DEEPGRAM_API_KEY`
- `ELEVENLABS_API_KEY`
- `GCP_PROJECT_ID`, `GCP_STORAGE_BUCKET`

## 📊 Monitoring

- **Logs**: Winston logger with file and console transports
- **Health Check**: `GET /api/v1/health`
- **Metrics**: Active sessions, API response times
- **Sentry**: Error tracking (configure `SENTRY_DSN`)

## 🔐 Security

- JWT with refresh token rotation
- Rate limiting (100 req/min default)
- CORS configuration
- Helmet security headers
- Input validation with class-validator
- SQL injection protection via Prisma
- Password hashing with bcrypt (12 rounds)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file

## 🆘 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Documentation: See `/docs` folder
- API Docs: `http://localhost:3000/api/docs`

---

Built with ❤️ using NestJS, LangChain, and modern AI technologies
