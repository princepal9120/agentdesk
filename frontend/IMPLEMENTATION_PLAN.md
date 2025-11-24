# MedVoice Scheduler - Frontend Implementation Plan

## Document Control

| **Field** | **Details** |
|-----------|-------------|
| **Project** | MedVoice Scheduler - Frontend Implementation |
| **Version** | 1.0 |
| **Created** | November 25, 2025 |
| **Status** | Ready for Development |

---

## 1. Executive Summary

This document outlines the complete implementation plan for the MedVoice Scheduler frontend dashboard based on the approved PRD. The implementation will follow a phased approach over 8 weeks, delivering a production-ready, mobile-responsive React + TypeScript application.

**Key Technologies:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (State Management)
- TanStack Query (Data Fetching)
- FullCalendar.js (Calendar)
- Recharts (Analytics)
- Socket.io (Real-time)

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MedVoice Frontend                     │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Calendar │ │ AI Calls │ │Analytics │ │ Settings │  │
│  │  Views   │ │ Monitor  │ │Dashboard │ │ & Config │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  State Management Layer (Zustand)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │   Auth   │ │Appointments│ │  UI      │              │
│  │  Store   │ │   Store   │ │ Store    │              │
│  └──────────┘ └──────────┘ └──────────┘              │
├─────────────────────────────────────────────────────────┤
│  Data Layer (TanStack Query + Socket.io)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ REST API │ │WebSocket │ │  Cache   │              │
│  │  Client  │ │  Client  │ │ Manager  │              │
│  └──────────┘ └──────────┘ └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Backend API & WebSocket Server             │
│           https://api.medvoice.com/v1                   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Folder Structure

