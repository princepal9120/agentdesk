import { createFileRoute, Outlet, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout')({
    component: DashboardLayout,
})

function DashboardLayout() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('auth_token')
        navigate({ to: '/login' })
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/dashboard" className="text-xl font-bold">
                        Healthcare Voice Agent
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link
                            to="/dashboard"
                            className="text-gray-600 hover:text-gray-900"
                            activeProps={{ className: 'text-blue-600 font-medium' }}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/appointments"
                            className="text-gray-600 hover:text-gray-900"
                            activeProps={{ className: 'text-blue-600 font-medium' }}
                        >
                            Appointments
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-red-600"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t py-4">
                <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                    Healthcare Voice Agent - All rights reserved
                </div>
            </footer>
        </div>
    )
}
