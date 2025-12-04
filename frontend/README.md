# HealthVoice Frontend

Modern React-based patient and doctor portal for the HealthVoice AI appointment management system.

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 with TypeScript |
| **Routing** | TanStack Router (file-based) |
| **State Management** | Redux Toolkit |
| **Styling** | Tailwind CSS + Shadcn/UI |
| **HTTP Client** | Axios with interceptors |
| **Voice Client** | LiveKit Components React |
| **Build Tool** | Vite |

---

## 📁 Project Structure

```
frontend/
├── app/
│   └── routes/                    # TanStack Router file-based routing
│       ├── __root.tsx            # Root layout
│       ├── index.tsx             # Landing page (/)
│       ├── login.tsx             # Login page (/login)
│       ├── register.tsx          # Register page (/register)
│       └── _authenticated/       # Protected routes group
│           ├── _layout.tsx       # Authenticated layout
│           └── _layout/
│               ├── dashboard.tsx       # Dashboard (/dashboard)
│               ├── appointments.tsx    # Appointments list (/appointments)
│               └── appointments/
│                   └── book.tsx        # Book appointment (/appointments/book)
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Shadcn/UI primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── features/             # Feature-specific components
│   │   │   ├── appointments/     # Appointment components
│   │   │   │   ├── AppointmentCard/
│   │   │   │   └── AppointmentList/
│   │   │   ├── auth/             # Authentication components
│   │   │   │   └── LoginForm/
│   │   │   └── voice/            # Voice call widget
│   │   │       └── VoiceWidget.tsx
│   │   └── layout/               # Layout components
│   │       ├── MainLayout/       # Authenticated layout
│   │       └── AuthLayout/       # Auth pages layout
│   │
│   ├── pages/                    # Page components
│   │   ├── Dashboard.tsx         # Patient dashboard
│   │   ├── DoctorDashboard.tsx   # Doctor dashboard
│   │   ├── Appointments.tsx      # Appointment list
│   │   ├── BookAppointment.tsx   # Booking form
│   │   ├── Login.tsx             # Login page
│   │   └── Register.tsx          # Registration page
│   │
│   ├── store/                    # Redux store
│   │   ├── index.ts              # Store configuration
│   │   ├── hooks.ts              # Typed hooks
│   │   └── slices/
│   │       ├── authSlice.ts      # Authentication state
│   │       └── appointmentSlice.ts  # Appointments state
│   │
│   ├── services/
│   │   └── api.ts                # Axios instance with interceptors
│   │
│   ├── types/
│   │   ├── entities.ts           # Domain types (User, Appointment, etc.)
│   │   ├── api.ts                # API response types
│   │   └── index.ts              # Re-exports
│   │
│   └── utils/
│       └── auth-utils.ts         # Token management
│
├── public/                       # Static assets
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3001) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check |

---

## 🎨 UI Components

This project uses [Shadcn/UI](https://ui.shadcn.com/) - a collection of re-usable components built with Radix UI and Tailwind CSS.

### Adding New Components

```bash
npx shadcn-ui add button
npx shadcn-ui add card
npx shadcn-ui add input
```

### Theme Customization

Edit `src/index.css` for CSS variables:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}
```

---

## 🗺️ Routing

Uses TanStack Router with file-based routing.

### Route Structure

| Path | Component | Auth Required |
|------|-----------|---------------|
| `/` | Landing Page | No |
| `/login` | Login Page | No |
| `/register` | Registration Page | No |
| `/dashboard` | Dashboard (Patient/Doctor) | Yes |
| `/appointments` | Appointments List | Yes |
| `/appointments/book` | Book Appointment | Yes |

### Protected Routes

Routes under `_authenticated/` require authentication:

```tsx
// app/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const token = getAuthToken();
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout,
});
```

---

## 🔐 Authentication

### Token Storage

Tokens are stored in `localStorage`:

```typescript
// utils/auth-utils.ts
export const setAuthToken = (token: string) => 
  localStorage.setItem('auth_token', token);

export const getAuthToken = () => 
  localStorage.getItem('auth_token');

export const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
};
```

### API Interceptors

Axios automatically attaches tokens:

```typescript
// services/api.ts
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🎙️ Voice Widget

The `VoiceWidget` component enables browser-based voice calls to the AI agent.

### Usage

```tsx
import VoiceWidget from '@/components/features/voice/VoiceWidget';

// In your layout
<VoiceWidget className="fixed bottom-8 right-8" />
```

### How It Works

1. User clicks "Call Agent"
2. Frontend fetches LiveKit token from `/api/v1/livekit/token`
3. Connects to LiveKit room via WebRTC
4. Audio is streamed to/from the voice agent

---

## 🔄 State Management

Uses Redux Toolkit for global state.

### Slices

| Slice | Purpose |
|-------|---------|
| `authSlice` | User authentication state |
| `appointmentSlice` | Appointments data |

### Usage

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, logout } from '@/store/slices/authSlice';

const Component = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };
};
```

---

## 🌐 API Integration

### Base Configuration

```typescript
// services/api.ts
const api = axios.create({
  baseURL: '/api/v1',  // Proxied to backend
  timeout: 10000,
});
```

### Vite Proxy

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
```

---

## 📱 Responsive Design

- **Mobile First**: Base styles for mobile
- **Breakpoints**: `md:` (768px), `lg:` (1024px)
- **Mobile Nav**: Bottom navigation for small screens

---

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

---

## 🔧 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000
VITE_LIVEKIT_URL=ws://localhost:7880
```

---

## 📦 Build

```bash
# Production build
npm run build

# Preview build
npm run preview
```

Output is in `dist/` directory.

---

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript strictly
3. Add tests for new features
4. Update documentation as needed

---

## 📄 License

MIT License
