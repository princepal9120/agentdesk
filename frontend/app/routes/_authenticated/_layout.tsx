/**
 * Clinical Minimalism Dashboard Layout
 * Authenticated layout with sidebar navigation and clean header.
 */

import { createFileRoute, Outlet, Link, useNavigate, useLocation } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
    LayoutDashboard, Calendar, Phone, Users, BarChart2,
    Shield, Settings, Bell, LogOut, Menu, X, Search
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/_layout')({
    component: DashboardLayout,
})

function DashboardLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('auth_token')
        navigate({ to: '/login' })
    }

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Appointments', path: '/appointments' },
        { icon: Phone, label: 'Calls', path: '/calls' },
        { icon: Users, label: 'Patients', path: '/patients' },
        { icon: BarChart2, label: 'Analytics', path: '/analytics' },
        { icon: Shield, label: 'Compliance', path: '/compliance' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ]

    const isActive = (path: string) => location.pathname === path ||
        (path === '/dashboard' && location.pathname === '/')

    return (
        <div className="min-h-screen flex bg-grey-50">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-grey-100 fixed left-0 top-0 h-screen z-30">
                {/* Logo */}
                <div className="p-6 border-b border-grey-100">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2BB59B] rounded-2xl flex items-center justify-center text-white shadow-teal">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-semibold text-grey-900">HealthVoice</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.path)
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                                    active
                                        ? "bg-[#D7EAFB]/50 text-[#1B5E7A]"
                                        : "text-grey-500 hover:bg-grey-50 hover:text-grey-900"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-grey-100">
                    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-grey-50 transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-grey-200 rounded-full flex items-center justify-center text-grey-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-grey-900 truncate">Dr. Sarah Chen</div>
                            <div className="text-xs text-grey-500 truncate">Medical Director</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-xl hover:bg-grey-100 text-grey-400 hover:text-error transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: sidebarOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-grey-100 z-50 lg:hidden"
            >
                <div className="p-6 border-b border-grey-100 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2BB59B] rounded-2xl flex items-center justify-center text-white">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-semibold text-grey-900">HealthVoice</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-xl hover:bg-grey-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.path)
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                                    active
                                        ? "bg-[#D7EAFB]/50 text-[#1B5E7A]"
                                        : "text-grey-500 hover:bg-grey-50 hover:text-grey-900"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-72">
                {/* Top Header */}
                <header className="sticky top-0 z-20 h-20 bg-white/80 backdrop-blur-md border-b border-grey-100 px-6 flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-xl hover:bg-grey-100"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search */}
                    <div className="hidden md:block relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                        <input
                            type="text"
                            placeholder="Search patients, calls, appointments..."
                            className="w-full h-11 pl-11 pr-4 rounded-full bg-grey-50 border-none text-sm placeholder:text-grey-400 focus:ring-2 focus:ring-[#2BB59B]/20 transition-all"
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button className="relative w-10 h-10 rounded-full bg-grey-50 hover:bg-grey-100 flex items-center justify-center text-grey-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="py-6 px-6 border-t border-grey-100 bg-white">
                    <div className="text-center text-sm text-grey-400">
                        © 2024 HealthVoice AI — HIPAA Compliant
                    </div>
                </footer>
            </div>
        </div>
    )
}
