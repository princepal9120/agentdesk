import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
    const router = createTanStackRouter({
        routeTree,
        defaultPreload: 'intent',
        defaultPreloadStaleTime: 0,
        scrollRestoration: true,
    })

    return router
}

// Type registration for type-safe routing
declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof createRouter>
    }
}

// Export the router instance for use in main.tsx
export const router = createRouter()
