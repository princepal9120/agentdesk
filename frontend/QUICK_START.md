# MedVoice Scheduler - Quick Start Guide

## 🚀 Get Up and Running in 10 Minutes

This guide will help you set up the MedVoice Scheduler frontend development environment quickly.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js:** >= 18.0.0
- **npm:** >= 9.0.0
- **Git:** Latest version
- **Code Editor:** VS Code recommended

Check your versions:
```bash
node --version  # Should be >= v18.0.0
npm --version   # Should be >= 9.0.0
```

---

## Step 1: Navigate to Project

```bash
cd /Users/prince/Desktop/coding/voice-agent/frontend/medvoice-dashboard
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This will install all 60+ dependencies including:
- Next.js, React, TypeScript
- Zustand, TanStack Query
- shadcn/ui, Radix UI
- FullCalendar, Recharts
- Jest, Playwright
- And more...

**Installation time:** ~2-3 minutes

---

## Step 3: Set Up Environment Variables

The `.env.local` file has already been created for you from `.env.example`.

To use a different API endpoint, edit `.env.local`:

```bash
# Open in your editor
code .env.local

# Or use nano
nano .env.local
```

**Default values:**
```env
NEXT_PUBLIC_API_URL=https://api.medvoice.com/v1
NEXT_PUBLIC_WS_URL=wss://api.medvoice.com/ws
NEXT_PUBLIC_ENV=development
```

---

## Step 4: Start Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

You should see:
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

---

## 🎨 VS Code Setup (Recommended)

### Install Recommended Extensions

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **TypeScript Vue Plugin (Volar)** - Better TypeScript support

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## 📁 Project Structure Overview

```
medvoice-dashboard/
├── src/
│   ├── app/               # ⚠️ Next.js pages (to be created in Phase 1)
│   ├── components/        # ⚠️ React components (to be created)
│   │   ├── ui/            # shadcn/ui components
│   │   ├── calendar/      # Calendar components
│   │   ├── ai-calls/      # AI calls components
│   │   ├── analytics/     # Analytics components
│   │   └── shared/        # Shared components
│   ├── lib/
│   │   ├── api/           # ⚠️ API clients (to be created)
│   │   ├── hooks/         # ⚠️ Custom hooks (to be created)
│   │   ├── utils/         # ✅ Helpers & constants
│   │   ├── schemas/       # ✅ Zod schemas
│   │   └── websocket/     # ⚠️ WebSocket client (to be created)
│   ├── stores/            # ⚠️ Zustand stores (to be created)
│   └── types/             # ✅ TypeScript types
├── public/                # Static assets
├── .env.local             # ✅ Environment variables
├── package.json           # ✅ Dependencies
└── README.md              # ✅ Full documentation
```

**Legend:**
- ✅ = Already created
- ⚠️ = To be created in Phase 1

---

## 🧪 Run Tests

```bash
# Unit tests (when written)
npm run test

# E2E tests (when written)
npm run e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🔧 Useful Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run type-check   # Check TypeScript types
npm run format       # Format code with Prettier
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run e2e          # Run E2E tests
npm run e2e:ui       # Run E2E tests with UI
```

---

## 📚 Key Files to Know

### Already Created (Phase 0)

1. **`src/types/models.ts`**
   - All TypeScript type definitions
   - ~500 lines, fully documented
   - User, Appointment, Call, Analytics, Settings types

2. **`src/lib/utils/constants.ts`**
   - Application constants
   - API URLs, colors, labels, validation rules
   - ~300 lines

3. **`src/lib/utils/helpers.ts`**
   - Utility functions
   - Date formatting, phone masking, validation
   - ~600 lines

4. **`src/lib/schemas/auth.ts`**
   - Authentication validation schemas
   - Login, signup, password reset

5. **`src/lib/schemas/appointment.ts`**
   - Appointment validation schemas
   - Create, reschedule, cancel, filter

### Documentation

1. **`IMPLEMENTATION_PLAN.md`**
   - Complete 8-week implementation plan
   - Architecture, components, testing, deployment
   - ~1000 lines

2. **`IMPLEMENTATION_SUMMARY.md`**
   - Summary of completed work
   - Technology decisions
   - Next steps

3. **`README.md`**
   - Project overview
   - Setup instructions
   - Development workflow

---

## 🎯 Next Steps (Phase 1 - Week 1)

### Your First Tasks:

1. **Set up shadcn/ui**
   ```bash
   npx shadcn@latest init
   ```

2. **Create your first component**
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add input
   npx shadcn@latest add card
   ```

3. **Create the API client**
   - File: `src/lib/api/client.ts`
   - Use Axios with interceptors
   - Reference: IMPLEMENTATION_PLAN.md, Section 6.1

4. **Build login page**
   - File: `src/app/(auth)/login/page.tsx`
   - Use `loginSchema` from `src/lib/schemas/auth.ts`
   - Use React Hook Form
   - Reference: IMPLEMENTATION_PLAN.md, Phase 1

---

## 🐛 Troubleshooting

### Port 3000 already in use?

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Module not found errors?

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors?

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### ESLint errors?

```bash
# Auto-fix what can be fixed
npm run lint:fix
```

---

## 📖 Reference Documentation

### Internal Documentation
- **Full Implementation Plan:** `IMPLEMENTATION_PLAN.md`
- **PRD:** `medvoice-frontend-prd.md`
- **Summary:** `IMPLEMENTATION_SUMMARY.md`
- **This Guide:** `QUICK_START.md`

### External Documentation
- **Next.js:** https://nextjs.org/docs
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **TanStack Query:** https://tanstack.com/query/latest
- **Zustand:** https://github.com/pmndrs/zustand
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev

---

## 💡 Pro Tips

### 1. Use TypeScript IntelliSense
All types are in `src/types/models.ts`. Import and use:

```typescript
import type { Appointment, User } from '@/types/models';
```

### 2. Use Helper Functions
Don't reinvent the wheel:

```typescript
import { formatPhoneNumber, maskPatientName } from '@/lib/utils/helpers';

const formatted = formatPhoneNumber('1234567890'); // (123) 456-7890
const masked = maskPatientName('John Doe'); // John D.
```

### 3. Use Constants
```typescript
import { APPOINTMENT_STATUS_COLORS, API_BASE_URL } from '@/lib/utils/constants';
```

### 4. Use Validation Schemas
```typescript
import { loginSchema } from '@/lib/schemas/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(loginSchema),
});
```

### 5. Use cn() for CSS
```typescript
import { cn } from '@/lib/utils/helpers';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)} />
```

---

## 🎨 Design System Quick Reference

### Colors
```typescript
Primary:  #2563eb
Success:  #10b981
Warning:  #f59e0b
Error:    #ef4444
Neutral:  #64748b
```

### Spacing
```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

### Typography
```
Display:  32px
H1:       24px
H2:       20px
H3:       18px
Body:     16px
Small:    14px
Tiny:     12px
```

---

## ✅ Checklist Before Starting Development

- [ ] Node.js >= 18 installed
- [ ] npm >= 9 installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] `.env.local` configured
- [ ] VS Code extensions installed
- [ ] Read IMPLEMENTATION_PLAN.md
- [ ] Read README.md
- [ ] Understand project structure
- [ ] Understand type system

---

## 🚦 You're All Set!

**Current Status:** ✅ Phase 0 Complete  
**Ready For:** Phase 1 - Week 1 Development  
**Next Milestone:** Authentication & Layout (Weeks 1-2)

**Questions?** Check the documentation files or review the PRD.

---

**Happy Coding! 🎉**

---

*Last Updated: November 25, 2025*
