# Product Requirements Document: MedVoice Scheduler Frontend

## Document Control

| **Field** | **Details** |
|-----------|-------------|
| **Product Name** | MedVoice Scheduler - Frontend Dashboard |
| **Version** | MVP 1.0 |
| **Target Release** | 8 weeks from kickoff |
| **Document Owner** | Product Team |
| **Last Updated** | November 25, 2025 |
| **Status** | Draft for Review |

---

## 1. Executive Summary

### 1.1 Product Overview

MedVoice Scheduler is a web-based SaaS dashboard designed for healthcare providers to manage appointments, monitor AI voice agent interactions, configure scheduling rules, and view analytics—all synced in real-time with the Voice AI backend.

**Product Type:** Web-based SaaS dashboard  
**Target Users:** Healthcare staff (dentists, practice managers, receptionists)  
**Core Value Proposition:** Reduce administrative burden by providing a unified interface to manage AI-powered appointment scheduling with real-time visibility and control.

### 1.2 Business Objectives

- **Reduce no-show rates** by 15% through better appointment tracking and automated reminders
- **Save staff time** by automating 80%+ of appointment booking calls
- **Improve patient experience** with faster, 24/7 scheduling availability
- **Provide visibility** into AI agent performance and practice operations

### 1.3 Success Metrics

| **Metric** | **Target (Month 3)** |
|------------|----------------------|
| Dashboard load time | < 2 seconds |
| Mobile responsiveness | 100% functional on iOS/Android |
| User onboarding completion | > 80% |
| Daily active users (staff) | 5-10 per practice |
| Feature adoption (calendar view) | > 90% |
| User satisfaction (NPS) | > 40 |

---

## 2. User Research

### 2.1 Primary Persona: Dr. Sarah Chen

**Role:** Solo Dentist  
**Age:** 38  
**Tech Proficiency:** Moderate  

**Pain Points:**
- Overwhelmed by constant phone interruptions during patient care
- Manually managing paper calendar leads to double-bookings
- Difficulty tracking no-shows and missed appointments
- No visibility into why patients cancel

**Goals:**
- See all appointments at a glance on tablet
- Reduce no-shows through automated reminders
- Spend less time on administrative tasks
- Focus more on patient care

**Usage Pattern:**  
Checks dashboard 3-5 times/day on iPad between patients

**Key Quote:**  
*"I just need to see my day at a glance without getting interrupted every 10 minutes."*

---

### 2.2 Secondary Persona: Maria Rodriguez

**Role:** Front Desk Receptionist  
**Age:** 45  
**Tech Proficiency:** Low to Moderate  

**Pain Points:**
- Juggling phone calls while helping walk-in patients
- Manual reminder calls are time-consuming
- Confusion between AI-handled vs manual appointments
- Double-booking errors when system isn't updated

**Goals:**
- Easy rescheduling interface for patient requests
- Clear visibility into which appointments need follow-up
- Simple tools to handle edge cases AI can't resolve
- Reduce phone call volume

**Usage Pattern:**  
Dashboard open all day on desktop, actively managing exceptions

**Key Quote:**  
*"I need to know immediately if the AI made a mistake so I can fix it before the patient shows up."*

---

### 2.3 Tertiary Persona: Dr. James Park

**Role:** Practice Manager (Multi-location)  
**Age:** 52  
**Tech Proficiency:** High  

**Pain Points:**
- No visibility across 5 clinic locations
- Can't track no-show trends or identify patterns
- Difficult to measure ROI of new systems
- Spreadsheet-based reporting is manual and error-prone

**Goals:**
- Consolidated analytics dashboard across locations
- Track no-show trends and revenue impact
- Export reports for stakeholder presentations
- Data-driven decision making

**Usage Pattern:**  
Weekly review sessions, exports reports for leadership meetings

**Key Quote:**  
*"Show me the numbers—how much time and money are we actually saving?"*

---

## 3. Product Scope

### 3.1 In Scope (MVP)

✅ **Authentication & onboarding**  
✅ **Calendar view with appointment management**  
✅ **AI voice agent call monitoring**  
✅ **Analytics dashboard**  
✅ **Settings & configuration**  
✅ **Real-time updates**  
✅ **Mobile-responsive design**  

### 3.2 Out of Scope (Future Releases)

❌ Patient-facing booking portal  
❌ Billing/payment processing  
❌ Insurance verification  
❌ Telemedicine video calls  
❌ Prescription management  
❌ Multi-language UI (English only for MVP)  
❌ Mobile native apps (web responsive only)  
❌ Advanced reporting (custom report builder)  
❌ EHR deep integration (beyond basic sync)  

---

## 4. Functional Requirements

### 4.1 Authentication & Onboarding

**User Stories:**
- As a new user, I want to sign up with email/password so I can access the dashboard quickly
- As a practice admin, I want to invite team members so they can collaborate
- As a user, I want guided onboarding so I understand core features in < 5 minutes

**Acceptance Criteria:**

✅ **Sign Up / Login**
- Email/password authentication with email verification
- OAuth support (Google) for faster login
- Password strength requirements (min 8 chars, 1 uppercase, 1 number)
- Password reset flow via email

