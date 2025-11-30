# MedVoice Scheduler - Frontend Dashboard

![MedVoice Logo](public/logo.svg)

A modern, production-ready healthcare appointment management dashboard with AI voice agent monitoring, real-time updates, and comprehensive analytics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- 📅 **Smart Calendar Management** - Week/Day/Month views with drag-and-drop rescheduling
- 🤖 **AI Voice Agent Monitoring** - Real-time call transcripts and analytics
- 📊 **Advanced Analytics Dashboard** - Metrics, charts, and exportable reports
- ⚙️ **Comprehensive Settings** - Practice configuration, provider management, AI script customization
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 🔔 **Real-time Updates** - WebSocket integration for live appointment changes
- 📱 **Mobile Responsive** - Optimized for desktop, tablet, and mobile devices

### User Experience
- 🎨 Modern, clean UI with shadcn/ui components
- 🌙 Professional healthcare-focused design
- ⚡ Lightning-fast performance (Lighthouse score > 90)
- ♿ Accessible (WCAG 2.1 AA compliant)
- 🔍 Advanced filtering and search
- 📤 Export to CSV and PDF

## 🛠 Tech Stack

### Core
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI

### State Management & Data
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client

### Feature Libraries
- **Calendar:** FullCalendar.js
- **Charts:** Recharts
- **Date Handling:** date-fns
- **Icons:** Lucide React
- **Notifications:** Sonner

### Development Tools
- **Testing:** Jest + React Testing Library
- **E2E Testing:** Playwright
- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/medvoice-frontend.git
cd medvoice-frontend/medvoice-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=https://api.medvoice.com/v1
NEXT_PUBLIC_WS_URL=wss://api.medvoice.com/ws
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
medvoice-dashboard/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Auth pages (login, signup)
│   │   ├── (dashboard)/   # Dashboard pages
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── calendar/      # Calendar components
│   │   ├── ai-calls/      # AI calls components
│   │   ├── analytics/     # Analytics components
│   │   ├── settings/      # Settings components
│   │   └── shared/        # Shared components
│   ├── lib/               # Utilities & helpers
│   │   ├── api/           # API clients
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Helper functions
│   │   └── schemas/       # Zod schemas
│   ├── stores/            # Zustand stores
│   ├── types/             # TypeScript types
│   └── styles/            # Global styles
├── .env.example           # Environment variables template
├── .env.local             # Local environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run type-check       # Run TypeScript type checking
npm run format           # Format code with Prettier

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run e2e              # Run E2E tests
npm run e2e:ui           # Run E2E tests with UI
```

### Development Workflow

1. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Run tests and linting**
```bash
npm run lint
npm run type-check
npm run test
```

4. **Commit your changes**
```bash
git commit -m "feat: add your feature description"
```

5. **Push and create a pull request**
```bash
git push origin feature/your-feature-name
```

### Coding Standards

- **TypeScript:** All files must be TypeScript (.ts/.tsx)
- **ESLint:** Follow the configured ESLint rules
- **Prettier:** Code is auto-formatted on commit
- **Component Structure:** Use functional components with hooks
- **Naming Conventions:**
  - Components: PascalCase (e.g., `AppointmentCard.tsx`)
  - Hooks: camelCase with 'use' prefix (e.g., `useAppointments.ts`)
  - Utilities: camelCase (e.g., `formatDate.ts`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests headless
npm run e2e

# Run E2E tests with UI
npm run e2e:ui
```

### Test Coverage Goals

- Utilities: 90%+
- Hooks: 80%+
- Components: 70%+
- Overall: 70%+

## 🚢 Deployment

### Production Build

```bash
# Build the application
npm run build

# Test the production build locally
npm run start
```

### Environment Variables

Ensure all required environment variables are set:

```env
NEXT_PUBLIC_API_URL=https://api.medvoice.com/v1
NEXT_PUBLIC_WS_URL=wss://api.medvoice.com/ws
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_ENV=production
```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker

```bash
# Build Docker image
docker build -t medvoice-dashboard .

# Run container
docker run -p 3000:3000 medvoice-dashboard
```

## 📊 Performance Targets

- **Initial Load:** < 2 seconds
- **Time to Interactive:** < 3 seconds
- **Lighthouse Performance:** > 90
- **Bundle Size:** < 500KB gzipped
- **API Response Time:** < 500ms (p95)

## 🔒 Security

- HTTPS only (enforced with HSTS)
- JWT authentication with refresh tokens
- CSRF protection
- XSS prevention (input sanitization)
- Content Security Policy headers
- No PHI in console logs (HIPAA compliant)
- Rate limiting on API requests

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 📝 License

This project is proprietary and confidential.  
Copyright © 2025 MedVoice. All rights reserved.

## 👥 Team

- **Product Manager:** [Name]
- **Engineering Lead:** [Name]
- **Design Lead:** [Name]
- **Frontend Engineers:** [Names]

## 📞 Support

For questions or issues, please contact:
- **Email:** support@medvoice.com
- **Slack:** #medvoice-frontend
- **Documentation:** [Internal Wiki Link]

## 🗺 Roadmap

### v1.0 (Current - MVP)
- ✅ Core calendar management
- ✅ AI voice agent monitoring
- ✅ Analytics dashboard
- ✅ Settings & configuration
- ✅ Real-time updates

### v1.1 (Next Quarter)
- 🔄 Enhanced mobile experience
- 🔄 Advanced filtering options
- 🔄 Bulk operations
- 🔄 Custom report builder

### v2.0 (Future)
- 📋 Multi-location support
- 📋 Patient-facing booking portal
- 📋 EHR deep integration
- 📋 Mobile native apps

---

**Built with ❤️ by the MedVoice Team**
