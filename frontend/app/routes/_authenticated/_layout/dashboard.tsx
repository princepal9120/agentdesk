import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '@/pages/Dashboard'

export const Route = createFileRoute('/_authenticated/_layout/dashboard')({
    component: DashboardPage,
    head: () => ({
        meta: [{ title: 'Dashboard - Healthcare Voice Agent' }],
    }),
})

function DashboardPage() {
    return <Dashboard />
}