✅ **Role-Based Access Control**
- **Admin:** Full access to all features, settings, and user management
- **Staff:** Access to appointments, AI calls, limited settings
- **View-only:** Read-only access to calendar and analytics

✅ **4-Step Onboarding Wizard**
1. **Practice Details:** Name, specialty, timezone, address
2. **Provider Schedules:** Working hours, lunch breaks, time-off blocks
3. **Connect Phone Number:** Twilio integration setup
4. **Test Call Walkthrough:** Interactive demo of AI booking flow

✅ **Additional Requirements**
- Skip option available for each onboarding step
- Progress indicator (1 of 4, 2 of 4, etc.)
- Option to revisit onboarding later from settings

**UI Components:**
- Login/signup forms with validation
- Onboarding progress stepper
- Practice setup forms
- Phone number verification widget
- Tutorial tooltips

---

### 4.2 Calendar View (Primary Interface)

**User Stories:**
- As staff, I want to see all appointments in a weekly calendar so I can manage the schedule visually
- As a provider, I want to see color-coded appointment types so I can prepare for different procedures
- As staff, I want to click on an appointment to see patient details and call transcripts

**Acceptance Criteria:**

✅ **View Options**
- **Week view** (default): 7-day view with hourly slots
- **Day view:** Single day, detailed hourly breakdown
- **Month view:** Monthly overview with appointment counts per day

✅ **Color Coding System**
- 🟢 **Green:** AI-booked & confirmed
- 🔵 **Blue:** Manually booked
- 🟡 **Yellow:** Pending confirmation
- 🔴 **Red:** Flagged no-show risk (based on patient history)

✅ **Appointment Cards Display**
- Patient name (first name + last initial for privacy)
- Phone number (masked: xxx-xxx-1234)
- Appointment type
- Duration
- Booking source icon (AI voice / Manual / Online)

✅ **Appointment Detail Modal**

Click any appointment to open modal showing:
- Full patient information
- Complete call transcript (if AI-booked)
- Booking timestamp
- Reminder status (sent/pending)
- Edit/Reschedule/Cancel buttons

✅ **Drag-and-Drop Rescheduling**
- Drag appointment to new time slot
- Validation prevents double-booking
- Warning for tight turnaround (< 15 min buffer)
- Auto-send SMS notification on reschedule

✅ **Real-Time Synchronization**
- Updates appear within 3 seconds of AI booking
- Visual notification badge for new appointments
- Toast notifications for changes

✅ **Filtering & Search**
- Filter by: Provider, Appointment type, Booking source, Status
- Search by patient name or phone number
- Date range selector

**UI Components:**
- Full-page calendar grid (FullCalendar.js or React Big Calendar)
- Appointment detail modal
- Filter dropdown toolbar
- View toggle buttons (Day/Week/Month)
- Drag handles with visual feedback

**Wireframe:**

```
┌─────────────────────────────────────────────────────┐
│ [MedVoice Logo]    Today  Week  Month    [Settings] │
├─────────────────────────────────────────────────────┤
│ Filters: [All Providers ▼] [All Types ▼] [Search]  │
├─────────────────────────────────────────────────────┤
│         Mon 25    Tue 26    Wed 27    Thu 28  ...  │
│ 9:00 AM ┌────────┐ ┌────────┐                       │
│         │ 🟢     │ │ 🔵     │                       │
│         │Cleaning│ │New Pt  │                       │
│         │J.Smith │ │M.Jones │                       │
│         └────────┘ └────────┘                       │
│ 10:00AM           ┌────────┐                        │
│                   │ 🟡     │                        │
│                   │Pending │                        │
│                   └────────┘                        │
│                                                     │
│ [+ Add Appointment]                                 │
└─────────────────────────────────────────────────────┘
```

---

### 4.3 Appointment Management

**User Stories:**
- As staff, I want to manually add appointments so I can handle walk-ins or phone calls the AI missed
- As staff, I want to reschedule appointments so I can accommodate patient requests
- As staff, I want to cancel appointments and notify patients automatically

**Acceptance Criteria:**

✅ **Add Appointment**

Form fields:
- Patient information (name, phone, email optional)
- Appointment type (dropdown from pre-configured list)
- Date/time picker (shows only available slots)
- Provider selection
- Notes field (500 char max)

Validations:
- Hard block on double-bookings
- Warning for appointments with < 15 min buffer
- Required fields: name, phone, appointment type, date/time
- Phone number format validation

✅ **Reschedule Flow**
1. Select new date/time from available slots
2. Auto-send SMS notification to patient
3. Log reason (dropdown: Patient request, Provider unavailable, Emergency, Other)
4. Update calendar in real-time

✅ **Cancel Flow**
1. Reason dropdown (required): Patient request, No-show, Practice closure, Other
2. Option to add patient to waitlist
3. Auto-send cancellation SMS confirmation
4. Archive appointment with audit trail

✅ **Bulk Actions**
- Select multiple appointments (checkbox)
- Bulk operations: Confirm all, Cancel all, Export
- Confirmation dialog before bulk changes

