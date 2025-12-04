import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

// This is a pathless layout route (prefixed with _)
// All routes in _authenticated/ folder will be wrapped with this layout
export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async () => {
        // Check authentication here
        const isAuthenticated = checkAuth()
        if (!isAuthenticated) {
            throw redirect({ to: '/login' })
        }
    },
    component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
    return <Outlet />
}

// Replace with your actual auth check logic
function checkAuth(): boolean {
    // Example: Check localStorage, Redux state, or call a server function
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        return !!token
    }
    return false
}
