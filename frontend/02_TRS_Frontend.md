# Frontend Technical Requirements Specification (TRS)
## AI Voice Agent for Doctor Appointment Management System

**Version:** 1.0  
**Last Updated:** December 2024  
**Audience:** Frontend Engineers, React Developers, QA Engineers

---

## 1. TECHNOLOGY STACK & ARCHITECTURE

### 1.1 Frontend Technology Stack

| Layer | Technology | Version | Purpose | Rationale |
|-------|-----------|---------|---------|-----------|
| **Framework** | React | 18.0+ | UI library | Component-based, large ecosystem, performance |
| **Language** | TypeScript | 5.0+ | Type safety | Compile-time error detection, IDE support |
| **Build Tool** | Vite | 5.0+ | Bundler | 10-100x faster than Webpack |
| **Styling** | Tailwind CSS | 3.0+ | Utility-first CSS | Responsive, accessible, performance |
| **State Mgmt** | Redux Toolkit | Latest | Global state | Enterprise-grade, time travel debugging |
| **Server State** | TanStack Query | 5.0+ | API caching | Automatic data fetching, syncing, caching |
| **Routing** | React Router | 6.0+ | Navigation | Modern routing, nested routes, lazy loading |
| **Forms** | React Hook Form | Latest | Form management | Performance, validation, minimal re-renders |
| **Validation** | Zod | Latest | Schema validation | Type-safe, runtime validation |
| **HTTP Client** | Axios | Latest | API calls | Interceptors, timeout, retry logic |
| **Testing** | Vitest + RTL | Latest | Unit/integration tests | Fast, React Testing Library best practices |
| **E2E Testing** | Cypress/Playwright | Latest | End-to-end tests | User-centric, reliable automation |
| **Linting** | ESLint | Latest | Code quality | TypeScript-aware, accessibility checks |
| **Formatting** | Prettier | Latest | Code formatting | Consistent style across project |
| **Icons** | Lucide React | Latest | Icon library | Tree-shakeable, consistent design |
| **UI Components** | Shadcn UI / accernity UI(for animation) | Latest | Accessible components | WCAG 2.1 AA compliant, unstyled |
| **Animation** | Framer Motion/Gsap | Latest | Motion library | Performant, declarative animations |
| **Auth** | JWT + React Context | Custom | Authentication | Secure token management, context persistence |
| **API Documentation** | Swagger/OpenAPI | Latest | API reference | Interactive API docs |
| **Error Tracking** | Sentry | Latest | Error monitoring | Real-time error alerts |
| **Analytics** | Posthog / Mixpanel | Latest | User analytics | Event tracking, funnels, cohorts |
| **Performance** | Lighthouse CI | Latest | Performance monitoring | Automated performance testing |

---

## 2. PROJECT STRUCTURE