**UI Components:**
- Appointment form modal
- Date/time picker with availability overlay
- Bulk action toolbar
- Confirmation dialogs
- Success/error toast notifications

**Wireframe:**

```
┌───────────────────────────────────────┐
│ Add Appointment                [X]    │
├───────────────────────────────────────┤
│ Patient Name *                        │
│ [_______________________________]     │
│                                       │
│ Phone Number *                        │
│ [_______________________________]     │
│                                       │
│ Email (optional)                      │
│ [_______________________________]     │
│                                       │
│ Appointment Type *                    │
│ [Select type ▼]                       │
│                                       │
│ Provider *                            │
│ [Select provider ▼]                   │
│                                       │
│ Date & Time *                         │
│ [📅 Select] [🕐 Select]               │
│                                       │
│ Notes                                 │
│ [_______________________________]     │
│ [_______________________________]     │
│                                       │
│         [Cancel]  [Save Appointment]  │
└───────────────────────────────────────┘
```

---

### 4.4 AI Voice Agent Monitor

**User Stories:**
- As staff, I want to see recent calls handled by AI so I can verify accuracy
- As admin, I want to listen to call recordings so I can improve AI scripts
- As staff, I want to flag problematic calls so the team can review edge cases

**Acceptance Criteria:**

✅ **AI Calls Table View**

Columns:
- **Timestamp:** Date and time of call
- **Patient:** Name/phone (masked)
- **Duration:** Call length (MM:SS)
- **Outcome:** Booked / Rescheduled / Cancelled / Info only / Escalated
- **Sentiment:** Positive 😊 / Neutral 😐 / Negative 😞
- **Transcript Preview:** First 100 characters

✅ **Call Detail Drawer**

Opens on row click, displays:
- Complete call transcript with speaker labels (AI / Patient)
- Audio playback controls (play, pause, seek, speed control)
- Linked appointment (if booking resulted)
- Call metadata (duration, timestamp, phone number)
- Flag button (sends to review queue with reason dropdown)

✅ **Filtering & Search**
- Date range picker (Last 7 days, Last 30 days, Custom range)
- Outcome filter (All, Booked, Escalated, etc.)
- Sentiment filter (All, Positive, Neutral, Negative)
- Search by patient name or phone number

✅ **Export Functionality**
- Export to CSV (last 30 days max)
- Includes all table columns plus full transcript
- Filename format: `medvoice-calls-YYYY-MM-DD.csv`

**UI Components:**
- Data table with pagination (25 per page)
- Call detail slide-in drawer
- Audio player component
- Filter/search toolbar
- Export button

**Wireframe:**

```
┌─────────────────────────────────────────────────────────┐
│ AI Voice Calls                                          │
├─────────────────────────────────────────────────────────┤
│ Filters: [Last 7 days ▼] [All Outcomes ▼] [Search]     │
├─────────┬──────────┬──────────┬──────────┬────────────┤
│ Time    │ Patient  │ Duration │ Outcome  │ Sentiment  │
├─────────┼──────────┼──────────┼──────────┼────────────┤
│ 3:42 PM │ J.Smith  │ 2m 15s   │ Booked   │ 😊 Positive│
│ 2:18 PM │ M.Jones  │ 1m 48s   │ Info     │ 😐 Neutral │
│ 11:05AM │ S.Lee    │ 3m 02s   │ Escalate │ 😞 Negative│
└─────────┴──────────┴──────────┴──────────┴────────────┘
│ Showing 1-25 of 147        [< Previous] [Next >]       │
│ [Export CSV]                                            │
└─────────────────────────────────────────────────────────┘
```

---

### 4.5 Analytics Dashboard

**User Stories:**
- As practice admin, I want to see no-show rates so I can measure ROI of the AI system
- As admin, I want to see call volume trends so I can optimize staffing
- As admin, I want to export reports so I can share with stakeholders

**Acceptance Criteria:**

✅ **Key Metrics Cards**

Top row displays:
1. **Total Appointments This Month:** Count with % change vs last month
2. **AI-Handled Calls:** Percentage of total incoming calls
3. **No-Show Rate:** Current month % with trend indicator
4. **Average Time Saved:** Estimated hours/week (based on avg call duration × volume)

✅ **Charts & Visualizations**

**Call Volume Over Time** (Line Chart)
- X-axis: Last 30 days (daily buckets)
- Y-axis: Number of calls
- Dual lines: Total calls vs AI-handled calls

**Appointment Outcomes** (Pie Chart)
- Slices: Kept / No-show / Cancelled / Rescheduled
- Percentages and counts displayed

**Booking Sources** (Bar Chart)
- Categories: AI Voice / Manual / Online Portal
- Y-axis: Number of appointments

**Peak Call Hours** (Heatmap)
- X-axis: Hour of day (9 AM - 6 PM)
- Y-axis: Day of week (Mon - Fri)
- Color intensity: Call volume

✅ **Date Range Controls**
- Presets: Last 7 days / Last 30 days / Last 90 days
- Custom range picker
- Default: Last 30 days

