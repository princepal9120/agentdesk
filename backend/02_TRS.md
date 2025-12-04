# Technical Requirements Specification (TRS)
## AI Voice Agent for Doctor Appointment Management System

**Version:** 1.0  
**Last Updated:** December 2024  
**Audience:** Development Team, DevOps, QA

---

## 1. SYSTEM ARCHITECTURE

### 1.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES LAYER                   │
├──────────────────────────────────────────────────────────────┤
│  Twilio/Vonage    AssemblyAI    OpenAI    Cartesia    SendGrid
│  (Telephony)      (STT)         (LLM)     (TTS)       (Email)
└──────────────────┬──────────────┬────────┬─────────┬────────┘
                   │              │        │         │
┌──────────────────▼──────────────▼────────▼─────────▼────────┐
│           LIVEKIT VOICE AGENT (Python)                       │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Agent Orchestration Layer                             │  │
│  │  • Session Management                                  │  │
│  │  • Call State Machine                                  │  │
│  │  • Intent Recognition Pipeline                         │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Voice Pipeline (STT → LLM → TTS)                      │  │
│  │  • Real-time speech processing                         │  │
│  │  • Context-aware LLM reasoning                         │  │
│  │  • Natural voice synthesis                             │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                                  │  │
│  │  • Appointment booking engine                          │  │
│  │  • Availability calculation                            │  │
│  │  • Conflict resolution                                 │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST/WebSocket (TLS 1.3)
┌──────────────────────────▼──────────────────────────────────┐
│              BACKEND API SERVER (FastAPI)                    │
├──────────────────────────────────────────────────────────────┤
│  ┌─ Authentication Module ──────────────────────────────┐   │
│  │ • JWT Token Generation                               │   │
│  │ • Multi-factor Authentication (SMS/Email OTP)        │   │
│  │ • Session Management                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌─ Appointment Service ───────────────────────────────┐   │
│  │ • CRUD operations for appointments                   │   │
│  │ • Real-time availability checks                      │   │
│  │ • Double-booking prevention                          │   │
│  │ • Waitlist management                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌─ Patient Service ──────────────────────────────────┐   │
│  │ • Patient registration & verification               │   │
│  │ • Medical history tracking                           │   │
│  │ • Notification preferences                           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌─ Doctor Service ──────────────────────────────────┐   │
│  │ • Doctor profile management                         │   │
│  │ • Availability scheduling                           │   │
│  │ • Working hours configuration                        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌─ Notification Service ────────────────────────────┐   │
│  │ • SMS scheduling & delivery                         │   │
│  │ • Email queueing                                    │   │
│  │ • Call scheduling (outbound)                        │   │
│  │ • Delivery tracking & retries                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌─ Webhook Handler ────────────────────────────────┐   │
│  │ • Twilio call events                               │   │
│  │ • Notification delivery confirmations              │   │
│  │ • External system integrations                     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌─ Audit & Compliance ──────────────────────────────┐   │
│  │ • HIPAA audit logging                              │   │
│  │ • Data access tracking                             │   │
│  │ • Encryption key management                        │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │ SQL/Connection Pool + Redis Protocol
┌──────────────────▼───────────────────────────────────────────┐
│            DATA PERSISTENCE & CACHING LAYER                   │
├──────────────────────────────────────────────────────────────┤
│  ┌─ PostgreSQL (Primary DB) ────────────────────────┐   │
│  │ • Patients                                        │   │
│  │ • Doctors                                         │   │
│  │ • Appointments                                    │   │
│  │ • Notifications                                   │   │
│  │ • Audit Logs                                      │   │
│  │ • Encryption: AES-256 at rest                     │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌─ Redis (Cache & Sessions) ────────────────────────┐   │
│  │ • Session data (TTL: 24 hours)                    │   │
│  │ • Real-time availability (TTL: 5 seconds)         │   │
│  │ • OTP cache (TTL: 10 minutes)                     │   │
│  │ • Rate limiter counters                           │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌─ S3-Compatible Storage ──────────────────────────┐   │
│  │ • Call recordings (encrypted)                     │   │
│  │ • Call transcripts                                │   │
│  │ • Document uploads (encrypted)                    │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. BACKEND REQUIREMENTS

