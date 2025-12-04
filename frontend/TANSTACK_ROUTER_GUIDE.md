# TanStack Router Integration Guide

## Overview

This project has been configured with **TanStack Router** for file-based routing with React. Due to Node.js version requirements (TanStack Start requires Node 20+), we're using TanStack Router which provides:

- File-based routing with auto-generated route tree
- Type-safe navigation
- Built-in code splitting
- Preloading support
- Search param validation

## Node.js Requirements

**For TanStack Router (current setup):** Node.js 18+
**For TanStack Start (SSR):** Node.js 20.19+ or 22.12+

To upgrade later for SSR support:
```bash
nvm install 20
nvm use 20
```

---

## 1. Installed Packages

```json
{
  "@tanstack/react-router": "^1.78.0",
  "@tanstack/router-devtools": "^1.78.0",
  "@tanstack/router-vite-plugin": "^1.78.0"
}
```

---

## 2. Project Structure

```
frontend/
├── app/
│   ├── routes/
│   │   ├── __root.tsx                          # Root layout (providers, global styles)
│   │   ├── index.tsx                           # Home route (/) - redirects to /login
│   │   ├── login.tsx                           # /login route
│   │   ├── register.tsx                        # /register route
│   │   ├── $.tsx                               # Catch-all 404 route
│   │   ├── _authenticated.tsx                  # Auth layout (pathless)
│   │   └── _authenticated/
│   │       ├── _layout.tsx                     # Dashboard layout
│   │       ├── _layout/
│   │       │   ├── dashboard.tsx               # /dashboard route
│   │       │   ├── appointments.tsx            # /appointments route
│   │       │   └── appointments/
│   │       │       └── book.tsx                # /appointments/book route
│   ├── router.tsx                              # Router configuration
│   └── routeTree.gen.ts                        # Auto-generated (DO NOT EDIT)
├── src/
│   ├── components/                             # Existing components
│   ├── pages/                                  # Page components (reused in routes)
│   ├── store/                                  # Redux store
│   ├── utils/
│   │   └── router-compat.ts                    # React Router compatibility layer
│   ├── main.tsx                                # App entry point
│   └── index.css                               # Global styles
├── vite.config.ts                              # Vite config with TanStack plugin
├── tsconfig.json                               # TypeScript config
└── package.json                                # Dependencies and scripts
```

---

## 3. File-Based Routing Convention

| Pattern | Creates |
|---------|---------|
| `routes/about.tsx` | `/about` |
| `routes/posts/index.tsx` | `/posts` |
| `routes/posts/$postId.tsx` | `/posts/:postId` (dynamic) |
| `routes/_layout.tsx` | Layout wrapper (pathless) |
| `routes/$.tsx` | Catch-all/404 |

**Pathless layouts** (prefix with `_`):
- `_authenticated.tsx` - wraps routes without adding to URL path
- Used for auth guards, shared layouts

---

## 4. Key Configuration Files

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './app/routes',
      generatedRouteTree: './app/routeTree.gen.ts',
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './app'),
    },
  },
})
```

### app/router.tsx
```typescript
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})
```

### src/main.tsx
```typescript
import { RouterProvider } from '@tanstack/react-router'
import { router } from '~/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
```

---

## 5. Route Examples

### Basic Route
```typescript
// app/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return <div>About</div>
}
```

### Route with Data Loading
```typescript
// app/routes/users.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users')({
  loader: async () => {
    const response = await fetch('/api/users')
    return response.json()
  },
  component: UsersPage,
})

function UsersPage() {
  const users = Route.useLoaderData()
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### Dynamic Route
```typescript
// app/routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  component: PostPage,
})

function PostPage() {
  const { postId } = Route.useParams()
  return <div>Post: {postId}</div>
}
```

### Layout Route
```typescript
// app/routes/_authenticated.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const isAuth = checkAuth()
    if (!isAuth) throw redirect({ to: '/login' })
  },
  component: () => <Outlet />,
})
```

---

## 6. Navigation

### Using Link Component
```typescript
import { Link } from '@tanstack/react-router'

// Type-safe navigation
<Link to="/dashboard">Dashboard</Link>
<Link to="/posts/$postId" params={{ postId: '123' }}>Post 123</Link>
<Link to="/search" search={{ q: 'hello' }}>Search</Link>
```

### Programmatic Navigation
```typescript
import { useNavigate } from '@tanstack/react-router'

function Component() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate({ to: '/dashboard' })
  }
}
```

---

## 7. Migration from React Router

### Replace Imports
```typescript
// Before (react-router-dom)
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'

// After (TanStack Router)
import { Link, useNavigate, useParams } from '@tanstack/react-router'
// OR use the compatibility layer
import { Link, useNavigate, useLocation, useParams } from '@/utils/router-compat'
```

### Replace Route Components
```typescript
// Before (react-router-dom)
<Route path="/about" element={<About />} />

// After (TanStack Router)
// Create app/routes/about.tsx with createFileRoute
```

### Replace Navigate Component
```typescript
// Before
<Navigate to="/login" replace />

// After
import { redirect } from '@tanstack/react-router'
throw redirect({ to: '/login' })
```

---

## 8. Running the Project

### Development
```bash
npm run dev
```
- Starts Vite dev server on port 3000
- Automatically regenerates route tree on file changes
- Hot module replacement enabled

### Production Build
```bash
npm run build
npm run start  # or npm run preview
```

### Type Checking
```bash
npx tsc --noEmit
```

---

## 9. Best Practices

1. **Keep route files focused** - Only route config and minimal glue code
2. **Use loaders for data** - Prefetch data before navigation
3. **Leverage code splitting** - Routes are automatically code-split
4. **Type-safe navigation** - Always use typed Link/navigate
5. **Colocate related files** - Keep route-specific logic near routes
6. **Use search params for filters** - Built-in validation support
7. **Implement error boundaries** - Handle errors gracefully
8. **Preload on intent** - Improve perceived performance

---

## 10. Upgrading to TanStack Start (SSR)

When you upgrade Node.js to 20+, you can add TanStack Start:

```bash
npm install @tanstack/start vinxi
```

Then add `app.config.ts`:
```typescript
import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  server: {
    preset: 'node-server',
  },
})
```

And create server functions in `app/server/` directory.
