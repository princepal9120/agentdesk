import { createFileRoute } from '@tanstack/react-router'
import DeveloperDashboard from '@/pages/DeveloperDashboard'

export const Route = createFileRoute('/_authenticated/_layout/developer')({
    component: DeveloperDashboard,
})