### 2.1 Core Technology Stack

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| Framework | FastAPI | 0.104+ | Async-first, high performance, built-in validation |
| Python | Python | 3.11+ | Modern async/await, type hints, extensive AI libraries |
| Database | PostgreSQL | 15+ | ACID transactions, JSONB support, proven stability |
| Cache | Redis | 7.0+ | High-performance, supports pub/sub for real-time updates |
| ORM | SQLAlchemy | 2.0+ | Type-safe queries, migration support with Alembic |
| Validation | Pydantic | 2.0+ | Runtime validation, JSON schema generation |
| Task Queue | Celery + Redis | Latest | Async task processing for notifications |
| HTTP Client | HTTPX | Latest | Async HTTP client with timeout handling |
| Monitoring | Datadog/New Relic | Latest | APM, error tracking, dashboards |

### 2.2 Backend API Specifications

#### 2.2.1 Authentication Endpoints

```
POST /api/v1/auth/register
├─ Body: { email, phone, password, full_name }
├─ Response: { user_id, token, refresh_token }
└─ Error: 400 (invalid), 409 (exists), 422 (validation)

POST /api/v1/auth/login
├─ Body: { email_or_phone, password }
├─ Response: { user_id, token, refresh_token, expires_in }
└─ Error: 401 (invalid), 429 (rate limited)

POST /api/v1/auth/otp/request
├─ Body: { phone_number }
├─ Response: { otp_id, expires_in }
└─ Error: 400 (invalid phone), 429 (rate limited)

POST /api/v1/auth/otp/verify
├─ Body: { otp_id, otp_code }
├─ Response: { token, refresh_token }
└─ Error: 400 (invalid otp), 401 (expired)

POST /api/v1/auth/logout
├─ Header: Authorization: Bearer {token}
├─ Response: { message: "Logged out successfully" }
└─ Side Effect: Invalidate refresh token
```

#### 2.2.2 Appointment Endpoints

```
GET /api/v1/appointments
├─ Query: ?patient_id=X&status=confirmed&limit=20&offset=0
├─ Response: { total, appointments: [...], has_more }
├─ Filter: By patient, doctor, date range, status
└─ Authorization: Patient (self) or Doctor (their patients) or Admin

POST /api/v1/appointments
├─ Body: { doctor_id, patient_id, start_time, duration_minutes, reason }
├─ Response: { appointment_id, confirmation_code, start_time, reminder_scheduled }
├─ Validation: Check availability, buffer times, patient consent
└─ Side Effect: Schedule reminders

PUT /api/v1/appointments/{id}
├─ Body: { start_time, doctor_id, status }
├─ Response: { appointment_id, updated_fields }
├─ Validation: Only allow status transitions
└─ Side Effect: Update reminders if time changed

DELETE /api/v1/appointments/{id}
├─ Query: ?reason=cancellation_reason&notify=true
├─ Response: { message: "Cancelled", confirmation_sent }
├─ Side Effect: Release time slot, send notifications
└─ Audit: Log cancellation reason and timestamp

GET /api/v1/doctors/{id}/availability
├─ Query: ?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD&duration=30
├─ Response: { available_slots: [{ start_time, end_time, type }] }
├─ Calculation: Check doctor working hours, existing appointments, buffer
└─ Cache: 5-second TTL in Redis
```

#### 2.2.3 Notification Endpoints

```
POST /api/v1/notifications
├─ Body: { patient_id, type: (sms|email|call), message, scheduled_time }
├─ Response: { notification_id, status, delivery_time }
├─ Queue: Add to Celery for async processing
└─ Audit: Log all PHI in this call

GET /api/v1/notifications/{id}
├─ Response: { id, patient_id, type, message, status, delivered_at }
├─ Authorization: Patient (self) or Admin
└─ Audit: Log this PHI access

GET /api/v1/notifications/delivery-status
├─ Query: ?appointment_id=X
├─ Response: { reminders: [{ id, type, status, delivered_at }] }
└─ Use: Clinic dashboard view
```

#### 2.2.4 Voice Agent Webhook Endpoints

```
POST /api/v1/webhooks/twilio/call-status
├─ Body: { CallSid, CallStatus, From, To, Timestamp, Duration }
├─ Response: { status: "received" }
├─ Process: Validate signature, update call records, trigger side effects
└─ Audit: Log all call metadata

POST /api/v1/webhooks/assemblyai/transcript
├─ Body: { request_id, status, transcript, confidence }
├─ Response: { status: "processed" }
├─ Store: In database with patient_id reference
└─ Audit: Log transcript access

POST /api/v1/webhooks/twilio/sms-status
├─ Body: { MessageSid, MessageStatus, To, ErrorCode }
├─ Response: { status: "acknowledged" }
├─ Update: Notification delivery status
└─ Retry: On failure, schedule retry
```