### 2.1 Directory Organization

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── assets/
│       ├── icons/
│       ├── images/
│       └── fonts/
│
├── src/
│   ├── index.tsx                    # Entry point
│   ├── main.tsx                     # App root
│   │
│   ├── components/
│   │   ├── common/                  # Reusable UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── Button.styles.ts
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Calendar/
│   │   │   ├── TimeSlot/
│   │   │   └── LoadingSpinner/
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── MainLayout/
│   │   │   ├── AuthLayout/
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Navigation/
│   │   │   └── Footer/
│   │   │
│   │   └── features/                # Feature-specific components
│   │       ├── appointments/
│   │       │   ├── AppointmentCard/
│   │       │   ├── AppointmentList/
│   │       │   ├── BookingFlow/
│   │       │   └── RescheduleModal/
│   │       ├── doctors/
│   │       │   ├── DoctorCard/
│   │       │   ├── DoctorList/
│   │       │   └── DoctorProfile/
│   │       ├── dashboard/
│   │       │   ├── PatientDashboard/
│   │       │   ├── DoctorDashboard/
│   │       │   └── AdminDashboard/
│   │       └── auth/
│   │           ├── LoginForm/
│   │           ├── RegisterForm/
│   │           └── OTPVerification/
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Appointments.tsx
│   │   ├── BookAppointment.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── Dashboard.tsx
│   │   ├── NotFound.tsx
│   │   └── Error.tsx
│   │
│   ├── store/                       # Redux state management
│   │   ├── index.ts                 # Store configuration
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── appointmentSlice.ts
│   │   │   ├── doctorSlice.ts
│   │   │   ├── notificationSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── hooks.ts                 # Custom hooks (useAppDispatch, useAppSelector)
│   │
│   ├── services/
│   │   ├── api.ts                   # Axios instance with interceptors
│   │   ├── auth.ts                  # Authentication APIs
│   │   ├── appointments.ts          # Appointment APIs
│   │   ├── doctors.ts               # Doctor APIs
│   │   ├── notifications.ts         # Notification APIs
│   │   ├── livekit.ts               # LiveKit voice agent integration
│   │   └── localStorage.ts          # Local storage utilities
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useAppointments.ts       # Appointments hook
│   │   ├── useDoctors.ts            # Doctors hook (TanStack Query)
│   │   ├── useForm.ts               # Form handling
│   │   ├── useMediaQuery.ts         # Responsive design
│   │   ├── useDebounce.ts           # Debounce hook
│   │   ├── useLocalStorage.ts       # LocalStorage hook
│   │   └── useNotification.ts       # Toast notifications
│   │
│   ├── utils/
│   │   ├── constants.ts             # App constants
│   │   ├── validation.ts            # Form validation rules
│   │   ├── formatters.ts            # Format dates, phones, etc.
│   │   ├── api-errors.ts            # Error handling utilities
│   │   ├── auth-utils.ts            # JWT token management
│   │   ├── appointment-utils.ts     # Appointment logic
│   │   ├── socket.ts                # WebSocket utilities
│   │   └── analytics.ts             # Analytics helpers
│   │
│   ├── types/
│   │   ├── index.ts                 # Type exports
│   │   ├── api.ts                   # API response types
│   │   ├── entities.ts              # Domain entities (Patient, Doctor, Appointment)
│   │   ├── forms.ts                 # Form types
│   │   └── auth.ts                  # Authentication types
│   │
│   ├── config/
│   │   ├── api.config.ts            # API configuration
│   │   ├── livekit.config.ts        # LiveKit configuration
│   │   ├── toast.config.ts          # Toast/notification config
│   │   └── env.ts                   # Environment variables
│   │
│   ├── styles/
│   │   ├── globals.css              # Global styles
│   │   ├── tailwind.css             # Tailwind directives
│   │   ├── animations.css           # Animation keyframes
│   │   └── accessibility.css        # Accessibility utilities
│   │
│   ├── context/
│   │   ├── AuthContext.tsx          # Auth context (JWT, user)
│   │   ├── ThemeContext.tsx         # Theme context (light/dark)
│   │   └── SocketContext.tsx        # WebSocket context
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       # Auth middleware for routes
│   │   └── error.middleware.ts      # Error handling middleware
│   │
│   ├── App.tsx                      # Root component
│   └── index.css                    # Global styles
│
├── tests/
│   ├── unit/                        # Unit tests
│   │   ├── utils.test.ts
│   │   └── hooks.test.ts
│   ├── integration/                 # Integration tests
│   │   ├── auth.integration.test.ts
│   │   └── appointments.integration.test.ts
│   └── fixtures/                    # Test data
│       ├── mockData.ts
│       └── mockHandlers.ts
│
├── .env.example                     # Environment variables template
├── .eslintrc.cjs                    # ESLint config
├── .prettierrc                      # Prettier config
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite config
├── vitest.config.ts                 # Vitest config
├── package.json
└── README.md
```

---

## 3. STATE MANAGEMENT

### 3.1 Redux Toolkit Architecture

```typescript
// Store Structure
store/
├── slices/
│   ├── authSlice.ts
│   │   ├── State: { user, token, isAuthenticated, loading, error }
│   │   ├── Reducers: login, logout, setUser, setToken
│   │   └── Thunks: loginUser, registerUser, refreshToken
│   │
│   ├── appointmentSlice.ts
│   │   ├── State: { appointments[], selectedAppointment, loading, error }
│   │   ├── Reducers: addAppointment, updateAppointment, deleteAppointment
│   │   └── Thunks: fetchAppointments, bookAppointment, rescheduleAppointment
│   │
│   ├── doctorSlice.ts
│   │   ├── State: { doctors[], selectedDoctor, filters, loading }
│   │   ├── Reducers: setDoctors, setSelectedDoctor, setFilters
│   │   └── Selectors: selectDoctorsBySpecialty, selectAvailableDoctors
│   │
│   ├── notificationSlice.ts
│   │   ├── State: { notifications[], toastMessages[] }
│   │   ├── Reducers: addNotification, removeNotification
│   │   └── Selectors: selectUnreadNotifications
│   │
│   └── uiSlice.ts
│       ├── State: { sidebarOpen, theme, isMobile, loading }
│       └── Reducers: toggleSidebar, setTheme, setIsMobile

