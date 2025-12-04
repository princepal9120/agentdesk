/**
 * Clinical Minimalism SaaS Dashboard
 * A HIPAA-ready analytics and operations dashboard for healthcare providers.
 * Aesthetic: Apple-style medical UI, Bento Grid layout, soft pastels.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import {
    Phone, Calendar, FileText, BarChart2, Shield, Users,
    Settings, Bell, Search, ChevronDown, MoreHorizontal,
    Activity, Clock, CheckCircle, AlertCircle, Mic,
    LayoutDashboard, LogOut, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/utils/cn";
import { Link } from '@tanstack/react-router';

// ========== DESIGN TOKENS ==========
const tokens = {
    colors: {
        primary: '#2BB59B', // Teal/Green
        secondary: '#D7EAFB', // Soft Blue
        bg: {
            main: '#F8FAFC', // Slate 50
            card: '#FFFFFF',
            sidebar: '#FFFFFF',
        },
        text: {
            main: '#111827',
            muted: '#64748B',
        },
        border: '#E2E8F0',
    },
    radius: 'rounded-3xl', // 24px
    shadow: 'shadow-sm hover:shadow-md transition-shadow duration-200',
};

// ========== COMPONENTS ==========

const Card = ({
    children,
    className,
    title,
    icon,
    action,
    colSpan = "col-span-1",
    rowSpan = "row-span-1"
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    colSpan?: string;
    rowSpan?: string;
}) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
            "bg-white border border-slate-100 p-6 flex flex-col",
            tokens.radius,
            tokens.shadow,
            colSpan,
            rowSpan,
            className
        )}
    >
        {(title || icon) && (
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="w-10 h-10 rounded-2xl bg-[#F1F5F9] flex items-center justify-center text-[#2BB59B]">
                            {icon}
                        </div>
                    )}
                    {title && <h3 className="font-semibold text-slate-900">{title}</h3>}
                </div>
                {action}
            </div>
        )}
        {children}
    </motion.div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "success" | "warning" | "error" }) => {
    const variants = {
        default: "bg-slate-100 text-slate-600",
        success: "bg-[#ECFDF5] text-[#059669]",
        warning: "bg-[#FFFBEB] text-[#D97706]",
        error: "bg-[#FEF2F2] text-[#DC2626]",
    };
    return (
        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", variants[variant])}>
            {children}
        </span>
    );
};

// ========== WIDGETS ==========

const OverviewMetrics = () => {
    const metrics = [
        { label: "Total Calls", value: "1,248", change: "+12%", icon: <Phone className="w-4 h-4" />, color: "bg-blue-50 text-blue-600" },
        { label: "Appointments", value: "384", change: "+8%", icon: <Calendar className="w-4 h-4" />, color: "bg-green-50 text-green-600" },
        { label: "AI Accuracy", value: "98.2%", change: "+1.5%", icon: <Activity className="w-4 h-4" />, color: "bg-purple-50 text-purple-600" },
        { label: "Avg Duration", value: "2m 14s", change: "-15s", icon: <Clock className="w-4 h-4" />, color: "bg-orange-50 text-orange-600" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full h-full">
            {metrics.map((m, i) => (
                <div key={i} className="bg-[#F8FAFC] rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", m.color)}>
                            {m.icon}
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{m.change}</span>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{m.value}</div>
                        <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const LiveCalls = () => {
    const calls = [
        { id: "C-1024", caller: "Jane Doe", status: "Active", duration: "04:12", agent: "AI Agent" },
        { id: "C-1025", caller: "Unknown", status: "Queue", duration: "00:45", agent: "Waiting" },
        { id: "C-1026", caller: "Mark Smith", status: "Handoff", duration: "08:30", agent: "Dr. Sarah" },
    ];

    return (
        <div className="space-y-3">
            {calls.map((call, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <div>
                            <div className="text-sm font-semibold text-slate-900">{call.caller}</div>
                            <div className="text-xs text-slate-500">{call.id} • {call.agent}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <Badge variant={call.status === "Active" ? "success" : call.status === "Queue" ? "warning" : "default"}>
                            {call.status}
                        </Badge>
                        <div className="text-xs text-slate-400 mt-1 font-mono">{call.duration}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const AppointmentsList = () => {
    const appts = [
        { time: "09:00 AM", patient: "Emma Wilson", type: "Check-up", status: "Confirmed" },
        { time: "10:30 AM", patient: "James Brown", type: "Follow-up", status: "Pending" },
        { time: "11:15 AM", patient: "Linda Davis", type: "New Patient", status: "Confirmed" },
        { time: "02:00 PM", patient: "Robert Miller", type: "Lab Review", status: "Confirmed" },
    ];

    return (
        <div className="space-y-4">
            {appts.map((appt, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-16 text-xs font-medium text-slate-400 text-right">{appt.time}</div>
                    <div className="flex-1 p-3 rounded-2xl bg-[#F8FAFC] group-hover:bg-[#F1F5F9] transition-colors border-l-4 border-[#2BB59B]">
                        <div className="flex justify-between items-center">
                            <div className="font-medium text-slate-900">{appt.patient}</div>
                            <Badge variant={appt.status === "Confirmed" ? "success" : "warning"}>{appt.status}</Badge>
                        </div>
                        <div className="text-xs text-slate-500">{appt.type}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const AnalyticsChart = () => {
    // Mock chart visualization
    return (
        <div className="h-full flex items-end justify-between gap-2 px-2 pb-2">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="w-full bg-[#D7EAFB] rounded-t-lg relative group"
                >
                    <div className="absolute bottom-0 w-full bg-[#2BB59B] rounded-t-lg transition-all duration-500 h-0 group-hover:h-full opacity-80" />
                </motion.div>
            ))}
        </div>
    );
};

const ComplianceStatus = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#ECFDF5] rounded-2xl border border-[#D1FAE5]">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#059669]" />
                    <div>
                        <div className="text-sm font-semibold text-[#065F46]">HIPAA Compliant</div>
                        <div className="text-xs text-[#047857]">Last audit: Today, 09:00 AM</div>
                    </div>
                </div>
                <CheckCircle className="w-5 h-5 text-[#059669]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded-2xl text-center">
                    <div className="text-xs text-slate-500 mb-1">Encryption</div>
                    <div className="text-sm font-semibold text-slate-900">AES-256</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-2xl text-center">
                    <div className="text-xs text-slate-500 mb-1">Access Logs</div>
                    <div className="text-sm font-semibold text-slate-900">Active</div>
                </div>
            </div>
        </div>
    );
};

// ========== LAYOUT ==========

const Sidebar = () => {
    const links = [
        { icon: <LayoutDashboard />, label: "Dashboard", active: true },
        { icon: <Phone />, label: "Calls" },
        { icon: <Calendar />, label: "Appointments" },
        { icon: <Users />, label: "Patients" },
        { icon: <BarChart2 />, label: "Analytics" },
        { icon: <Shield />, label: "Compliance" },
        { icon: <Settings />, label: "Settings" },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-slate-100 fixed left-0 top-0 z-20">
            <div className="p-6">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <div className="w-8 h-8 bg-[#2BB59B] rounded-xl flex items-center justify-center text-white">
                        <Shield className="w-5 h-5" />
                    </div>
                    HealthVoice
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {links.map((link, i) => (
                    <a
                        key={i}
                        href="#"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                            link.active
                                ? "bg-[#D7EAFB]/50 text-[#1B5E7A]"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        {link.icon}
                        {link.label}
                    </a>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer">
                    <div className="w-10 h-10 bg-slate-200 rounded-full" />
                    <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-semibold text-slate-900 truncate">Dr. Sarah Chen</div>
                        <div className="text-xs text-slate-500 truncate">Medical Director</div>
                    </div>
                    <LogOut className="w-4 h-4 text-slate-400" />
                </div>
            </div>
        </aside>
    );
};

const Header = () => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900">Dashboard Overview</h1>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patients, calls..."
                        className="h-10 pl-10 pr-4 rounded-full bg-slate-50 border-none focus:ring-2 focus:ring-[#2BB59B]/20 w-64 text-sm"
                    />
                </div>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
            </div>
        </header>
    );
};

// ========== MAIN DASHBOARD ==========

const Dashboard = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".dashboard-card", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <Sidebar />

            <div className="lg:pl-64">
                <Header />

                <main ref={containerRef} className="p-6 max-w-[1600px] mx-auto">
                    {/* BENTO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                        {/* 1. Overview Metrics (Top Row) */}
                        <Card
                            colSpan="col-span-1 md:col-span-4"
                            className="dashboard-card"
                            title="Practice Overview"
                            action={
                                <select className="bg-slate-50 border-none text-sm rounded-lg px-2 py-1">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            }
                        >
                            <OverviewMetrics />
                        </Card>

                        {/* 2. Live Calls Monitor */}
                        <Card
                            colSpan="col-span-1 md:col-span-2"
                            rowSpan="row-span-2"
                            className="dashboard-card"
                            title="Live Calls"
                            icon={<Activity className="w-5 h-5" />}
                            action={<Badge variant="success">3 Active</Badge>}
                        >
                            <LiveCalls />
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Queue Status</div>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={cn("h-2 flex-1 rounded-full", i < 2 ? "bg-green-500" : "bg-slate-100")} />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-slate-400">
                                    <span>Low Load</span>
                                    <span>High Load</span>
                                </div>
                            </div>
                        </Card>

                        {/* 3. Analytics Chart */}
                        <Card
                            colSpan="col-span-1 md:col-span-2"
                            rowSpan="row-span-1"
                            className="dashboard-card"
                            title="Call Volume"
                            icon={<BarChart2 className="w-5 h-5" />}
                        >
                            <AnalyticsChart />
                        </Card>

                        {/* 4. Appointments Panel */}
                        <Card
                            colSpan="col-span-1 md:col-span-2"
                            rowSpan="row-span-2"
                            className="dashboard-card"
                            title="Upcoming Appointments"
                            icon={<Calendar className="w-5 h-5" />}
                        >
                            <AppointmentsList />
                        </Card>

                        {/* 5. Compliance Center */}
                        <Card
                            colSpan="col-span-1"
                            className="dashboard-card"
                            title="Compliance"
                            icon={<Shield className="w-5 h-5" />}
                        >
                            <ComplianceStatus />
                        </Card>

                        {/* 6. System Status */}
                        <Card
                            colSpan="col-span-1"
                            className="dashboard-card"
                            title="System Health"
                            icon={<Settings className="w-5 h-5" />}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">Voice AI Engine</span>
                                    <Badge variant="success">Operational</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">EHR Sync</span>
                                    <Badge variant="success">Connected</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">SMS Gateway</span>
                                    <Badge variant="success">Active</Badge>
                                </div>
                            </div>
                        </Card>

                        {/* 7. Notifications Inbox */}
                        <Card
                            colSpan="col-span-1 md:col-span-2"
                            className="dashboard-card"
                            title="Recent Alerts"
                            icon={<Bell className="w-5 h-5" />}
                        >
                            <div className="space-y-3">
                                <div className="flex gap-3 items-start p-3 bg-blue-50 rounded-xl">
                                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">New Feature Available</div>
                                        <div className="text-xs text-slate-500">Try the new sentiment analysis dashboard.</div>
                                    </div>
                                    <span className="text-xs text-slate-400 ml-auto">2h ago</span>
                                </div>
                                <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">Daily Backup Completed</div>
                                        <div className="text-xs text-slate-500">All patient data secured.</div>
                                    </div>
                                    <span className="text-xs text-slate-400 ml-auto">5h ago</span>
                                </div>
                            </div>
                        </Card>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
