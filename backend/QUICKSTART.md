# Quick Start Guide - MedVoice Backend

Get up and running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- Docker and Docker Compose installed
- API keys ready (OpenAI, Deepgram, ElevenLabs)

## Option 1: Docker Compose (Recommended)

### 1. Clone and Setup

```bash
cd backend
cp .env.example .env
```

### 2. Edit .env file

```bash
# Required: Add your API keys
OPENAI_API_KEY=sk-your-key-here
DEEPGRAM_API_KEY=your-key-here
ELEVENLABS_API_KEY=your-key-here

# Optional: Change JWT secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

### 3. Start Everything

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Redis cache
- Backend API

### 4. Run Migrations

```bash
# Wait 10 seconds for database to be ready, then:
npm install
npm run prisma:generate
npm run prisma:migrate
```

### 5. Test It!

```bash
# Check health
curl http://localhost:3000/api/v1/health

# View API docs
open http://localhost:3000/api/docs
```

## Option 2: Local Development

### 1. Install PostgreSQL and Redis

```bash
# macOS
brew install postgresql redis
brew services start postgresql
brew services start redis

# Ubuntu
sudo apt install postgresql redis-server
sudo systemctl start postgresql redis
```

### 2. Create Database

```bash
createdb medvoice
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

### 4. Install and Run

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

## Quick Test

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

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "STAFF"
  }
}
```

### 2. Start a Voice Session

```bash
# Save the accessToken from above
TOKEN="your-access-token"

curl -X POST http://localhost:3000/api/v1/agent/start-session \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Response:
```json
{
  "conversationId": "uuid",
  "message": "Session started successfully"
}
```

### 3. Send a Text Query

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

Response:
```json
{
  "response": "I'd be happy to help you schedule an appointment! Could you please provide me with your full name and preferred date?"
}
```

## WebSocket Test

### Using JavaScript

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000/voice');

socket.on('connected', (data) => {
  console.log('Connected:', data);
  
  // Start session
  socket.emit('start_session', {
    practiceId: 'optional-practice-id'
  });
});

socket.on('session_started', (data) => {
  console.log('Session started:', data);
  
  // Send text message
  socket.emit('text_message', {
    conversationId: data.conversationId,
    text: 'Hello, I need an appointment'
  });
});

socket.on('agent_response', (data) => {
  console.log('Agent response:', data.text);
});
```

## Common Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Database
npm run prisma:studio      # Open database GUI
npm run prisma:migrate     # Run migrations
npm run db:reset           # Reset database (careful!)

# Docker
docker-compose up -d       # Start services
docker-compose logs -f     # View logs
docker-compose down        # Stop services

# Testing
npm run test               # Unit tests
npm run test:e2e           # E2E tests
npm run test:cov           # Coverage report
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
DATABASE_URL="postgresql://user:password@localhost:5432/medvoice?schema=public"
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Prisma Client Not Generated

```bash
npm run prisma:generate
```

## Next Steps

1. **Explore API Docs**: http://localhost:3000/api/docs
2. **Read Architecture**: See `ARCHITECTURE.md`
3. **Deploy to Cloud**: See `DEPLOYMENT.md`
4. **Customize AI Prompts**: Edit system prompts in `agent.service.ts`
5. **Add Providers**: Create providers and appointment types via API

## Need Help?

- Check logs: `docker-compose logs -f backend`
- View database: `npm run prisma:studio`
- API documentation: http://localhost:3000/api/docs
- GitHub Issues: Report bugs and ask questions

---

Happy coding! 🚀