```
medvoice-frontend/
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Auth route group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/            # Dashboard route group
│   │   │   ├── calendar/
│   │   │   ├── ai-calls/
│   │   │   ├── analytics/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   ├── onboarding/
│   │   └── layout.tsx
│   ├── components/                 # Reusable components
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── calendar/               # Calendar-specific components
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── AppointmentModal.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   └── AppointmentForm.tsx
│   │   ├── ai-calls/               # AI Calls components
│   │   │   ├── CallsTable.tsx
│   │   │   ├── CallDetailDrawer.tsx
│   │   │   └── AudioPlayer.tsx
│   │   ├── analytics/              # Analytics components
│   │   │   ├── MetricCard.tsx
│   │   │   ├── CallVolumeChart.tsx
│   │   │   ├── OutcomePieChart.tsx
│   │   │   └── HeatmapChart.tsx
│   │   ├── settings/               # Settings components
│   │   │   ├── PracticeSettings.tsx
│   │   │   ├── ProviderManagement.tsx
│   │   │   ├── AppointmentTypes.tsx
│   │   │   └── TeamManagement.tsx
│   │   ├── onboarding/             # Onboarding components
│   │   │   ├── OnboardingWizard.tsx
│   │   │   ├── StepIndicator.tsx
│   │   │   └── steps/
│   │   └── shared/                 # Shared components
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Breadcrumbs.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── lib/                        # Utilities & helpers
│   │   ├── api/                    # API client
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── appointments.ts
│   │   │   ├── calls.ts
│   │   │   ├── analytics.ts
│   │   │   └── settings.ts
│   │   ├── websocket/              # WebSocket client
│   │   │   ├── client.ts
│   │   │   └── events.ts
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useAppointments.ts
│   │   │   ├── useCalls.ts
│   │   │   ├── useAnalytics.ts
│   │   │   └── useWebSocket.ts
│   │   ├── utils/                  # Helper functions
│   │   │   ├── date.ts
│   │   │   ├── validation.ts
│   │   │   ├── format.ts
│   │   │   └── constants.ts
│   │   └── schemas/                # Zod validation schemas
│   │       ├── auth.ts
│   │       ├── appointment.ts
│   │       ├── provider.ts
│   │       └── settings.ts
│   ├── stores/                     # Zustand stores
│   │   ├── authStore.ts
│   │   ├── appointmentStore.ts
│   │   ├── uiStore.ts
│   │   └── settingsStore.ts
│   ├── types/                      # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── components.ts
│   └── styles/
│       └── globals.css
├── .env.local                      # Environment variables
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 2.3 Tech Stack Rationale

| **Category** | **Technology** | **Rationale** |
|-------------|---------------|---------------|
| **Framework** | Next.js 16 (App Router) | SSR, built-in routing, optimized performance, great DX |
| **Language** | TypeScript | Type safety, better IDE support, fewer runtime errors |
| **Styling** | Tailwind4 CSS + shadcn/ui | Rapid development, consistent design, highly customizable |
| **State Management** | Zustand | Lightweight (1KB), simple API, less boilerplate than Redux |
| **Data Fetching** | TanStack Query | Caching, auto-refetch, optimistic updates, background sync |
| **Forms** | React Hook Form + Zod | Performance, built-in validation, TypeScript support |
| **Calendar** | FullCalendar.js | Feature-rich, drag-and-drop, multiple views, customizable |
| **Charts** | Recharts | React-native, composable, responsive, good documentation |
| **Real-time** | Socket.io-client | Reliable, auto-reconnect, event-based, widely adopted |
| **Date Handling** | date-fns | Modular, tree-shakeable, simple API, smaller than moment.js |
| **Testing** | Jest + React Testing Library | Industry standard, great React support |
| **E2E Testing** | Playwright | Fast, reliable, cross-browser support |

---

## 3. Detailed Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

#### Week 1: Project Setup & Design System

**Day 1-2: Initial Setup**
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Set up ESLint + Prettier
- [ ] Configure environment variables
- [ ] Set up Git repository and branch strategy

**Day 3-4: Design System Components**
- [ ] Create base UI components (Button, Input, Card, Modal, Toast)
- [ ] Build layout components (Container, Grid, Stack)
- [ ] Implement color system and typography
- [ ] Create loading states and skeletons
- [ ] Build error boundary component

**Day 5: API Client Setup**
- [ ] Configure Axios instance with interceptors
- [ ] Set up TanStack Query
- [ ] Create API client utilities
- [ ] Implement error handling
- [ ] Add request/response logging (dev only)

#### Week 2: Authentication & Routing

**Day 1-2: Authentication UI**
- [ ] Build login page
- [ ] Build signup page
- [ ] Build password reset flow
- [ ] Add form validation with React Hook Form + Zod
- [ ] Implement OAuth (Google) button

**Day 3-4: Auth Logic**
- [ ] Create auth store (Zustand)
- [ ] Implement JWT token management
- [ ] Build auth API client methods
- [ ] Add protected route wrapper
- [ ] Implement auto-logout on token expiry

**Day 5: Navigation & Layout**
- [ ] Create dashboard layout (Sidebar + Navbar)
- [ ] Build navigation menu
- [ ] Implement breadcrumbs
- [ ] Add user profile dropdown
- [ ] Create mobile responsive navigation

**Success Criteria:**
✅ User can sign up, log in, and log out
✅ Protected routes redirect to login
✅ Design system components are reusable and consistent
✅ Mobile navigation works smoothly

---

### Phase 2: Core Calendar (Weeks 3-4)

#### Week 3: Calendar Integration

**Day 1-2: FullCalendar Setup**
- [ ] Install and configure FullCalendar
- [ ] Create CalendarView component
- [ ] Implement week/day/month views
- [ ] Add view toggle buttons
- [ ] Style calendar with custom CSS

**Day 3-4: Appointment Display**
- [ ] Create AppointmentCard component
- [ ] Implement color-coding system (green/blue/yellow/red)
- [ ] Add booking source icons
- [ ] Build appointment detail modal
- [ ] Display patient info (masked phone numbers)

**Day 5: Data Integration**
- [ ] Create appointments API client
- [ ] Build useAppointments hook
- [ ] Fetch and display real appointments
- [ ] Implement loading and error states
- [ ] Add empty state UI

#### Week 4: Appointment Management

**Day 1-2: Add/Edit Appointments**
- [ ] Build AppointmentForm component
- [ ] Add form validation (Zod schema)
- [ ] Implement date/time picker
- [ ] Add provider and type dropdowns
- [ ] Handle form submission

**Day 3: Drag-and-Drop**
- [ ] Implement drag-and-drop handlers
- [ ] Add validation (prevent double-booking)
- [ ] Show warning for tight turnaround times
- [ ] Auto-send SMS notification on reschedule
- [ ] Update calendar optimistically

**Day 4: Filtering & Search**
- [ ] Build filter toolbar
- [ ] Implement provider filter
- [ ] Add appointment type filter
- [ ] Create search by patient name/phone
- [ ] Add date range selector

**Day 5: Real-time Updates**
- [ ] Set up Socket.io client
- [ ] Listen for appointment events
- [ ] Update calendar on WebSocket events
- [ ] Show toast notifications for new appointments
- [ ] Add visual notification badge

**Success Criteria:**
✅ Calendar displays appointments with correct colors
✅ Users can add, edit, reschedule, cancel appointments
✅ Drag-and-drop works without bugs
✅ Real-time updates appear within 3 seconds
✅ Filter and search work correctly

---

### Phase 3: AI Monitor & Analytics (Weeks 5-6)

#### Week 5: AI Calls Monitor

**Day 1-2: Calls Table**
- [ ] Create CallsTable component
- [ ] Implement pagination (25 per page)
- [ ] Add column sorting
- [ ] Display call metadata (timestamp, duration, outcome, sentiment)
- [ ] Style sentiment indicators (emoji + color)

**Day 3-4: Call Details**
- [ ] Build CallDetailDrawer component
- [ ] Display full transcript with speaker labels
- [ ] Create AudioPlayer component
- [ ] Add playback controls (play, pause, seek, speed)
- [ ] Link to appointment (if booked)

**Day 5: Filtering & Export**
- [ ] Add date range filter
- [ ] Implement outcome filter
- [ ] Add sentiment filter
- [ ] Build export to CSV functionality
- [ ] Add flag button with reason dropdown

#### Week 6: Analytics Dashboard

**Day 1-2: Metrics & Charts**
- [ ] Create MetricCard component
- [ ] Build 4 key metrics cards with trends
- [ ] Implement CallVolumeChart (line chart)
- [ ] Create OutcomePieChart
- [ ] Build BookingSourcesChart (bar chart)

**Day 3-4: Advanced Visualizations**
- [ ] Create PeakCallHoursHeatmap
- [ ] Add date range picker
- [ ] Implement chart tooltips
- [ ] Add responsive chart sizing
- [ ] Style charts consistently

**Day 5: Export & Polish**
- [ ] Build PDF export functionality
- [ ] Add auto-refresh (5 minutes)
- [ ] Show last updated timestamp
- [ ] Add loading states for charts
- [ ] Optimize chart performance

**Success Criteria:**
✅ AI calls table loads and displays data correctly
✅ Call transcripts are readable
✅ Audio playback works on all browsers
✅ Charts render with real data
✅ Export generates valid CSV/PDF files
✅ Analytics dashboard is visually appealing

---

### Phase 4: Settings & Polish (Weeks 7-8)

#### Week 7: Settings Pages

**Day 1-2: Practice & Provider Settings**
- [ ] Create tabbed settings layout
- [ ] Build PracticeSettings component
- [ ] Implement logo upload
- [ ] Create ProviderManagement component
- [ ] Add provider schedule editor

**Day 3-4: Configuration**
- [ ] Build AppointmentTypes management
- [ ] Create AI script configuration UI
- [ ] Implement drag-and-drop for script questions
- [ ] Add notification settings
- [ ] Build team management table

**Day 5: Onboarding Wizard**
- [ ] Create OnboardingWizard component
- [ ] Build 4-step progress indicator
- [ ] Implement step 1: Practice details
- [ ] Implement step 2: Provider schedules
- [ ] Implement step 3: Phone number connection
- [ ] Implement step 4: Test call walkthrough
- [ ] Add skip and back buttons

#### Week 8: Polish & Optimization

**Day 1-2: Mobile Responsive**
- [ ] Test all pages on mobile devices
- [ ] Fix responsive issues
- [ ] Optimize touch interactions
- [ ] Test on iOS Safari and Chrome Android
- [ ] Adjust calendar for mobile view

**Day 3: Loading & Error States**
- [ ] Add skeleton loaders for all pages
- [ ] Implement error boundaries
- [ ] Create error fallback UI
- [ ] Add retry mechanisms
- [ ] Improve toast notifications

**Day 4: Performance Optimization**
- [ ] Run Lighthouse audit
- [ ] Optimize bundle size
- [ ] Implement code splitting
- [ ] Add lazy loading for heavy components
- [ ] Optimize images

**Day 5: Testing & Bug Fixes**
- [ ] Write unit tests for critical paths
- [ ] Run E2E tests
- [ ] Fix P0/P1 bugs
- [ ] Conduct accessibility audit
- [ ] Final QA pass

**Success Criteria:**
✅ All settings save successfully
✅ Onboarding completion rate > 80%
✅ Mobile experience is smooth
✅ Lighthouse performance score > 90
✅ No critical bugs in production
✅ 70%+ test coverage

---

## 4. Component Specifications

### 4.1 Core Components

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}
```

