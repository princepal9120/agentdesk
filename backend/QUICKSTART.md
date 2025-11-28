# Quick Start - MedVoice Microservices

Get all 5 microservices running in **5 minutes**! 🚀

## Prerequisites

- **Node.js 20+** installed
- **Docker & Docker Compose** installed
- **API Keys** ready: OpenAI, Deepgram, ElevenLabs

---

## Option 1: Docker Compose (Recommended)

### Step 1: Setup Environment

```bash
cd backend
cp .env.example .env
```

### Step 2: Configure API Keys

Edit `.env`:

```bash
# Required API Keys
OPENAI_API_KEY=sk-your-openai-key
DEEPGRAM_API_KEY=your-deepgram-key
ELEVENLABS_API_KEY=your-elevenlabs-key

# JWT Secrets (change these!)
JWT_SECRET=your-super-secret-jwt-key-change-me
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-me

# Database (auto-configured by Docker)
DATABASE_URL=postgresql://medvoice:medvoice_password@postgres:5432/medvoice?schema=public
REDIS_HOST=redis
REDIS_PORT=6379
```

### Step 3: Start All Services

```bash
docker-compose up -d
```

This starts:
- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6379)
- ✅ API Gateway (port 3000)
- ✅ Auth Service (port 3001)
- ✅ Voice Agent Service (port 3002)
- ✅ Appointments Service (port 3003)
- ✅ Notifications Service (port 3004)

### Step 4: Run Database Migrations

```bash
# Install dependencies
npm install --legacy-peer-deps

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### Step 5: Verify Everything Works

```bash
# Check all services are running
docker-compose ps

# Test Gateway health
curl http://localhost:3000/api/v1/health

# View API documentation
open http://localhost:3000/api/docs
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "redis": "connected"
}
```

---

## Option 2: Local Development (Without Docker)

### Step 1: Install PostgreSQL & Redis

**macOS:**
```bash
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis
```

**Ubuntu:**
```bash
sudo apt install postgresql-16 redis-server
sudo systemctl start postgresql redis
```

### Step 2: Create Database

```bash
createdb medvoice
```

### Step 3: Setup Environment

```bash
cp .env.example .env
```

Edit `.env`:
```bash
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/medvoice?schema=public
REDIS_HOST=localhost
REDIS_PORT=6379

# Add your API keys
OPENAI_API_KEY=sk-...
DEEPGRAM_API_KEY=...
ELEVENLABS_API_KEY=...
```

### Step 4: Install & Setup

```bash
npm install --legacy-peer-deps
npm run prisma:generate
npm run prisma:migrate
```

### Step 5: Start Services (5 Terminals)

**Terminal 1 - Gateway:**
```bash
npm run start:dev gateway
```

**Terminal 2 - Auth:**
```bash
npm run start:dev auth
```

**Terminal 3 - Voice Agent:**
```bash
npm run start:dev voice-agent
```

**Terminal 4 - Appointments:**
```bash
npm run start:dev appointments
```

**Terminal 5 - Notifications:**
```bash
npm run start:dev notifications
```

---

## Quick API Test

### 1. Create a User

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "role": "STAFF"
  }
}
```

### 2. Start Voice Session

```bash
# Save token from above
TOKEN="your-access-token"

curl -X POST http://localhost:3000/api/v1/agent/start-session \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "conversationId": "uuid",
  "message": "Session started successfully"
}
```

### 3. Send Text Query

```bash
CONVERSATION_ID="your-conversation-id"

curl -X POST http://localhost:3000/api/v1/agent/text-query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "'$CONVERSATION_ID'",
    "text": "I need to schedule an appointment"
  }'
```

---

## Service Ports Reference

| Service | Port | URL |
|---------|------|-----|
| **Gateway** | 3000 | http://localhost:3000 |
| **Auth** | 3001 | http://localhost:3001 |
| **Voice Agent** | 3002 | http://localhost:3002 |
| **Appointments** | 3003 | http://localhost:3003 |
| **Notifications** | 3004 | http://localhost:3004 |
| **PostgreSQL** | 5432 | localhost:5432 |
| **Redis** | 6379 | localhost:6379 |

---

## Common Commands

### Docker

```bash
# Start all services
docker-compose up -d

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f gateway
docker-compose logs -f auth

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v
```

### Development

```bash
# Start with hot reload
npm run start:dev gateway
npm run start:dev auth

# Build all services
npm run build

# Build specific service
npx @nestjs/cli build gateway
```

### Database

```bash
# Open database GUI
npm run prisma:studio

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Reset database (⚠️ deletes all data)
npm run db:reset
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run start:dev gateway
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps postgres
# or
pg_isready

# Verify connection string in .env
DATABASE_URL=postgresql://medvoice:medvoice_password@localhost:5432/medvoice?schema=public
```

### Redis Connection Error

```bash
# Check Redis is running
docker-compose ps redis
# or
redis-cli ping
# Should return: PONG
```

### Prisma Client Not Generated

```bash
npm run prisma:generate
```

### Docker Build Fails

```bash
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Service Won't Start

```bash
# Check logs
docker-compose logs service-name

# Common issues:
# 1. Database not ready - wait 10 seconds and retry
# 2. Missing .env file - copy from .env.example
# 3. Port conflict - change port in docker-compose.yml
```

---

## Next Steps

1. ✅ **Explore API Docs**: http://localhost:3000/api/docs
2. 📖 **Read Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
3. 🚀 **Deploy to Cloud**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
4. 🎨 **Customize AI**: Edit system prompts in `apps/voice-agent/src/agent-core/services/agent.service.ts`
5. 📊 **Monitor Services**: `docker-compose logs -f`

---

## WebSocket Example

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000/voice');

socket.on('connected', (data) => {
  console.log('Connected:', data);
  
  socket.emit('start_session', {});
});

socket.on('session_started', (data) => {
  console.log('Session:', data.conversationId);
  
  socket.emit('text_message', {
    conversationId: data.conversationId,
    text: 'Hello, I need an appointment'
  });
});

socket.on('agent_response', (data) => {
  console.log('Agent:', data.text);
});
```

---

## Need Help?

- 📚 **Documentation**: See `/docs` folder
- 🐛 **Issues**: GitHub Issues
- 💬 **Community**: Discord/Slack
- 📧 **Email**: support@medvoice.com

---

**Happy coding!** 🎉