#### 2.2.5 Webhook Signature Verification

```python
# All webhook endpoints MUST validate signature
def verify_twilio_signature(request_body, signature, auth_token):
    """
    Prevent unauthorized webhook calls
    - Use HMAC-SHA1 for signature generation
    - Compare constant-time to prevent timing attacks
    - Log all signature failures for security audit
    """
```

### 2.3 Database Schema

#### 2.3.1 Core Tables

```sql
-- Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    
    -- Medical Information
    medical_history TEXT, -- Encrypted
    allergies TEXT, -- Encrypted
    medications JSONB, -- Encrypted
    emergency_contact VARCHAR(255), -- Encrypted
    
    -- Communication Preferences
    preferred_contact_method VARCHAR(20) DEFAULT 'sms', -- sms, email, call
    sms_consent BOOLEAN DEFAULT TRUE,
    email_consent BOOLEAN DEFAULT TRUE,
    call_consent BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    -- Encryption
    encrypted_fields JSONB, -- Track which fields are encrypted
    
    INDEX idx_email (email),
    INDEX idx_phone (phone_number),
    CONSTRAINT valid_dob CHECK (date_of_birth < CURRENT_DATE - INTERVAL '18 years')
);

-- Doctors Table
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    license_number VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    
    -- Availability
    working_hours JSONB NOT NULL DEFAULT '{
        "monday": {"start": "09:00", "end": "17:00"},
        "tuesday": {"start": "09:00", "end": "17:00"},
        ...
    }',
    buffer_time_minutes INT DEFAULT 15,
    appointment_duration_minutes INT DEFAULT 30,
    max_patients_per_day INT DEFAULT 20,
    
    -- Location
    clinic_id UUID REFERENCES clinics(id),
    office_location VARCHAR(500),
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_specialization (specialization),
    INDEX idx_clinic (clinic_id),
    INDEX idx_license (license_number)
);

-- Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    
    -- Core Details
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, confirmed, completed, cancelled, no_show
    appointment_type VARCHAR(50) DEFAULT 'general', -- general, follow_up, consultation
    
    -- Reason & Notes
    reason_for_visit TEXT,
    notes TEXT,
    
    -- Status Tracking
    confirmed_by_patient BOOLEAN DEFAULT FALSE,
    confirmed_by_doctor BOOLEAN DEFAULT FALSE,
    last_reminder_sent_at TIMESTAMP,
    no_show_recorded_at TIMESTAMP,
    
    -- Cancellation Info
    cancelled_at TIMESTAMP,
    cancellation_reason VARCHAR(255),
    cancellation_initiator VARCHAR(20), -- patient, doctor, system
    
    -- Telemedicine
    is_virtual BOOLEAN DEFAULT FALSE,
    video_call_link VARCHAR(500),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    UNIQUE(doctor_id, start_time),
    CHECK (end_time > start_time),
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_start_time (start_time),
    INDEX idx_status (status)
);

-- Voice Call Records Table
CREATE TABLE voice_call_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Call Details
    call_sid VARCHAR(255) NOT NULL UNIQUE, -- Twilio CallSid
    call_type VARCHAR(20), -- inbound, outbound
    phone_number VARCHAR(20) NOT NULL,
    
    -- Recording & Transcription
    recording_url VARCHAR(500), -- Encrypted S3 URL
    transcript TEXT, -- Encrypted
    transcription_confidence DECIMAL(3, 2),
    
    -- Intent & Outcome
    detected_intent VARCHAR(50), -- booking, rescheduling, cancellation, confirmation
    conversation_outcome VARCHAR(50), -- success, partial, failed, escalated
    
    -- Timing
    call_started_at TIMESTAMP,
    call_ended_at TIMESTAMP,
    call_duration_seconds INT,
    
    -- Metadata
    livekit_session_id VARCHAR(255),
    ai_model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_call_sid (call_sid),
    INDEX idx_call_started_at (call_started_at)
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Notification Details
    type VARCHAR(20) NOT NULL, -- sms, email, call
    channel VARCHAR(50), -- twilio_sms, sendgrid_email, twilio_call
    recipient_address VARCHAR(255) NOT NULL, -- phone or email
    
    -- Message
    message_template VARCHAR(255),
    message_body TEXT,
    
    -- Scheduling & Status
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, sent, delivered, failed, bounced
    delivery_attempts INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    
    -- Failure Info
    failure_reason VARCHAR(500),
    last_error_code VARCHAR(50),
    
    -- Tracking
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_for (scheduled_for)
);

-- Audit Log Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL, -- create_appointment, access_patient_data, etc.
    resource_type VARCHAR(50), -- appointment, patient, doctor, etc.
    resource_id UUID,
    
    -- Who & When
    user_id UUID REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- What Changed
    old_values JSONB,
    new_values JSONB,
    
    -- Security
    ip_address INET,
    user_agent VARCHAR(500),
    
    -- PHI Flag
    contains_phi BOOLEAN DEFAULT TRUE,
    
    INDEX idx_performed_at (performed_at),
    INDEX idx_user_id (user_id),
    INDEX idx_resource_id (resource_id),
    INDEX idx_action (action)
);
```