#### Input Component
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

#### Modal Component
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}
```

### 4.2 Feature Components

#### AppointmentCard
```typescript
interface AppointmentCardProps {
  appointment: Appointment;
  onClick: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;
}
```

#### CallsTable
```typescript
interface CallsTableProps {
  calls: Call[];
  onRowClick: (call: Call) => void;
  onFlagCall: (callId: string, reason: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

#### MetricCard
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  icon?: React.ReactNode;
}
```

---

## 5. State Management Strategy

### 5.1 Zustand Stores

#### Auth Store
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}
```

#### Appointment Store
```typescript
interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  filters: AppointmentFilters;
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, changes: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  setFilters: (filters: Partial<AppointmentFilters>) => void;
}
```

#### UI Store
```typescript
interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
  toasts: Toast[];
  isLoading: boolean;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
}
```

### 5.2 TanStack Query Keys

```typescript
export const queryKeys = {
  appointments: {
    all: ['appointments'] as const,
    list: (filters: AppointmentFilters) => ['appointments', 'list', filters] as const,
    detail: (id: string) => ['appointments', 'detail', id] as const,
  },
  calls: {
    all: ['calls'] as const,
    list: (filters: CallFilters) => ['calls', 'list', filters] as const,
    detail: (id: string) => ['calls', 'detail', id] as const,
  },
  analytics: {
    metrics: (dateRange: DateRange) => ['analytics', 'metrics', dateRange] as const,
    callVolume: (dateRange: DateRange) => ['analytics', 'call-volume', dateRange] as const,
  },
  settings: {
    practice: ['settings', 'practice'] as const,
    providers: ['settings', 'providers'] as const,
    appointmentTypes: ['settings', 'appointment-types'] as const,
  },
};
```

---

## 6. API Integration Patterns

### 6.1 API Client Structure

```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
      await refreshToken();
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 6.2 Custom Hook Pattern

```typescript
// lib/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/lib/api/appointments';
import { queryKeys } from '@/lib/utils/query-keys';

export function useAppointments(filters: AppointmentFilters) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.appointments.list(filters),
    queryFn: () => appointmentsApi.getAll(filters),
    staleTime: 30_000, // 30 seconds
  });

  const createMutation = useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });

  return {
    appointments: data?.appointments ?? [],
    isLoading,
    error,
    createAppointment: createMutation.mutate,
  };
}
```

---

## 7. WebSocket Integration

### 7.1 WebSocket Client

```typescript
// lib/websocket/client.ts
import { io, Socket } from 'socket.io-client';