✅ **Export Functionality**
- Export to PDF report (includes all charts and metrics)
- Filename: `medvoice-analytics-YYYY-MM-DD.pdf`
- Auto-refresh every 5 minutes (with manual refresh button)

**UI Components:**
- Metric cards (4-column grid, responsive)
- Chart.js or Recharts components
- Date range picker dropdown
- Export button with loading state
- Last updated timestamp

**Wireframe:**

```
┌──────────────────────────────────────────────────────┐
│ Analytics                   [Last 30 days ▼] [Export]│
├──────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│ │ 247        │ │ 82%        │ │ 8.5%       │        │
│ │Appointments│ │ AI-handled │ │ No-shows   │        │
│ │ ↑ 12%      │ │ ↑ 5%       │ │ ↓ 3%       │        │
│ └────────────┘ └────────────┘ └────────────┘        │
│                                                      │
│ Call Volume Over Time                                │
│ ┌────────────────────────────────────────────────┐  │
│ │        📈 [Line chart visualization]           │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ Booking Sources          Appointment Outcomes       │
│ ┌─────────────────┐      ┌─────────────────┐       │
│ │📊 [Bar chart]   │      │🥧 [Pie chart]   │       │
│ └─────────────────┘      └─────────────────┘       │
│                                                      │
│ Last updated: 2 minutes ago                          │
└──────────────────────────────────────────────────────┘
```

---

### 4.6 Settings & Configuration

**User Stories:**
- As admin, I want to set practice hours so the AI knows when to book appointments
- As admin, I want to configure appointment types and durations so the AI books correctly
- As admin, I want to customize AI greeting scripts so they match our brand voice

**Acceptance Criteria:**

✅ **Practice Settings Tab**
- Practice name, address, timezone
- Logo upload (appears in dashboard header, max 2MB, PNG/JPG)
- Primary phone number (connected to Twilio)
- Business hours (default schedule)

✅ **Provider Management Tab**
- Add/edit/delete providers
- Provider-specific schedules:
  - Working hours per day (with break times)
  - Block off vacation/time off
  - Default appointment duration
  - Specialties/appointment types they offer

✅ **Appointment Types Tab**
- Add/edit/delete appointment types
- Fields per type:
  - Name (e.g., "New Patient Exam")
  - Default duration (15/30/45/60/90/120 minutes)
  - Enable/disable for AI booking
  - Preparation notes (shown to provider)
  - Buffer time before/after

✅ **AI Script Configuration Tab**
- **Greeting Message:** Text input (max 200 chars)
- **Questions to Ask:** Reorderable list (drag-and-drop)
- **Closing Message:** Text input (max 200 chars)
- **Preview Mode:** Simulates AI conversation flow
- Reset to default button

✅ **Notification Settings Tab**
- SMS reminder timing options:
  - 1 day before
  - 2 hours before
  - Both
  - Custom (specify hours)
- Email notifications for staff:
  - New booking alert
  - Cancellation alert
  - No-show alert
  - Daily summary

✅ **Team Management Tab**
- User table (Name, Email, Role, Status)
- Invite users via email (sends signup link)
- Set roles (Admin / Staff / View-only)
- Deactivate users (soft delete, preserves audit logs)

**UI Components:**
- Tabbed settings panel
- Form inputs with real-time validation
- Drag-and-drop list (for script questions)
- User management table
- Upload widget with preview
- Toggle switches
- Save confirmation toast

---

### 4.7 Patient Communication (Optional - Nice to Have)

**User Stories:**
- As staff, I want to send manual SMS reminders so I can follow up with high-risk no-shows
- As staff, I want to view SMS history with patients so I have context

**Acceptance Criteria:**

✅ **SMS Inbox View** (Per Patient)
- Chat-style interface (similar to WhatsApp/iMessage)
- Message bubbles:
  - Outbound messages (right-aligned, blue)
  - Inbound messages (left-aligned, gray)
  - Automated messages clearly labeled (small "Automated" tag)
- Timestamps on messages

✅ **Send Manual Message**
- Text input box with character counter
- 160 character limit per message (with warning at 140)
- Send button (with confirmation if >1 message will be sent)
- Template quick replies (e.g., "Confirm your appointment", "Call us back")

✅ **Message History**
- All messages stored and searchable
- Filter by date range
- Search within conversation

**UI Components:**
- Chat interface (message bubble components)
- Text input with counter
- Template button menu
- Scroll-to-bottom button for long threads

---

## 5. Technical Requirements

### 5.1 Technology Stack

**Frontend Framework:**
- **Nextjs with React 18+** with **TypeScript** (type safety, better developer experience)

**State Management:**
- **Redux Toolkit** or **Zustand** (lightweight, less boilerplate)
- Recommendation: Zustand for MVP simplicity



**UI Component Library:**
- shadcn/ui + Tailwind CSS (modern, highly customizable, smaller bundle)

**Calendar:**
- FullCalendar.js (more feature-rich, better drag-and-drop)

**Charts:**
- **Recharts** (React-native, composable) or **Chart.js** (widely used)
- Recommendation: Recharts for better React integration