// Actions Pattern
dispatch(loginUser({ email, password }))
dispatch(bookAppointment({ doctorId, startTime, reasonForVisit }))
dispatch(fetchAppointments({ status: 'upcoming' }))
```

### 3.2 Redux Selectors (Memoized)

```typescript
// Prevent unnecessary re-renders
const selectCurrentUser = (state: RootState) => state.auth.user;
const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
const selectUpcomingAppointments = (state: RootState) => 
  state.appointments.appointments.filter(a => a.status === 'confirmed');
const selectDoctorsBySpecialty = (state: RootState, specialty: string) =>
  state.doctors.doctors.filter(d => d.specialization === specialty);

// Combine selectors for complex state
export const selectAppointmentSummary = createSelector(
  [(state) => state.appointments.appointments],
  (appointments) => ({
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
  })
);
```

### 3.3 TanStack Query for Server State

```typescript
// Server State Management (API Data)
const useGetDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await api.get('/doctors');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,      // 5 minutes
    gcTime: 10 * 60 * 1000,        // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Mutations
const useBookAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/appointments', data);
      return response.data;
    },
    onSuccess: (newAppointment) => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      // Update appointments list optimistically
      queryClient.setQueryData(['appointments'], (old) => [...old, newAppointment]);
    },
    onError: (error) => {
      // Handle error
      console.error('Booking failed:', error);
    },
  });
};
```

---

## 4. ROUTING STRUCTURE

### 4.1 React Router Configuration

```typescript
// routes.tsx
const publicRoutes = [
  { path: '/', element: Home },
  { path: '/login', element: Login },
  { path: '/register', element: Register },
  { path: '/forgot-password', element: ForgotPassword },
];

const protectedRoutes = [
  { path: '/dashboard', element: PatientDashboard, role: 'patient' },
  { path: '/appointments', element: Appointments, role: 'patient' },
  { path: '/appointments/book', element: BookAppointment, role: 'patient' },
  { path: '/appointments/:id', element: AppointmentDetail, role: 'patient' },
  { path: '/doctors/:id', element: DoctorProfile, role: 'patient' },
  { path: '/doctor/schedule', element: DoctorSchedule, role: 'doctor' },
  { path: '/admin/dashboard', element: AdminDashboard, role: 'admin' },
  { path: '/admin/doctors', element: ManageDoctors, role: 'admin' },
  { path: '/admin/patients', element: ManagePatients, role: 'admin' },
];

const errorRoutes = [
  { path: '/error', element: Error },
  { path: '*', element: NotFound },
];

// Protected Route Component
<Route element={<ProtectedRoute requiredRole="patient" />}>
  <Route path="/appointments" element={<Appointments />} />
</Route>
```

### 4.2 Lazy Loading Routes

```typescript
// Use React.lazy for code-splitting
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/appointments/book" element={<BookAppointment />} />
  </Routes>
</Suspense>
```

---

## 5. API INTEGRATION

### 5.1 Axios Configuration

```typescript
// services/api.ts
import axios from 'axios';
import { getAuthToken, setAuthToken, clearAuthToken } from '../utils/auth-utils';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        setAuthToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    return Promise.reject(handleApiError(error));
  }
);

export default api;
```

### 5.2 API Service Pattern

```typescript
// services/appointments.ts
export const appointmentService = {
  // GET endpoints
  getAppointments: (filters?: AppointmentFilters) =>
    api.get<Appointment[]>('/appointments', { params: filters }),
  
  getAppointmentById: (id: string) =>
    api.get<Appointment>(`/appointments/${id}`),
  
  checkAvailability: (doctorId: string, dateFrom: string, dateTo: string) =>
    api.get<TimeSlot[]>(`/doctors/${doctorId}/availability`, {
      params: { date_from: dateFrom, date_to: dateTo, duration: 30 },
    }),
  
  // POST endpoints
  bookAppointment: (data: BookAppointmentDTO) =>
    api.post<Appointment>('/appointments', data),
  
  // PUT endpoints
  rescheduleAppointment: (id: string, data: RescheduleDTO) =>
    api.put<Appointment>(`/appointments/${id}`, data),
  
  // DELETE endpoints
  cancelAppointment: (id: string, reason?: string) =>
    api.delete(`/appointments/${id}`, { params: { reason } }),
};