### 2.4 Real-Time Availability Algorithm

```python
class AvailabilityEngine:
    """
    Calculates available appointment slots in real-time
    Prevents double-bookings using database transactions
    """
    
    async def get_available_slots(
        self,
        doctor_id: UUID,
        date_from: date,
        date_to: date,
        duration_minutes: int = 30,
        use_cache: bool = True
    ) -> List[TimeSlot]:
        """
        Algorithm:
        1. Get doctor's working hours for date range
        2. Fetch all existing appointments (EXCLUSIVE LOCK)
        3. Calculate buffer times between appointments
        4. Remove booked and buffer slots
        5. Return remaining slots
        6. Cache result for 5 seconds (Redis)
        """
        
        # Check cache first
        cache_key = f"availability:{doctor_id}:{date_from}:{date_to}"
        if use_cache and (cached := await redis.get(cache_key)):
            return json.loads(cached)
        
        async with db.transaction():
            # Lock doctor record to prevent concurrent updates
            doctor = await db.fetch(
                "SELECT * FROM doctors WHERE id = $1 FOR UPDATE",
                doctor_id
            )
            
            # Fetch all appointments with row-level lock
            appointments = await db.fetch(
                """SELECT * FROM appointments 
                   WHERE doctor_id = $1 
                   AND start_time >= $2 
                   AND start_time < $3 
                   AND status != 'cancelled'
                   FOR UPDATE""",
                doctor_id, date_from, date_to
            )
        
        # Calculate available slots
        available_slots = []
        working_days = self._get_working_days(doctor, date_from, date_to)
        
        for day in working_days:
            day_slots = self._calculate_day_slots(
                day,
                doctor.working_hours,
                appointments,
                duration_minutes,
                doctor.buffer_time_minutes
            )
            available_slots.extend(day_slots)
        
        # Cache for 5 seconds
        await redis.setex(
            cache_key,
            5,
            json.dumps([s.model_dump_json() for s in available_slots])
        )
        
        return available_slots

    def _calculate_day_slots(
        self,
        day: date,
        working_hours: dict,
        appointments: List[Appointment],
        duration: int,
        buffer: int
    ) -> List[TimeSlot]:
        """
        1. Start from working hours start
        2. For each 30-min interval, check if available
        3. Skip appointments + buffer times
        4. Return available slots
        """
        # Example: 09:00-17:00 with 30-min appointments and 15-min buffer
        # Result: 09:00, 09:45, 10:30, 11:15, ..., 16:30
        
        day_name = day.strftime("%A").lower()
        hours = working_hours.get(day_name)
        if not hours:
            return []
        
        start_time = datetime.combine(day, datetime.strptime(hours["start"], "%H:%M").time())
        end_time = datetime.combine(day, datetime.strptime(hours["end"], "%H:%M").time())
        
        booked_times = self._get_booked_and_buffer_times(appointments, buffer, day)
        
        slots = []
        current = start_time
        while current + timedelta(minutes=duration) <= end_time:
            if not any(booked_start <= current < booked_end 
                      for booked_start, booked_end in booked_times):
                slots.append(TimeSlot(start=current, end=current + timedelta(minutes=duration)))
            current += timedelta(minutes=15)  # 15-min intervals for flexibility
        
        return slots
```

### 2.5 API Rate Limiting

```
Rate Limits (Per User):
- Authentication endpoints: 5 requests/minute (prevent brute force)
- Appointment endpoints: 100 requests/minute (normal usage)
- Webhook endpoints: Unlimited (from verified sources only)
- Availability check: 500 requests/minute (real-time updates)

Implementation:
- Use Redis for counter storage
- Fixed window counters (simpler than sliding window)
- Return 429 Too Many Requests with Retry-After header
- Log rate limit violations for analysis
```