**Form Management:**
- **React Hook Form** + **Zod** (validation)
- Benefits: Performance, built-in validation, TypeScript support

**Date Handling:**
- **date-fns** or **Day.js**
- Recommendation: date-fns (modular, tree-shakeable)

**API Communication:**
- **Axios** or **TanStack Query (React Query)**
- Recommendation: TanStack Query (caching, automatic refetching, better UX)

**Real-Time Updates:**
- **Socket.io-client** or **Server-Sent Events (SSE)**
- Recommendation: Socket.io for bidirectional communication

---

### 5.2 API Integration

**Base URL:** `https://api.medvoice.com/v1`

#### Authentication Endpoints

| **Endpoint** | **Method** | **Purpose** | **Request Body** | **Response** |
|-------------|-----------|-----------|-----------------|-------------|
| `/api/auth/signup` | POST | New user registration | `{ email, password, practiceName }` | `{ token, refreshToken, user }` |
| `/api/auth/login` | POST | User authentication | `{ email, password }` | `{ token, refreshToken, user }` |
| `/api/auth/refresh` | POST | Refresh access token | `{ refreshToken }` | `{ token }` |
| `/api/auth/logout` | POST | Invalidate tokens | `{ refreshToken }` | `{ success: true }` |
| `/api/auth/reset-password` | POST | Password reset request | `{ email }` | `{ message }` |

#### Appointments Endpoints

| **Endpoint** | **Method** | **Purpose** | **Query Params** | **Response** |
|-------------|-----------|-----------|-----------------|-------------|
| `/api/appointments` | GET | Fetch appointments | `?startDate, endDate, providerId, status` | `{ appointments: [] }` |
| `/api/appointments` | POST | Create manual appointment | Body: appointment object | `{ appointment }` |
| `/api/appointments/:id` | GET | Get appointment details | - | `{ appointment }` |
| `/api/appointments/:id` | PUT | Update appointment | Body: updated fields | `{ appointment }` |
| `/api/appointments/:id` | DELETE | Cancel appointment | Body: `{ reason }` | `{ success: true }` |
| `/api/appointments/bulk` | POST | Bulk operations | Body: `{ ids, action }` | `{ results: [] }` |

#### AI Calls Endpoints

| **Endpoint** | **Method** | **Purpose** | **Query Params** | **Response** |
|-------------|-----------|-----------|-----------------|-------------|
| `/api/calls` | GET | Fetch AI call logs | `?startDate, endDate, outcome, sentiment` | `{ calls: [] }` |
| `/api/calls/:id` | GET | Get call details + transcript | - | `{ call, transcript, audioUrl }` |
| `/api/calls/:id/flag` | POST | Flag call for review | Body: `{ reason }` | `{ success: true }` |

#### Analytics Endpoints

| **Endpoint** | **Method** | **Purpose** | **Query Params** | **Response** |
|-------------|-----------|-----------|-----------------|-------------|
| `/api/analytics/metrics` | GET | Dashboard metrics | `?startDate, endDate` | `{ metrics: {} }` |
| `/api/analytics/call-volume` | GET | Call volume time series | `?startDate, endDate, granularity` | `{ data: [] }` |
| `/api/analytics/export` | POST | Export PDF report | Body: `{ startDate, endDate }` | PDF file download |

#### Settings Endpoints

| **Endpoint** | **Method** | **Purpose** | **Request Body** | **Response** |
|-------------|-----------|-----------|-----------------|-------------|
| `/api/settings/practice` | GET | Get practice settings | - | `{ practice }` |
| `/api/settings/practice` | PUT | Update practice settings | Body: updated fields | `{ practice }` |
| `/api/settings/providers` | GET | List providers | - | `{ providers: [] }` |
| `/api/settings/providers` | POST | Add provider | Body: provider object | `{ provider }` |
| `/api/settings/providers/:id` | PUT | Update provider | Body: updated fields | `{ provider }` |
| `/api/settings/providers/:id` | DELETE | Delete provider | - | `{ success: true }` |
| `/api/settings/appointment-types` | GET | List appointment types | - | `{ types: [] }` |
| `/api/settings/appointment-types` | POST | Add appointment type | Body: type object | `{ type }` |
| `/api/settings/appointment-types/:id` | PUT | Update appointment type | Body: updated fields | `{ type }` |
| `/api/settings/appointment-types/:id` | DELETE | Delete appointment type | - | `{ success: true }` |

#### Notifications Endpoint

| **Endpoint** | **Method** | **Purpose** | **Request Body** | **Response** |
|-------------|-----------|-----------|-----------------|-------------|
| `/api/notifications/sms` | POST | Send manual SMS | `{ patientId, message }` | `{ success: true, messageId }` |

---

### 5.3 Real-Time WebSocket Events

**Connection URL:** `wss://api.medvoice.com/ws`

**Authentication:** Send JWT token in connection headers

**Events to Listen For:**