// Usage in components
const { mutate: bookAppointment } = useMutation({
  mutationFn: appointmentService.bookAppointment,
  onSuccess: (data) => showSuccess('Appointment booked!'),
});
```

---

## 6. FORMS & VALIDATION

### 6.1 React Hook Form + Zod

```typescript
// Validation Schema
import { z } from 'zod';

const BookAppointmentSchema = z.object({
  doctorId: z.string().uuid('Invalid doctor'),
  startTime: z.date('Date required'),
  reasonForVisit: z.string().max(500).optional(),
  notifyBySMS: z.boolean().default(true),
  notifyByEmail: z.boolean().default(true),
});

type BookAppointmentForm = z.infer<typeof BookAppointmentSchema>;

// Component with Form
export const BookAppointmentForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<BookAppointmentForm>({
    resolver: zodResolver(BookAppointmentSchema),
    mode: 'onBlur', // Validate on blur
  });

  const { mutate: bookAppointment } = useMutation({
    mutationFn: appointmentService.bookAppointment,
  });

  const onSubmit = (data: BookAppointmentForm) => {
    bookAppointment(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('doctorId')}>
        <option>Select Doctor</option>
        {/* Options */}
      </select>
      {errors.doctorId && <span className="error">{errors.doctorId.message}</span>}
      
      <input type="datetime-local" {...register('startTime')} />
      {errors.startTime && <span className="error">{errors.startTime.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
};
```

---

## 7. AUTHENTICATION & AUTHORIZATION

### 7.1 Auth Flow

```typescript
// context/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('authToken', response.data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
export const ProtectedRoute: React.FC<{ requiredRole?: string }> = ({ requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
```

### 7.2 Token Management

```typescript
// utils/auth-utils.ts
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const refreshAuthToken = async (): Promise<string> => {
  const response = await api.post('/auth/refresh', {
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  });
  
  setAuthToken(response.data.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
  
  return response.data.token;
};
```

---

## 8. RESPONSIVE DESIGN

### 8.1 Tailwind Breakpoints

```typescript
// Breakpoint system
const breakpoints = {
  xs: 320,    // Mobile (phones)
  sm: 640,    // Mobile landscape
  md: 768,    // Tablet
  lg: 1024,   // Desktop
  xl: 1280,   // Large desktop
  '2xl': 1536, // Extra large
};

// Usage in components
<div className="
  w-full md:w-1/2 lg:w-1/3       // Width responsive
  px-4 md:px-6 lg:px-8            // Padding responsive
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  // Grid responsive
  text-base md:text-lg             // Font size responsive
">
  Content
</div>
```

### 8.2 Mobile-First Approach

```typescript
// Custom hook for responsive design
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Usage
const isMobile = useMediaQuery('(max-width: 767px)');
const isTablet = useMediaQuery('(max-width: 1023px)');

{isMobile ? <MobileNav /> : <DesktopNav />}
```

---

## 9. ACCESSIBILITY (WCAG 2.1 AA)

### 9.1 Semantic HTML & ARIA

```typescript
// Proper semantic structure
<main>
  <header role="banner">
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
      </ul>
    </nav>
  </header>
  
  <section aria-labelledby="appointments-heading">
    <h1 id="appointments-heading">My Appointments</h1>
    {/* Content */}
  </section>
</main>

// Accessible form
<form>
  <label htmlFor="email">Email Address:</label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert">{errors.email}</span>
</form>

// Accessible button
<button
  aria-label="Close appointment modal"
  aria-pressed={isPressed}
  onClick={handleClose}
>
  ✕
</button>
```

### 9.2 Keyboard Navigation

```typescript
// Skip to main content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Focus management
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const firstButton = modalRef.current?.querySelector('button');
  firstButton?.focus();
}, [isOpen]);

// Escape key handler
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener('keydown', handleEscape);
  }

  return () => document.removeEventListener('keydown', handleEscape);
}, [isOpen, onClose]);
```

### 9.3 Color Contrast & Readability

```css
/* Ensure 4.5:1 contrast ratio for normal text */
.text-primary {
  color: #1B5E7A;        /* Healthcare Blue */
  background: #F9FAFB;   /* Light background */
  /* Ratio: 7.2:1 (WCAG AAA) ✓ */
}