### 2.6 Error Handling

```python
# Standardized Error Response
class ErrorResponse(BaseModel):
    error_code: str  # ERR_APPOINTMENT_CONFLICT, ERR_PATIENT_NOT_FOUND, etc.
    message: str     # User-friendly message
    details: dict    # Additional context (only for developers)
    request_id: str  # For debugging

# HTTP Status Code Mapping
200 - Success
201 - Created
400 - Bad Request (validation failed)
401 - Unauthorized (missing/invalid token)
403 - Forbidden (insufficient permissions)
404 - Not Found
409 - Conflict (double-booking, duplicate patient email)
422 - Unprocessable Entity (semantic error)
429 - Too Many Requests (rate limited)
500 - Internal Server Error
503 - Service Unavailable (database down)
```

---

## 3. FRONTEND REQUIREMENTS

### 3.1 Frontend Technology Stack

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| Framework | React | 18.0+ | Component-based, large ecosystem, performance |
| TypeScript | TypeScript | 5.0+ | Type safety, IDE support, better refactoring |
| UI Framework | Tailwind CSS | 3.0+ | Utility-first, responsive, accessibility |
| State Management | Redux Toolkit | Latest | Predictable state, good DevTools |
| API Client | TanStack Query | 5.0+ | Server state management, caching, sync |
| Routing | React Router | 6.0+ | Modern routing, nested routes |
| Build Tool | Vite | 5.0+ | Fast build, dev server, tree-shaking |
| Testing | Vitest + React Testing Library | Latest | Fast, unit + integration tests |
| Form | React Hook Form + Zod | Latest | Performance, validation, DX |

### 3.2 Frontend Feature Requirements

#### 3.2.1 Patient Portal Features

**Authentication Pages**
- [ ] Sign up (email + password validation)
- [ ] Login with "Forgot Password" option
- [ ] OTP verification (SMS/Email)
- [ ] Multi-factor authentication setup
- [ ] Session management (logout, auto-logout)

**Appointment Management**
- [ ] View all appointments (past + upcoming)
- [ ] Book new appointment
- [ ] Reschedule existing appointment
- [ ] Cancel appointment with reason
- [ ] Appointment details view
- [ ] Export appointment to calendar
- [ ] Download prescription/receipts

**Real-Time Availability**
- [ ] Show doctor availability in real-time
- [ ] Interactive calendar with available slots
- [ ] Doctor filter by specialization/location
- [ ] Search doctors by name
- [ ] Doctor ratings and reviews

**Notifications & Reminders**
- [ ] In-app notification center
- [ ] SMS/Email reminder preferences
- [ ] One-click reschedule from reminder
- [ ] Notification history

**Medical Information**
- [ ] View medical history
- [ ] Upload medical documents (encrypted)
- [ ] Manage allergies and medications
- [ ] Emergency contact management

#### 3.2.2 Doctor Dashboard Features

**Schedule Management**
- [ ] Calendar view (day/week/month)
- [ ] Real-time appointment updates (WebSocket)
- [ ] Bulk reschedule appointments
- [ ] Set vacation/unavailable dates
- [ ] Manage working hours

**Patient Management**
- [ ] View patient list
- [ ] Patient search and filter
- [ ] Access patient medical history
- [ ] View appointment history with patient

**Analytics & Reporting**
- [ ] No-show rate analytics
- [ ] Revenue reports
- [ ] Peak booking times analysis
- [ ] Patient feedback/ratings

#### 3.2.3 Clinic Admin Dashboard

**System Management**
- [ ] Manage doctors (add/edit/remove)
- [ ] Manage clinic information
- [ ] Configure working hours
- [ ] Set appointment duration templates
- [ ] Manage staff (receptionist) accounts

**Appointment Oversight**
- [ ] View all clinic appointments
- [ ] Bulk operations (reschedule, cancel, remind)
- [ ] Manage no-shows
- [ ] Waitlist management

**Reports & Analytics**
- [ ] Revenue reports (daily/monthly/yearly)
- [ ] Performance metrics per doctor
- [ ] Patient acquisition funnel
- [ ] Billing and payments

**HIPAA Compliance**
- [ ] Audit logs viewer
- [ ] Data access reports
- [ ] Compliance checklist
- [ ] Backup and recovery status

### 3.3 Mobile App Requirements (Separate React Native App)

