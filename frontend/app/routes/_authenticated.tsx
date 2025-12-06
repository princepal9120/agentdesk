import { createFileRoute, Outlet, redirect, useRouter } from '@tanstack/react-router'
import { getStoredUser, getAuthToken } from '@/utils/auth-utils'
import { canAccessRoute } from '@/utils/rbac'
import type { User } from '@/types'

// This is a pathless layout route (prefixed with _)
// All routes in _authenticated/ folder will be wrapped with this layout
export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ location }) => {
        // Check authentication
        const token = getAuthToken()
        const user = getStoredUser()

        if (!token || !user) {
            throw redirect({
                to: '/login',
                search: { redirect: location.pathname }
            })
        }

        // Check role-based access for the current route
        if (!canAccessRoute(user, location.pathname)) {
            // User is authenticated but doesn't have permission
            // Redirect to their default dashboard
            console.warn(`User role '${user.role}' cannot access '${location.pathname}'`)
            throw redirect({ to: '/dashboard' })
        }

        return { user }
    },
    component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
    return <Outlet />
}