/* Line height for readability */
body {
  line-height: 1.5;
  letter-spacing: 0.02em;
}

/* Font size minimum */
p, span {
  font-size: 16px; /* Minimum 16px */
}
```

### 9.4 Testing Accessibility

```typescript
// jest.setup.ts - axe-core integration
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// In tests
test('should not have accessibility violations', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 10. PERFORMANCE OPTIMIZATION

### 10.1 Code Splitting & Lazy Loading

```typescript
// Route-based code splitting
const BookAppointment = lazy(() =>
  import('./pages/BookAppointment').then(mod => ({
    default: mod.BookAppointmentPage
  }))
);

// Component lazy loading
const DoctorList = lazy(() => import('./components/DoctorList'));

// Suspense fallback
<Suspense fallback={<Skeleton />}>
  <DoctorList />
</Suspense>
```

### 10.2 Memoization & Optimization

```typescript
// Memoize expensive components
const DoctorCard = memo(({ doctor }: { doctor: Doctor }) => {
  return (
    <div>
      <h3>{doctor.name}</h3>
      <p>{doctor.specialty}</p>
    </div>
  );
});

// Memoize callbacks
const handleBookAppointment = useCallback((doctorId: string) => {
  bookAppointment({ doctorId });
}, [bookAppointment]);

// UseMemo for expensive calculations
const availableSlots = useMemo(() => {
  return calculateAvailableSlots(doctor.schedule, appointments);
}, [doctor.schedule, appointments]);
```

### 10.3 Image Optimization

```typescript
// Responsive images
<picture>
  <source
    srcSet="/doctor-mobile.webp"
    media="(max-width: 640px)"
  />
  <source
    srcSet="/doctor-desktop.webp"
    media="(min-width: 641px)"
  />
  <img src="/doctor.jpg" alt="Dr. Sarah Johnson" loading="lazy" />
</picture>

// Next.js Image component (if using Next.js)
<Image
  src="/doctor.jpg"
  alt="Dr. Sarah Johnson"
  width={200}
  height={200}
  loading="lazy"
  priority={false}
/>
```

### 10.4 Bundle Size Analysis

```bash
# Analyze bundle
npm run build
npm run analyze

# Lighthouse CI
npm run lighthouse

# Performance monitoring
npm run performance-test
```

---

## 11. TESTING STRATEGY

### 11.1 Testing Pyramid

```
                /\
               /  \
              /    \  E2E Tests (5%)
             /______\  Cypress/Playwright
            /\      /\
           /  \    /  \
          /    \  /    \  Integration (15%)
         /______\/______\  RTL + API mocks
        /\              /\
       /  \            /  \
      /    \          /    \  Unit Tests (80%)
     /______\________/______\  Vitest + RTL
    Components  Utils  Hooks
```

### 11.2 Unit Tests

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });
});
```

### 11.3 Integration Tests

```typescript
// tests/integration/auth.integration.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../fixtures/server';
import { LoginPage } from '../../pages/Login';