**Core Features**
- [ ] Mobile appointment booking
- [ ] Push notifications
- [ ] Calendar integration
- [ ] Offline mode (sync when online)
- [ ] Biometric authentication
- [ ] Telemedicine video integration

---

## 4. VOICE AGENT REQUIREMENTS

### 4.1 Voice Agent Conversation Flow

```
INBOUND CALL FLOW:

1. Call Established
   ├─ Greeting: "Hello! Thanks for calling [Clinic Name]. 
   │              How can I help you today?"
   └─ Wait: User speech (max 10 seconds)

2. Intent Recognition
   ├─ If "book" / "appointment" → Go to Booking Flow
   ├─ If "cancel" / "reschedule" → Go to Management Flow
   ├─ If "confirm" / "appointment" → Go to Confirmation
   └─ If unclear → Ask: "Could you please clarify?"

3. Booking Flow
   ├─ Ask: "Which doctor or specialty would you prefer?"
   ├─ Show options: "We have Dr. Smith (Cardiologist), 
   │                 Dr. Jones (Pediatrician), etc."
   ├─ Wait: Patient selection
   ├─ Ask: "When would you like to book?"
   ├─ Show options: "Tomorrow at 2 PM, Tuesday at 10 AM, etc."
   ├─ Confirm: "Let me confirm - you want Dr. Smith 
   │             on Tuesday at 10 AM. Is that correct?"
   └─ Booking ID: "Your booking ID is #ABC123. 
                   You'll receive an SMS confirmation."

4. Reschedule Flow
   ├─ Ask: "What's your phone number or appointment ID?"
   ├─ Retrieve: Existing appointments
   ├─ Confirm: Show current appointment details
   ├─ Ask: "When would you like to reschedule?"
   ├─ Show: Available slots
   └─ Confirm: New appointment details

5. Cancellation Flow
   ├─ Confirm: "Are you sure you want to cancel?"
   ├─ Ask: "Can I ask why you're cancelling?"
   ├─ Record: Reason for analytics
   └─ Confirm: "Your appointment has been cancelled."

6. Escalation
   ├─ If: Complex request or patient frustrated
   ├─ Say: "Let me connect you to our receptionist."
   ├─ Action: Transfer to live agent
   └─ Log: Escalation reason for analysis
```

### 4.2 Voice Agent Parameters

```python
agent_session_config = {
    "stt": {
        "provider": "assemblyai",
        "model": "universal-streaming:en",
        "language": "en",
        "enable_speaker_identification": True,
    },
    "llm": {
        "provider": "openai",
        "model": "gpt-4-1106-preview",  # or gpt-4-mini for cost
        "temperature": 0.3,  # Lower = more consistent
        "max_tokens": 500,
        "system_prompt": """You are a friendly healthcare receptionist AI assistant.
        Your role is to help patients book, reschedule, or cancel appointments.
        Follow these guidelines:
        1. Be professional but warm and empathetic
        2. Always confirm details before booking
        3. Never share other patients' information
        4. If unsure, offer to connect to a human agent
        5. Keep responses concise (under 30 seconds of speech)
        6. Offer 2-3 options, not long lists
        """,
    },
    "tts": {
        "provider": "cartesia",
        "model": "sonic-3",
        "voice": "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",  # Female voice
        "speed": 1.0,
        "enable_streaming": True,
    },
    "vad": {
        "provider": "silero",
        "enable": True,
        "min_speech_duration": 0.5,  # seconds
        "max_silence_duration": 2.0,  # seconds
    },
    "conversation": {
        "max_turns": 30,  # Max conversation exchanges
        "turn_timeout": 10,  # seconds of silence = user left
        "preemptive_generation": True,  # Start TTS before user finishes
        "enable_interruptions": True,  # Let user interrupt agent
    }
}
```

### 4.3 Tool/Function Definitions for LLM

