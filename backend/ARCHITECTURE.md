# Architecture - MedVoice Microservices

## Overview

MedVoice Backend is built using a **microservices architecture** with NestJS monorepo. Each service is independently deployable, scalable, and maintains its own bounded context.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│  (Web App, Mobile App, Third-party Integrations)            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS/WSS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY :3000                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   HTTP   │  │WebSocket │  │  Auth    │                  │
│  │  Router  │  │ Gateway  │  │Middleware│                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┬──────────┬──────────┐
         │ TCP                   │ TCP      │ TCP      │ TCP
         ▼                       ▼          ▼          ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  AUTH SERVICE  │  │ VOICE AGENT    │  │ APPOINTMENTS   │  │ NOTIFICATIONS  │
│     :3001      │  │    :3002       │  │     :3003      │  │     :3004      │
├────────────────┤  ├────────────────┤  ├────────────────┤  ├────────────────┤
│ • User Auth    │  │ • STT (Deepgram│  │ • CRUD Appts   │  │ • Email (SMTP) │
│ • JWT Tokens   │  │ • LLM (OpenAI) │  │ • Scheduling   │  │ • SMS (Twilio) │
│ • Rate Limit   │  │ • TTS (11Labs) │  │ • Providers    │  │ • Templates    │
│ • User Mgmt    │  │ • Agent Logic  │  │ • Practices    │  │ • Queue        │
└────────┬───────┘  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘
         │                   │                   │                   │
         └───────────────────┴───────────────────┴───────────────────┘
                                      │
                     ┌────────────────┴────────────────┐
                     │                                  │
              ┌──────▼──────┐                   ┌──────▼──────┐
              │ PostgreSQL  │                   │    Redis    │
              │   :5432     │                   │    :6379    │
              └─────────────┘                   └─────────────┘
```

## Services

### 1. API Gateway (Port 3000)

**Purpose**: Single entry point for all client requests

**Responsibilities**:
- HTTP request routing to microservices
- WebSocket gateway for real-time communication
- JWT authentication middleware
- Rate limiting
- Request/response logging
- CORS handling
- API documentation (Swagger)

**Technology**:
- NestJS Gateway
- Socket.io for WebSocket
- Passport JWT
- Swagger/OpenAPI

**Key Files**:
- `apps/gateway/src/app.module.ts` - Main module with ClientsModule registration
- `apps/gateway/src/main.ts` - Bootstrap with middleware
- `apps/gateway/src/auth/` - Gateway-level authentication

### 2. Auth Service (Port 3001)

**Purpose**: User authentication and authorization

**Responsibilities**:
- User registration (signup)
- User login with password hashing (bcrypt)
- JWT token generation (access + refresh)
- Token refresh mechanism
- User logout
- Rate limiting for login attempts
- User management (CRUD)
- Role-based access control (RBAC)

**Technology**:
- NestJS + Passport
- JWT (access & refresh tokens)
- bcrypt for password hashing
- Redis for rate limiting

**Database Tables**:
- `User` - User accounts
- `RefreshToken` - Active refresh tokens

**Key Files**:
- `apps/auth/src/auth/auth.service.ts` - Core auth logic
- `apps/auth/src/auth/strategies/jwt.strategy.ts` - JWT validation
- `apps/auth/src/users/users.service.ts` - User management

### 3. Voice Agent Service (Port 3002)

**Purpose**: Voice intelligence and AI agent orchestration

**Responsibilities**:
- Speech-to-Text (Deepgram SDK)
- Text-to-Speech (ElevenLabs)
- LLM-based agent (OpenAI + LangChain)
- Conversation management
- Voice session handling
- Tool execution (appointment booking, info retrieval)
- Audio streaming

**Technology**:
- Deepgram for STT
- ElevenLabs for TTS
- OpenAI GPT-4
- LangChain for agent orchestration
- LangGraph for workflow

**Database Tables**:
- `Conversation` - Conversation sessions
- `Message` - Conversation messages

**Key Files**:
- `apps/voice-agent/src/voice-agent/services/voice-agent.service.ts` - Voice orchestration
- `apps/voice-agent/src/agent-core/services/agent.service.ts` - LangChain agent
- `apps/voice-agent/src/agent-core/tools/` - Agent tools

### 4. Appointments Service (Port 3003)

**Purpose**: Appointment scheduling and management

**Responsibilities**:
- Create/Read/Update/Delete appointments
- Appointment status management
- Provider management
- Practice management
- Appointment type configuration
- Availability checking
- Conflict detection

**Technology**:
- NestJS CRUD
- Prisma ORM
- Date-fns for date handling

**Database Tables**:
- `Appointment` - Appointment records
- `Provider` - Healthcare providers
- `Practice` - Medical practices
- `AppointmentType` - Appointment categories

**Key Files**:
- `apps/appointments/src/appointments/appointments.service.ts` - Business logic
- `apps/appointments/src/appointments/appointments.controller.ts` - REST API

### 5. Notifications Service (Port 3004)

**Purpose**: Multi-channel notifications

**Responsibilities**:
- Email notifications (SMTP)
- SMS notifications (Twilio)
- Notification templates
- Notification queue management
- Delivery tracking
- Retry logic

**Technology**:
- Nodemailer for email
- Twilio for SMS
- Bull for job queue
- Redis for queue storage

**Database Tables**:
- `Notification` - Notification records
- `NotificationTemplate` - Reusable templates

**Key Files**:
- `apps/notifications/src/notifications/notifications.service.ts` - Notification logic
- `apps/notifications/src/notifications/email.service.ts` - Email sender
- `apps/notifications/src/notifications/sms.service.ts` - SMS sender

## Shared Libraries

### `libs/common`

**Purpose**: Shared utilities and infrastructure

**Exports**:
- `RedisModule` & `RedisService` - Caching, rate limiting, pub/sub
- `StorageModule` & `StorageService` - GCP Cloud Storage
- `HealthController` - Health check endpoint
- **Decorators**:
  - `@Public()` - Mark routes as public
  - `@CurrentUser()` - Extract user from request
  - `@Roles()` - Role-based access control
- **Constants**:
  - `SERVICE_NAMES` - Microservice identifiers
  - `SERVICE_PORTS` - Port mappings
  - `SERVICE_HOSTS` - Host configurations
- `createLogger()` - Winston logger

### `libs/database`

**Purpose**: Database access layer

**Exports**:
- `PrismaModule` & `PrismaService` - Database client
- Prisma schema: `libs/database/prisma/schema.prisma`

## Communication Patterns

### 1. Client → Gateway (HTTP/WebSocket)

- **HTTP**: REST API calls
- **WebSocket**: Real-time voice streaming

### 2. Gateway → Services (TCP)

- **Transport**: NestJS TCP Microservices
- **Pattern**: Request-Response
- **Format**: JSON messages

Example:
```typescript
// Gateway sends to Auth Service
this.authClient.send('validate_token', { token })
```

### 3. Service → Service (TCP)

Services can communicate directly via TCP:

```typescript
// Voice Agent → Appointments
this.appointmentsClient.send('create_appointment', appointmentDto)
```

### 4. Service → Database (SQL)

- **ORM**: Prisma
- **Connection**: PostgreSQL connection pool
- **Shared Database**: All services use the same database (for now)

### 5. Service → Redis (Cache/Pub-Sub)

- **Caching**: Store frequently accessed data
- **Rate Limiting**: Track request counts
- **Pub/Sub**: Event broadcasting (future)

## Data Flow Examples

### User Signup Flow

```
1. Client → Gateway: POST /api/v1/auth/signup
2. Gateway → Auth Service (TCP): { cmd: 'signup', data: {...} }
3. Auth Service → PostgreSQL: INSERT INTO users
4. Auth Service → Redis: SET rate_limit_key
5. Auth Service → Gateway: { accessToken, refreshToken, user }
6. Gateway → Client: 201 Created
```

### Voice Session Flow

```
1. Client → Gateway: WebSocket connect /voice
2. Client → Gateway: emit('start_session')
3. Gateway → Voice Agent (TCP): { cmd: 'start_session' }
4. Voice Agent → PostgreSQL: INSERT INTO conversations
5. Voice Agent → Gateway: { conversationId }
6. Gateway → Client: emit('session_started', { conversationId })
7. Client → Gateway: emit('audio_chunk', audioData)
8. Gateway → Voice Agent: { cmd: 'process_audio', data }
9. Voice Agent → Deepgram API: STT
10. Voice Agent → OpenAI API: LLM
11. Voice Agent → Appointments (TCP): { cmd: 'create_appointment' }
12. Appointments → PostgreSQL: INSERT INTO appointments
13. Voice Agent → ElevenLabs API: TTS
14. Voice Agent → Gateway: { audioResponse }
15. Gateway → Client: emit('audio_response', audioData)
```

## Database Schema

### Shared Database Strategy

Currently using a **shared database** with logical ownership:

| Table | Owner Service | Purpose |
|-------|---------------|---------|
| `User` | Auth | User accounts |
| `RefreshToken` | Auth | JWT refresh tokens |
| `Conversation` | Voice Agent | Voice sessions |
| `Message` | Voice Agent | Chat messages |
| `Appointment` | Appointments | Appointments |
| `Provider` | Appointments | Healthcare providers |
| `Practice` | Appointments | Medical practices |
| `Notification` | Notifications | Notification records |

**Future**: Each service can have its own database for true isolation.

## Security

### Authentication Flow

1. User logs in via Gateway
2. Gateway forwards to Auth Service
3. Auth Service validates credentials
4. Auth Service generates JWT tokens
5. Client stores tokens
6. Client sends JWT in `Authorization` header
7. Gateway validates JWT via JwtStrategy
8. Gateway forwards authenticated requests to services

### Authorization

- **JWT**: Access tokens (15 min expiry)
- **Refresh Tokens**: Long-lived (7 days)
- **RBAC**: Role-based access control
  - `ADMIN` - Full access
  - `STAFF` - Standard access
  - `PATIENT` - Limited access

### Rate Limiting

- **Redis-based**: Track request counts per IP/user
- **Configurable**: Different limits per endpoint
- **Throttling**: Automatic backoff

## Scalability

### Horizontal Scaling

Each service can be scaled independently:

```bash
# Scale Voice Agent to 3 instances
docker-compose up -d --scale voice-agent=3

# Scale Appointments to 2 instances
docker-compose up -d --scale appointments=2
```

### Load Balancing

- **Gateway**: Use Nginx/HAProxy for load balancing
- **Services**: Round-robin TCP connections

### Caching Strategy

- **Redis**: Cache frequently accessed data
- **TTL**: Configurable per data type
- **Invalidation**: On data updates

## Monitoring & Logging

### Logging

- **Winston**: Structured logging
- **Levels**: error, warn, info, debug
- **Format**: JSON for production
- **Storage**: File rotation + cloud storage

### Health Checks

Each service exposes `/health`:

```bash
curl http://localhost:3000/api/v1/health  # Gateway
curl http://localhost:3001/health         # Auth
curl http://localhost:3002/health         # Voice Agent
```

### Metrics (Future)

- Prometheus for metrics collection
- Grafana for visualization
- Distributed tracing with Jaeger

## Deployment

### Docker Compose (Development)

```bash
docker-compose up -d
```

### Kubernetes (Production)

Each service gets:
- Deployment
- Service
- ConfigMap
- Secret
- HorizontalPodAutoscaler

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

## Future Enhancements

### Planned Features

1. **Event-Driven Architecture**
   - RabbitMQ/Kafka for async messaging
   - Event sourcing for audit trails

2. **Service Mesh**
   - Istio for traffic management
   - mTLS for service-to-service encryption

3. **Database per Service**
   - Separate PostgreSQL instances
   - Data synchronization strategies

4. **API Gateway Enhancements**
   - GraphQL federation
   - gRPC support
   - Circuit breakers

5. **Observability**
   - Distributed tracing
   - Real-time metrics
   - Alerting

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | NestJS |
| **Language** | TypeScript |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma |
| **Cache** | Redis 7 |
| **Communication** | TCP (NestJS Microservices) |
| **AI/ML** | OpenAI, LangChain, Deepgram, ElevenLabs |
| **Container** | Docker |
| **Orchestration** | Docker Compose / Kubernetes |
| **Logging** | Winston |
| **Testing** | Jest |

---

**Last Updated**: 2024-01-01  
**Version**: 2.0 (Microservices)