| **Event Name** | **Payload** | **Action** |
|---------------|-----------|-----------|
| `appointment:created` | `{ appointment }` | Add to calendar, show toast notification |
| `appointment:updated` | `{ appointmentId, changes }` | Update calendar item |
| `appointment:cancelled` | `{ appointmentId, reason }` | Remove from calendar, show notification |
| `call:incoming` | `{ callId, patientPhone }` | Show live call notification badge |
| `call:completed` | `{ call }` | Add to AI calls list |

---

### 5.4 Performance Requirements

| **Metric** | **Target** | **Measurement Method** |
|-----------|-----------|----------------------|
| Initial page load | < 2 seconds | Lighthouse Performance score > 90 |
| Time to Interactive (TTI) | < 3 seconds | Lighthouse TTI metric |
| API response time | < 500ms (p95) | Monitor with Sentry/Datadog |
| Calendar render | < 1 second | Render 100 appointments |
| Real-time update latency | < 3 seconds | WebSocket message → UI update |
| Bundle size | < 500KB gzipped | Webpack Bundle Analyzer |

**Optimization Strategies:**
- Code splitting by route
- Lazy loading for modals and heavy components
- Image optimization (WebP format, lazy loading)
- API response caching with React Query
- Debounced search inputs
- Virtualized lists for large datasets

---

### 5.5 Security Requirements

✅ **Transport Security**
- HTTPS only (enforce with HSTS headers)
- TLS 1.2+ required

✅ **Authentication**
- JWT access tokens (15-minute expiry)
- Refresh tokens (7-day expiry)
- Secure HttpOnly cookies for refresh tokens
- Account lockout after 5 failed login attempts

✅ **Authorization**
- Role-based access control (RBAC) enforced on frontend and backend
- Route guards for protected pages
- Component-level permission checks

✅ **Data Protection**
- Input sanitization (prevent XSS attacks)
- CSRF protection with tokens
- Content Security Policy (CSP) headers
- No PHI in browser console logs (HIPAA compliance)

✅ **API Security**
- Rate limiting (100 requests/minute per user)
- Request validation with Zod schemas
- API keys stored in environment variables (never committed)

✅ **Session Management**
- Auto-logout after 30 minutes of inactivity
- Concurrent session limits (max 3 devices)

---

### 5.6 Browser & Device Support

**Desktop Browsers:**
- Chrome 90+ ✅ (Primary)
- Safari 14+ ✅
- Firefox 88+ ✅
- Edge 90+ ✅

**Mobile Browsers:**
- iOS Safari 14+ ✅
- Chrome Android 90+ ✅

**Screen Sizes:**
- Desktop: 1024px - 1920px
- Tablet: 768px - 1024px
- Mobile: 320px - 768px

**Responsive Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 6. Design System

### 6.1 Color Palette

**Primary Colors:**
- **Primary Blue:** `#2563eb` - Trust, healthcare, primary actions
- **Success Green:** `#10b981` - Confirmed appointments, success states
- **Warning Yellow:** `#f59e0b` - Pending actions, caution
- **Error Red:** `#ef4444` - No-show risk, errors, critical alerts
- **Neutral Gray:** `#64748b` - Text, borders, disabled states

**Background Colors:**
- **Background:** `#f8fafc` - Light gray page background
- **Surface:** `#ffffff` - White cards, modals, elevated surfaces

**Text Colors:**
- **Primary Text:** `#1e293b` - Headings, primary content
- **Secondary Text:** `#64748b` - Supporting text, labels
- **Muted Text:** `#94a3b8` - Timestamps, metadata

---

### 6.2 Typography

**Font Family:**
- **Headings & Body:** Inter or SF Pro (system font fallback)
- **Monospace:** JetBrains Mono (phone numbers, IDs, code)

**Font Sizes:**
- **Display:** 32px (h1 titles)
- **Heading 1:** 24px (page titles)
- **Heading 2:** 20px (section titles)
- **Heading 3:** 18px (card titles)
- **Body:** 16px (default text)
- **Small:** 14px (labels, captions)
- **Tiny:** 12px (metadata, timestamps)

**Font Weights:**
- **Regular:** 400 (body text)
- **Medium:** 500 (labels, emphasis)
- **Semibold:** 600 (headings, buttons)
- **Bold:** 700 (strong emphasis)

---

### 6.3 Spacing System

**Base Unit:** 4px

**Scale:**
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

**Common Uses:**
- Padding inside cards: 16px (md)
- Margin between sections: 24px (lg)
- Gap in button groups: 8px (sm)

---

### 6.4 Components

**Buttons:**
- **Primary:** Blue background, white text, used for main actions
- **Secondary:** Gray background, dark text, used for secondary actions
- **Outline:** Transparent with border, used for tertiary actions
- **Sizes:** Small (32px), Medium (40px), Large (48px)
- **Border Radius:** 6px
- **Hover States:** Darken by 10%

**Input Fields:**
- **Height:** 40px (medium), 48px (large)
- **Border:** 1px solid `#cbd5e1`
- **Border Radius:** 6px
- **Focus State:** Blue border + subtle shadow
- **Error State:** Red border + error message below

