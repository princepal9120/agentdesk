# API Testing Guide

## Testing with cURL

### 1. Health Check

```bash
curl http://localhost:3000/api/v1/health
```

### 2. User Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "SecurePass123!",
    "firstName": "Dr. Jane",
    "lastName": "Smith",
    "phone": "+1234567890",
    "role": "PRACTICE_ADMIN"
  }'
```

Save the `accessToken` and `refreshToken` from the response.

### 3. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "SecurePass123!"
  }'
```

### 4. Get Current User Profile

```bash
TOKEN="your-access-token-here"

curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Start Voice Agent Session

```bash
curl -X POST http://localhost:3000/api/v1/agent/start-session \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "practiceId": "optional-practice-id"
  }'
```

Save the `conversationId`.

### 6. Send Text Query to Agent

```bash
CONVERSATION_ID="your-conversation-id"

curl -X POST http://localhost:3000/api/v1/agent/text-query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "'$CONVERSATION_ID'",
    "text": "I need to schedule an appointment for next Monday at 2 PM"
  }'
```

### 7. End Session

```bash
curl -X POST http://localhost:3000/api/v1/agent/end-session/$CONVERSATION_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "outcome": "appointment_booked"
  }'
```

### 8. Refresh Token

```bash
REFRESH_TOKEN="your-refresh-token"

curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "'$REFRESH_TOKEN'"
  }'
```

### 9. Logout

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "'$REFRESH_TOKEN'"
  }'
```

## Testing with Postman

### Setup

1. Import the following as environment variables:
   - `base_url`: `http://localhost:3000/api/v1`
   - `access_token`: (will be set automatically)
   - `refresh_token`: (will be set automatically)
   - `conversation_id`: (will be set automatically)

### Collection Structure

```
MedVoice API
├── Auth
│   ├── Signup
│   ├── Login
│   ├── Refresh Token
│   └── Logout
├── Users
│   ├── Get Profile
│   ├── List Users
│   └── Update User
└── Voice Agent
    ├── Start Session
    ├── Text Query
    ├── Audio Query
    ├── End Session
    └── Get Stats
```

### Auto-set Tokens (Postman Tests)

Add this to Login request Tests tab:

```javascript
const response = pm.response.json();
pm.environment.set("access_token", response.accessToken);
pm.environment.set("refresh_token", response.refreshToken);
```

Add this to Start Session Tests tab:

```javascript
const response = pm.response.json();
pm.environment.set("conversation_id", response.conversationId);
```

## WebSocket Testing

### Using wscat

```bash
npm install -g wscat

# Connect
wscat -c ws://localhost:3000/voice

# After connected, send:
{"event": "start_session", "data": {"practiceId": "optional"}}

# Send text message:
{"event": "text_message", "data": {"conversationId": "your-id", "text": "Hello"}}

# End session:
{"event": "end_session", "data": {"conversationId": "your-id"}}
```

### Using JavaScript

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000/voice');

socket.on('connect', () => {
  console.log('Connected!');
  
  socket.emit('start_session', {
    practiceId: 'test-practice'
  });
});

socket.on('session_started', (data) => {
  console.log('Session started:', data);
  
  socket.emit('text_message', {
    conversationId: data.conversationId,
    text: 'I need an appointment'
  });
});

socket.on('agent_response', (data) => {
  console.log('Agent says:', data.text);
});

socket.on('error', (error) => {
  console.error('Error:', error);
});
```

## Load Testing with k6

Create `load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  // Login
  const loginRes = http.post('http://localhost:3000/api/v1/auth/login', 
    JSON.stringify({
      email: 'test@example.com',
      password: 'Test123!'
    }), 
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });
  
  const token = loginRes.json('accessToken');
  
  // Start session
  const sessionRes = http.post(
    'http://localhost:3000/api/v1/agent/start-session',
    '{}',
    { headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    }}
  );
  
  check(sessionRes, {
    'session started': (r) => r.status === 201,
  });
  
  sleep(1);
}
```

Run:
```bash
k6 run load-test.js
```

## Expected Responses

### Successful Signup
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "doctor@example.com",
    "firstName": "Dr. Jane",
    "lastName": "Smith",
    "role": "PRACTICE_ADMIN"
  }
}
```

### Successful Text Query
```json
{
  "response": "I'd be happy to help you schedule an appointment for next Monday at 2 PM. Could you please provide me with your full name and phone number?"
}
```

### Health Check
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "database": "connected",
  "redis": "connected"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## Testing Checklist

- [ ] Health check returns 200
- [ ] User can signup
- [ ] User can login
- [ ] Invalid credentials return 401
- [ ] Token refresh works
- [ ] Protected routes require authentication
- [ ] Voice session can be started
- [ ] Text queries return responses
- [ ] Session can be ended
- [ ] WebSocket connection works
- [ ] Rate limiting activates after threshold
- [ ] Logout invalidates tokens

## Automated Testing

Run the test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

For more details, see the Swagger documentation at `http://localhost:3000/api/docs`