```python
# Tools available to the LLM for function calling
tools = [
    {
        "name": "check_availability",
        "description": "Check available appointment slots for a doctor",
        "parameters": {
            "doctor_id": "string (required)",
            "date_from": "string in YYYY-MM-DD format (required)",
            "date_to": "string in YYYY-MM-DD format (required)",
            "duration_minutes": "integer - slot duration in minutes (default: 30)"
        },
        "returns": {
            "available_slots": [
                {"start_time": "ISO 8601 timestamp", "end_time": "ISO 8601 timestamp"}
            ]
        }
    },
    {
        "name": "book_appointment",
        "description": "Create a new appointment",
        "parameters": {
            "patient_id": "string (required - patient phone number)",
            "doctor_id": "string (required)",
            "start_time": "ISO 8601 timestamp (required)",
            "reason_for_visit": "string (optional)",
        },
        "returns": {
            "appointment_id": "string",
            "confirmation_code": "string",
            "start_time": "ISO 8601 timestamp"
        }
    },
    {
        "name": "reschedule_appointment",
        "description": "Reschedule an existing appointment",
        "parameters": {
            "appointment_id": "string (required)",
            "new_start_time": "ISO 8601 timestamp (required)",
        },
        "returns": {
            "appointment_id": "string",
            "old_time": "ISO 8601 timestamp",
            "new_time": "ISO 8601 timestamp"
        }
    },
    {
        "name": "cancel_appointment",
        "description": "Cancel an existing appointment",
        "parameters": {
            "appointment_id": "string (required)",
            "cancellation_reason": "string (optional)",
        },
        "returns": {
            "success": "boolean",
            "message": "string"
        }
    },
    {
        "name": "list_doctors",
        "description": "Get list of doctors by specialization",
        "parameters": {
            "specialization": "string (optional)",
            "clinic_id": "string (optional)"
        },
        "returns": {
            "doctors": [
                {"id": "string", "name": "string", "specialty": "string"}
            ]
        }
    },
    {
        "name": "get_patient_info",
        "description": "Retrieve patient information (limited fields)",
        "parameters": {
            "patient_phone": "string (required)"
        },
        "returns": {
            "patient_id": "string",
            "name": "string",
            "appointments": [list of appointments]
        }
    },
    {
        "name": "transfer_to_agent",
        "description": "Transfer call to human agent",
        "parameters": {
            "reason": "string (optional - reason for transfer)"
        },
        "returns": {
            "success": "boolean",
            "queue_position": "integer"
        }
    }
]
```

---

## 5. SECURITY & COMPLIANCE

### 5.1 HIPAA Compliance Requirements

**Administrative Safeguards**
- [ ] Data protection policy document
- [ ] Risk analysis and mitigation plan
- [ ] Business Associate Agreements (BAA) with all vendors
- [ ] Employee training and awareness program
- [ ] Access controls and authorization policies
- [ ] Incident response plan

**Physical Safeguards**
- [ ] Facility access controls
- [ ] Workstation security
- [ ] Workstation use policy

**Technical Safeguards**
- [ ] Encryption: AES-256 for data at rest, TLS 1.3 for transit
- [ ] Access controls: Authentication (MFA), authorization (RBAC)
- [ ] Audit logs: All PHI access logged with timestamp
- [ ] Integrity controls: Hash values for data integrity verification
- [ ] Transmission security: Encrypted channels only

**Specific Requirements**
- [ ] De-identification: Remove all 18 identifiers for research
- [ ] Breach notification: Notify patients within 60 days if breach
- [ ] Minimum necessary: Limit data access to what's needed
- [ ] Patient rights: Provide access to own records, amendment rights

### 5.2 Data Encryption

```python
# At-Rest Encryption
patient.medical_history = encrypt_aes256(data, key_id="kms-key-1")
patient.medications = encrypt_aes256(data, key_id="kms-key-1")
appointment.notes = encrypt_aes256(data, key_id="kms-key-1")
call_record.transcript = encrypt_aes256(data, key_id="kms-key-1")

# In-Transit Encryption
- All API calls: TLS 1.3 (https://)
- WebSocket connections: Secure WebSocket (wss://)
- Database connections: SSL/TLS required

# Key Management
- Keys stored in AWS KMS / Azure Key Vault
- Automatic key rotation every 90 days
- Audit log for all key accesses
```

### 5.3 Audit Logging

```python
# Every PHI access must be logged
def audit_log_phi_access(
    user_id: UUID,
    action: str,  # "read", "write", "delete", "export"
    resource_type: str,  # "patient", "appointment", etc.
    resource_id: UUID,
    old_values: dict = None,
    new_values: dict = None,
    ip_address: str = None,
    user_agent: str = None
):
    """
    Log PHI access to audit_logs table
    Used for compliance reporting and forensics
    """
    
# Example Audit Entries
audit_log_phi_access(
    user_id=doctor_123,
    action="read",
    resource_type="patient",
    resource_id=patient_456,
    ip_address="192.168.1.1",
    user_agent="Mozilla/5.0..."
)

audit_log_phi_access(
    user_id=admin_789,
    action="write",
    resource_type="appointment",
    resource_id=appt_111,
    old_values={"status": "scheduled"},
    new_values={"status": "confirmed"},
    ip_address="203.0.113.10"
)
```