**Cards:**
- **Background:** White
- **Border:** 1px solid `#e2e8f0`
- **Border Radius:** 8px
- **Shadow:** Subtle (`0 1px 3px rgba(0,0,0,0.1)`)
- **Hover:** Slight shadow increase

**Modals:**
- **Overlay:** Semi-transparent black (`rgba(0,0,0,0.5)`)
- **Content:** White card, centered, max-width 600px
- **Border Radius:** 12px
- **Animation:** Fade in + slide up

---

### 6.5 Iconography

**Icon Library:** Heroicons (outline style for UI, solid style for emphasis)

**Common Icons:**
- Calendar: `CalendarIcon`
- Phone: `PhoneIcon`
- User: `UserIcon`
- Settings: `CogIcon`
- Plus: `PlusIcon`
- Edit: `PencilIcon`
- Delete: `TrashIcon`
- Filter: `FunnelIcon`
- Search: `MagnifyingGlassIcon`

**Icon Sizes:**
- Small: 16px
- Medium: 20px
- Large: 24px

---

## 7. Development Plan

### 7.1 Phase 1: Foundation (Weeks 1-2)

**Deliverables:**
- ✅ Project setup (React + TypeScript + Tailwind + Vite)
- ✅ Folder structure and code organization
- ✅ Design system components (Button, Input, Card, Modal)
- ✅ Authentication UI (login/signup forms)
- ✅ API integration layer (Axios + React Query setup)
- ✅ Basic routing structure (React Router)
- ✅ Environment configuration (dev/staging/production)

**Key Tasks:**
- Initialize React project with TypeScript template
- Install and configure Tailwind CSS + shadcn/ui
- Set up ESLint + Prettier
- Create reusable component library
- Build authentication flows (login, signup, password reset)
- Implement JWT token management
- Set up API client with interceptors

**Success Criteria:**
- User can sign up and log in successfully
- Design system components render consistently
- API calls work with proper authentication

---

### 7.2 Phase 2: Core Calendar (Weeks 3-4)

**Deliverables:**
- ✅ Calendar integration (FullCalendar.js)
- ✅ Appointment list API integration
- ✅ Color-coded appointment cards
- ✅ Appointment detail modal
- ✅ Add/Edit appointment forms with validation
- ✅ Drag-and-drop rescheduling
- ✅ Real-time updates (WebSocket integration)
- ✅ Filter and search functionality

**Key Tasks:**
- Integrate FullCalendar library
- Build appointment card component
- Create appointment detail modal
- Implement add/edit forms with React Hook Form + Zod
- Connect WebSocket for real-time updates
- Add drag-and-drop handlers
- Build filter/search UI

**Success Criteria:**
- Calendar displays appointments correctly
- Users can add, edit, reschedule, cancel appointments
- Real-time updates appear within 3 seconds
- Drag-and-drop works without bugs

---

### 7.3 Phase 3: AI Monitor & Analytics (Weeks 5-6)

**Deliverables:**
- ✅ AI Calls table view with pagination
- ✅ Call detail drawer with transcript
- ✅ Audio playback component
- ✅ Analytics dashboard with 4 key metrics
- ✅ Charts (line, bar, pie, heatmap)
- ✅ Date range filtering
- ✅ Export to CSV and PDF

**Key Tasks:**
- Build data table component with sorting/filtering
- Create call detail slide-in drawer
- Integrate audio player (HTML5 audio)
- Build analytics dashboard layout
- Integrate Recharts for visualizations
- Implement date range picker
- Build export functionality (CSV/PDF generation)

**Success Criteria:**
- AI calls table loads and displays data correctly
- Call transcripts are readable and accurate
- Audio playback works on all supported browsers
- Charts render with real data
- Export generates valid CSV/PDF files

---

### 7.4 Phase 4: Settings & Polish (Weeks 7-8)

**Deliverables:**
- ✅ Settings pages (practice, providers, appointment types, AI script)
- ✅ Team management (invite users, roles)
- ✅ Onboarding wizard (4 steps)
- ✅ Mobile responsive adjustments
- ✅ Loading states & error handling
- ✅ Toast notifications
- ✅ User testing & bug fixes
- ✅ Performance optimization

**Key Tasks:**
- Build all settings pages with forms
- Create team management table and invite flow
- Build onboarding wizard with progress stepper
- Test and fix mobile responsive issues
- Add loading skeletons and error boundaries
- Implement toast notification system
- Conduct user acceptance testing (5 beta practices)
- Fix P0/P1 bugs
- Optimize bundle size and performance

**Success Criteria:**
- All settings save successfully
- Users can invite team members
- Onboarding completion rate > 80%
- Mobile experience is smooth on iOS/Android
- No critical bugs in production
- Lighthouse performance score > 90

---

### 7.5 Testing Strategy

**Unit Testing:**
- Framework: Jest + React Testing Library
- Coverage target: 70%+ for critical paths
- Focus on: Form validation, API integration, state management

**Integration Testing:**
- Framework: Cypress or Playwright
- Test scenarios:
  - Complete onboarding flow
  - Add/edit/delete appointment
  - AI call monitoring workflow
  - Export functionality

