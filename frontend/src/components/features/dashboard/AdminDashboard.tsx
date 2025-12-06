import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import {
    Phone, Calendar, BarChart2, Shield, Settings, Bell,
    Activity, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { cn } from "@/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Helper components for Admin Dashboard
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

const AnalyticsChart = () => {
    return (
        <div className="h-full flex items-end justify-between gap-2 px-2 pb-2 min-h-[150px]">
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

export const AdminDashboard = () => {
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
        <div ref={containerRef} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-grey-900">Practice Overview</h1>
                    <p className="text-grey-500">Real-time insights and system status.</p>
                </div>
                <select className="bg-white border border-grey-200 text-sm rounded-xl px-3 py-2 shadow-sm">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
                {/* 1. Overview Metrics (Top Row) */}
                <div className="col-span-1 md:col-span-4 dashboard-card">
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OverviewMetrics />
                        </CardContent>
                    </Card>
                </div>

                {/* 2. Live Calls Monitor */}
                <div className="col-span-1 md:col-span-2 row-span-2 dashboard-card">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-grey-400" />
                                <CardTitle>Live Calls</CardTitle>
                            </div>
                            <Badge variant="success">3 Active</Badge>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Analytics Chart */}
                <div className="col-span-1 md:col-span-2 row-span-1 dashboard-card">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-grey-400" />
                                <CardTitle>Call Volume</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <AnalyticsChart />
                        </CardContent>
                    </Card>
                </div>

                {/* 5. Compliance Center */}
                <div className="col-span-1 dashboard-card">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-grey-400" />
                                <CardTitle>Compliance</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ComplianceStatus />
                        </CardContent>
                    </Card>
                </div>

                {/* 6. System Status */}
                <div className="col-span-1 dashboard-card">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-grey-400" />
                                <CardTitle>System Health</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