class WebSocketClient {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const wsClient = new WebSocketClient();
```

### 7.2 WebSocket Hook

```typescript
// lib/hooks/useWebSocket.ts
import { useEffect } from 'react';
import { wsClient } from '@/lib/websocket/client';
import { useAuthStore } from '@/stores/authStore';

export function useWebSocket() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      wsClient.connect(token);
    }

    return () => {
      wsClient.disconnect();
    };
  }, [token]);

  return wsClient;
}
```

---

## 8. Validation Schemas

### 8.1 Authentication Schemas

```typescript
// lib/schemas/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number'),
  practiceName: z.string().min(2, 'Practice name is required'),
});
```

### 8.2 Appointment Schema

```typescript
// lib/schemas/appointment.ts
import { z } from 'zod';

export const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Patient name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  email: z.string().email().optional(),
  appointmentType: z.string().min(1, 'Appointment type is required'),
  providerId: z.string().min(1, 'Provider is required'),
  date: z.date(),
  time: z.string(),
  notes: z.string().max(500).optional(),
});
```

---

## 9. Environment Variables

```bash
# .env.example

# API Configuration
NEXT_PUBLIC_API_URL=https://api.medvoice.com/v1
NEXT_PUBLIC_WS_URL=wss://api.medvoice.com/ws

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Feature Flags
NEXT_PUBLIC_ENABLE_SMS_FEATURE=false
NEXT_PUBLIC_ENABLE_ANALYTICS_EXPORT=true

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