**User Acceptance Testing (UAT):**
- Recruit 5 beta practices
- Provide test accounts and sample data
- Collect feedback via surveys and interviews
- Iterate based on findings

**Performance Testing:**
- Use Lighthouse CI in deployment pipeline
- Load test calendar with 500+ appointments
- Test WebSocket connection stability
- Monitor real user metrics (RUM) with Sentry

---

## 8. Open Questions & Decisions

### 8.1 Resolved Questions

| **Question** | **Decision** | **Rationale** |
|-------------|-------------|-------------|
| EHR sync status indicator? | Background sync, show "Last synced" timestamp in footer | Keeps UI clean, doesn't distract users |
| Multi-location support in MVP? | No - single location only, add in v2 | Reduces complexity, focus on core features |
| White-labeling in MVP? | Logo upload only, full theme in v2 | Balances customization with development speed |
| Offline mode? | No - require internet, show "offline" warning | Reduces complexity, syncing issues |

### 8.2 Outstanding Questions

| **Question** | **Options** | **Decision Deadline** |
|-------------|-----------|---------------------|
| Should we support SMS two-way conversations? | Yes (nice-to-have) / No (v2) | Week 4 |
| Should analytics be exportable to Google Sheets? | Yes / No (PDF only) | Week 5 |
| Should we add a waitlist feature for cancelled appointments? | Yes / No (v2) | Week 6 |
| What's the maximum number of providers per practice? | 5 / 10 / Unlimited | Week 2 |

---

## 9. Success Criteria for MVP Launch

### 9.1 Quantitative Metrics

| **Metric** | **Target** | **Measurement Method** |
|-----------|-----------|----------------------|
| Beta practices onboarded | 5+ | Manual tracking |
| Average page load time | < 2 seconds | Lighthouse CI |
| Critical bugs in production | < 5 | Bug tracking system |
| Onboarding completion rate | > 80% | Analytics tracking |
| User satisfaction (NPS) | > 40 | Post-onboarding survey |
| Feature adoption (calendar) | > 90% | Usage analytics |
| Mobile responsiveness | 100% functional | Manual testing |

### 9.2 Qualitative Feedback

✅ Positive feedback from at least 4 out of 5 beta practices  
✅ Users report time savings vs previous system  
✅ No major usability complaints in UAT  
✅ AI call monitoring provides actionable insights  
✅ Dashboard is easy to navigate without training  

---

## 10. Risks & Mitigation

| **Risk** | **Impact** | **Likelihood** | **Mitigation Strategy** |
|---------|-----------|---------------|------------------------|
| WebSocket connection instability | High | Medium | Implement automatic reconnection, fallback to polling |
| API response time degradation | High | Low | Implement aggressive caching, optimize backend queries |
| Calendar rendering performance with 500+ appointments | Medium | Medium | Use virtualization, lazy loading, pagination |
| Browser compatibility issues | Medium | Low | Comprehensive testing, polyfills for older browsers |
| User onboarding confusion | High | Medium | User testing, improve tooltips, add help documentation |
| Security vulnerability (XSS/CSRF) | Critical | Low | Code review, penetration testing, CSP headers |
| Scope creep beyond MVP | High | High | Strict feature gating, regular scope reviews |

---

## 11. Post-MVP Roadmap (v2 and Beyond)

### v2 Features (3-6 months post-MVP)

- Multi-location support for enterprise practices
- Patient-facing booking portal
- Advanced reporting (custom report builder)
- Mobile native apps (iOS/Android)
- EHR deep integration (Epic, Cerner)
- Full white-labeling (custom colors, fonts, domain)
- Multi-language support (Spanish, Mandarin)
- Telemedicine integration
- Billing/payment processing

### v3 Features (6-12 months)

- AI-powered no-show prediction
- Automated waitlist management
- Group appointment scheduling
- Insurance verification
- Prescription e-prescribing integration
- Advanced analytics (ML-driven insights)

---

## 12. Appendix

### 12.1 Glossary

- **MVP:** Minimum Viable Product - the simplest version with core features
- **AI Voice Agent:** Automated system that handles phone calls and books appointments
- **EHR:** Electronic Health Record - digital version of patient charts
- **HIPAA:** Health Insurance Portability and Accountability Act - US healthcare privacy law
- **JWT:** JSON Web Token - authentication standard
- **RBAC:** Role-Based Access Control - permission system based on user roles
- **NPS:** Net Promoter Score - customer satisfaction metric (-100 to +100)
- **PHI:** Protected Health Information - patient data protected under HIPAA

### 12.2 References

- React Documentation: https://react.dev
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com
- FullCalendar: https://fullcalendar.io
- React Query: https://tanstack.com/query
- HIPAA Compliance Guide: https://www.hhs.gov/hipaa

---

## Document Approval

| **Role** | **Name** | **Signature** | **Date** |
|---------|---------|--------------|---------|
| Product Manager | [Name] | | |
| Engineering Lead | [Name] | | |
| Design Lead | [Name] | | |
| Stakeholder | [Name] | | |

---

**Document Version:** 1.0  
**Last Updated:** November 25, 2025  
**Next Review Date:** December 2, 2025