---

## 6. DEPLOYMENT & INFRASTRUCTURE

### 6.1 Deployment Architecture

```
Production Environment:

Region: US-East-1 (Primary) + US-West-1 (Backup)

┌─────────────────────────────────┐
│ CloudFront (CDN)                │
│ - Static assets                 │
│ - Caching: 24h for JS/CSS       │
└─────────────────────────────────┘
            │
┌─────────────────────────────────┐
│ Load Balancer (ALB)             │
│ - SSL/TLS termination           │
│ - Path-based routing            │
└─────────────────────────────────┘
            │
┌─────────────────────────────────┐
│ ECS Cluster                     │
│ ├─ Backend API (4 instances)    │
│ ├─ Voice Agent (8 instances)    │
│ └─ Task Queue (2 instances)     │
└─────────────────────────────────┘
            │
┌─────────────────────────────────┐
│ Data Layer                      │
│ ├─ RDS PostgreSQL (Multi-AZ)    │
│ ├─ ElastiCache Redis            │
│ └─ S3 (Encrypted)               │
└─────────────────────────────────┘
```

### 6.2 Infrastructure as Code (Terraform)

```terraform
# Key resources for production

resource "aws_ecs_cluster" "main" {
  name = "healthcare-voice-agent"
}

resource "aws_rds_cluster" "postgres" {
  cluster_identifier = "healthcare-db"
  engine = "aurora-postgresql"
  engine_version = "15.2"
  
  # High availability
  multi_az = true
  backup_retention_period = 30
  
  # Security
  storage_encrypted = true
  db_subnet_group_name = aws_db_subnet_group.private.name
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id = "healthcare-cache"
  engine = "redis"
  engine_version = "7.0"
  node_type = "cache.r6g.xlarge"
  num_cache_nodes = 3
  multi_az_enabled = true
}

resource "aws_s3_bucket" "call_recordings" {
  bucket = "healthcare-call-recordings"
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  
  versioning {
    enabled = true
  }
}
```

### 6.3 Monitoring & Observability

```
Metrics to Monitor:

Application:
- API response time (p50, p95, p99)
- Voice call success rate
- Appointment booking rate
- Error rate by endpoint
- Database query performance
- Cache hit rate

Infrastructure:
- CPU utilization
- Memory utilization
- Disk space
- Network I/O
- RDS connections
- Redis memory usage

Business:
- Total appointments booked
- Revenue
- No-show rate
- Customer satisfaction (NPS)
- Agent utilization

Tools:
- Datadog (APM, logs, metrics)
- New Relic (alternative)
- CloudWatch (AWS native)
- PagerDuty (Alerting)
```

---

## 7. TESTING REQUIREMENTS

### 7.1 Test Coverage

```
Backend Unit Tests: ≥80% coverage
├─ Authentication module
├─ Appointment service
├─ Availability engine
├─ Notification service
└─ HIPAA compliance checks

Integration Tests: ≥60% coverage
├─ API endpoint tests
├─ Database transaction tests
├─ Webhook handler tests
└─ External service integrations (mock)

E2E Tests: Critical paths only
├─ Appointment booking flow
├─ Rescheduling flow
├─ Cancellation flow
└─ Voice agent conversation

Performance Tests:
├─ Load testing: 500 concurrent users
├─ Stress testing: 2000 concurrent users
├─ Database query performance
└─ Voice pipeline latency
```

### 7.2 Test Data & Environments

```
Environments:
- Development: Local + docker-compose
- Staging: Mirror production (smaller scale)
- Production: Live environment

Test Data:
- Fake patient data (no real PHI)
- Test clinic accounts
- Test phone numbers (Twilio sandbox)
- Realistic appointment scenarios
```

---

## 8. RELEASE & VERSIONING

```
Versioning: Semantic Versioning (MAJOR.MINOR.PATCH)
- MAJOR: Breaking API changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

Release Schedule:
- Bi-weekly minor releases
- Monthly major releases
- Hot fixes as needed

Deployment Process:
1. Code review (2 approvals required)
2. Automated tests (unit + integration)
3. Staging deployment
4. Manual smoke tests
5. Production canary (10% traffic)
6. Full production rollout
7. Monitoring for 24 hours
```

---

**Document End**