---

## 10. Testing Strategy

### 10.1 Unit Testing

**Coverage Goals:**
- Utilities: 90%+
- Hooks: 80%+
- Components: 70%+
- Overall: 70%+

**Example Test:**
```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 10.2 E2E Testing

**Priority Scenarios:**
1. Complete onboarding flow
2. Add appointment workflow
3. Reschedule appointment (drag-and-drop)
4. View AI call transcript
5. Export analytics report

**Example E2E Test:**
```typescript
// e2e/appointment.spec.ts
import { test, expect } from '@playwright/test';

test('create appointment flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.goto('/calendar');
  await page.click('button:has-text("Add Appointment")');
  
  await page.fill('[name="patientName"]', 'John Doe');
  await page.fill('[name="phone"]', '1234567890');
  await page.selectOption('[name="appointmentType"]', 'Cleaning');
  
  await page.click('button:has-text("Save Appointment")');
  
  await expect(page.locator('text=John Doe')).toBeVisible();
});
```

---

## 11. Performance Optimization Checklist

### 11.1 Bundle Size Optimization
- [ ] Enable tree-shaking
- [ ] Use dynamic imports for heavy components
- [ ] Lazy load routes
- [ ] Optimize images (WebP, next/image)
- [ ] Remove unused dependencies
- [ ] Use production builds

### 11.2 Runtime Performance
- [ ] Memoize expensive computations (useMemo)
- [ ] Prevent unnecessary re-renders (React.memo)
- [ ] Virtualize long lists (react-window)
- [ ] Debounce search inputs
- [ ] Optimize calendar rendering
- [ ] Use optimistic updates

### 11.3 Network Performance
- [ ] Implement request caching (React Query)
- [ ] Use stale-while-revalidate strategy
- [ ] Batch API requests where possible
- [ ] Compress API responses
- [ ] Use CDN for static assets
- [ ] Enable HTTP/2

---

## 12. Security Checklist

- [ ] HTTPS only (enforce with HSTS)
- [ ] JWT token stored in httpOnly cookies
- [ ] CSRF protection enabled
- [ ] XSS prevention (input sanitization)
- [ ] Content Security Policy headers
- [ ] Rate limiting on API calls
- [ ] No PHI in console logs
- [ ] Secure password requirements
- [ ] Auto-logout after inactivity
- [ ] Session management (max 3 devices)

---

## 13. Deployment Plan

### 13.1 Deployment Checklist

- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Configure staging environment
- [ ] Configure production environment
- [ ] Set up monitoring (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up error tracking
- [ ] Configure CDN (Cloudflare/Vercel)
- [ ] Set up SSL certificates
- [ ] Configure domain and DNS
- [ ] Run final security audit

### 13.2 Deployment Strategy

**Environments:**
1. **Development:** Local development
2. **Staging:** Pre-production testing
3. **Production:** Live environment

**Deployment Process:**
1. Merge to `main` branch
2. Run automated tests
3. Build production bundle
4. Deploy to staging
5. Run smoke tests
6. Deploy to production
7. Monitor for errors

---

## 14. Monitoring & Analytics

### 14.1 Error Monitoring

**Sentry Integration:**
- Frontend errors
- API errors
- Performance monitoring
- User session replay

### 14.2 Usage Analytics

**Track:**
- Page views
- User journeys
- Feature adoption
- Conversion rates
- Performance metrics

### 14.3 Performance Monitoring

**Key Metrics:**
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

---

## 15. Documentation Requirements

### 15.1 Code Documentation

- [ ] Component prop interfaces documented
- [ ] Complex functions have JSDoc comments
- [ ] API client methods documented
- [ ] Custom hooks documented
- [ ] README with setup instructions

### 15.2 User Documentation

- [ ] Onboarding guide
- [ ] Feature tutorials (with screenshots)
- [ ] FAQ section
- [ ] Keyboard shortcuts guide
- [ ] Troubleshooting guide

---

## 16. Launch Criteria

### 16.1 Technical Requirements

✅ All P0 bugs fixed  
✅ Lighthouse score > 90  
✅ Test coverage > 70%  
✅ No console errors in production  
✅ Mobile responsive on iOS/Android  
✅ Cross-browser testing complete  
✅ Security audit passed  
✅ Performance targets met  

### 16.2 Business Requirements

✅ Beta testing with 5 practices complete  
✅ User feedback incorporated  
✅ Onboarding completion rate > 80%  
✅ NPS score > 40  
✅ Feature adoption > 90% for calendar  
✅ Documentation complete  
✅ Support processes in place  

---

## 17. Post-Launch Plan

### 17.1 Week 1 Post-Launch

- [ ] Monitor error rates (target: < 1%)
- [ ] Track user feedback
- [ ] Fix critical bugs within 24 hours
- [ ] Daily performance checks
- [ ] User support responsiveness

### 17.2 Month 1 Post-Launch

- [ ] Analyze user behavior
- [ ] Identify feature gaps
- [ ] Prioritize quick wins
- [ ] Plan v1.1 improvements
- [ ] Conduct user interviews

### 17.3 Success Metrics Review

**Monthly Review:**
- Active users
- Feature adoption rates
- Performance metrics
- Error rates
- User satisfaction (NPS)

---

## 18. Risk Mitigation

| **Risk** | **Mitigation** | **Owner** |
|---------|---------------|-----------|
| Calendar performance with 500+ appointments | Implement virtualization, pagination | Frontend Lead |
| WebSocket disconnections | Auto-reconnect, fallback to polling | Frontend Lead |
| Browser compatibility issues | Comprehensive testing, polyfills | QA Team |
| Scope creep | Weekly scope reviews, feature freeze | Product Manager |
| API response time issues | Aggressive caching, loading states | Backend + Frontend |

---

## 19. Appendix

### 19.1 Keyboard Shortcuts

| **Shortcut** | **Action** |
|-------------|-----------|
| `Cmd/Ctrl + K` | Quick search |
| `Cmd/Ctrl + N` | New appointment |
| `Esc` | Close modal |
| `←` `→` | Navigate calendar weeks |
| `T` | Go to today |

### 19.2 Browser Support Matrix

| **Browser** | **Version** | **Status** |
|------------|------------|-----------|
| Chrome | 90+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| iOS Safari | 14+ | ✅ Fully supported |
| Chrome Android | 90+ | ✅ Fully supported |

### 19.3 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [FullCalendar](https://fullcalendar.io/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

## Document Version Control

**Version:** 1.0  
**Created:** November 25, 2025  
**Status:** Approved for Implementation  
**Next Review:** December 2, 2025

---

**Ready to start implementation? Review and approve this plan before proceeding.** 🚀