describe('Authentication Flow', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('completes login flow', async () => {
    const user = userEvent.setup();
    
    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByText(/login/i));
    
    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
  });
});
```

### 11.4 E2E Tests (Cypress)

```typescript
// cypress/e2e/booking.cy.ts
describe('Appointment Booking', () => {
  beforeEach(() => {
    cy.visit('/appointments/book');
    cy.login('patient@example.com', 'password123');
  });

  it('completes appointment booking', () => {
    // Select doctor
    cy.get('[data-testid="doctor-search"]').type('Dr. Johnson');
    cy.get('[data-testid="doctor-option"]').first().click();

    // Select date
    cy.get('[data-testid="date-input"]').click();
    cy.get('[data-testid="date-picker"]').contains('15').click();

    // Select time
    cy.get('[data-testid="time-slot"]').first().click();

    // Confirm booking
    cy.get('[data-testid="confirm-btn"]').click();

    // Verify success
    cy.contains('Appointment confirmed').should('be.visible');
    cy.contains('#APT-').should('be.visible');
  });
});
```

---

## 12. ERROR HANDLING

### 12.1 Global Error Boundary

```typescript
// components/ErrorBoundary.tsx
interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service (Sentry)
    Sentry.captureException(error, { contexts: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 12.2 API Error Handling

```typescript
// utils/api-errors.ts
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export const handleApiError = (error: AxiosError<any>): ApiError => {
  const status = error.response?.status;
  const data = error.response?.data;

  switch (status) {
    case 400:
      return {
        code: 'VALIDATION_ERROR',
        message: data.message || 'Invalid request',
        details: data.errors,
      };
    case 401:
      return {
        code: 'UNAUTHORIZED',
        message: 'Please log in again',
      };
    case 403:
      return {
        code: 'FORBIDDEN',
        message: 'You do not have permission',
      };
    case 404:
      return {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      };
    case 409:
      return {
        code: 'CONFLICT',
        message: 'Appointment slot already booked',
      };
    case 500:
      return {
        code: 'SERVER_ERROR',
        message: 'Server error, please try again later',
      };
    default:
      return {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      };
  }
};

// Usage
try {
  await bookAppointment(data);
} catch (error) {
  const apiError = handleApiError(error as AxiosError);
  showError(apiError.message);
  logError(apiError);
}
```

---

## 13. BUILD & DEPLOYMENT

### 13.1 Build Configuration (Vite)

```typescript
// vite.config.ts
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'ES2020',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui-lib': ['tailwindcss'],
          'state': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

### 13.2 Environment Variables

```bash
# .env.example
VITE_API_URL=http://localhost:8000/api
VITE_LIVEKIT_URL=wss://livekit.example.com
VITE_LIVEKIT_API_KEY=your-api-key
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ANALYTICS_KEY=your-analytics-key
VITE_APP_ENV=development
```

### 13.3 CI/CD Pipeline

```yaml
# .github/workflows/frontend.yml
name: Frontend Build & Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
      
      - name: Run lighthouse
        uses: treosh/lighthouse-ci-action@v8
```

---

## 14. PERFORMANCE METRICS

### 14.1 Core Web Vitals

```typescript
// Measure performance metrics
export const reportWebVitals = () => {
  // Largest Contentful Paint (LCP)
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('LCP:', entry.renderTime || entry.loadTime);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID) / Interaction to Next Paint (INP)
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('INP:', entry.processingDuration);
    }
  }).observe({ entryTypes: ['first-input', 'interaction'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log('CLS:', clsValue);
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
};
```

### 14.2 Performance Targets

| Metric | Target | Weight |
|--------|--------|--------|
| LCP (Largest Contentful Paint) | <2.5s | 25% |
| FID/INP (Interaction) | <100ms | 25% |
| CLS (Layout Shift) | <0.1 | 25% |
| FCP (First Contentful Paint) | <1.8s | 25% |

---

## 15. QUALITY ASSURANCE

### 15.1 Code Quality Checklist

```
✅ Type Safety
  ☐ No 'any' types (except in exceptional cases)
  ☐ All props typed
  ☐ All state typed
  ☐ All function parameters typed

✅ Performance
  ☐ No unnecessary re-renders
  ☐ Memoization where appropriate
  ☐ Bundle size <200KB gzipped
  ☐ Lighthouse score >90

✅ Accessibility
  ☐ WCAG 2.1 AA compliant
  ☐ Keyboard navigation works
  ☐ Focus indicators visible
  ☐ Color contrast ≥4.5:1

✅ Testing
  ☐ Unit tests ≥80% coverage
  ☐ Integration tests for critical paths
  ☐ E2E tests for user journeys
  ☐ Accessibility tests pass

✅ Code Style
  ☐ ESLint passes
  ☐ Prettier formatted
  ☐ No console errors/warnings
  ☐ No unused imports/variables

✅ Security
  ☐ No hardcoded secrets
  ☐ Input sanitization
  ☐ CSRF protection
  ☐ XSS prevention
```

---

## 16. DEPENDENCIES & VERSIONS

### 16.1 Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.1.0",
    "@tanstack/react-query": "^5.0.0",
    "react-router-dom": "^6.10.0",
    "react-hook-form": "^7.45.0",
    "zod": "^3.22.0",
    "axios": "^1.4.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.12.0",
    "lucide-react": "^0.263.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "jwt-decode": "^3.1.2",
    "@sentry/react": "^7.70.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react-swc": "^3.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "cypress": "^13.3.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
```

---

**Document End**
