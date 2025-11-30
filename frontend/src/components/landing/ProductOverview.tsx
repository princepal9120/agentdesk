'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Calendar, MessageSquare, BarChart3, Users, Bell, Search, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductOverview() {
    return (
        <section className="py-32 bg-slate-50/50 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Unified Dashboard
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                        See your entire practice <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-blue-500">
                            at a glance.
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        A unified command center for appointments, AI-call transcripts, analytics, and real-time patient updates.
                    </p>
                </div>

                <div className="flex justify-center perspective-1000">
                    <TiltCard>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/60 bg-white/80 backdrop-blur-xl max-w-6xl w-full aspect-[16/10] ring-1 ring-black/5">
                            {/* Mock Dashboard Header */}
                            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md sticky top-0 z-20">
                                <div className="flex items-center gap-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#2B7BE4] to-[#1ABC9C] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">M</div>
                                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100/50 rounded-full border border-slate-200/50 w-64 text-slate-400 text-sm">
                                        <Search size={16} />
                                        <span>Search patients...</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-colors relative">
                                        <Bell size={18} />
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                                    </button>
                                    <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                        <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="flex h-full bg-slate-50/30">
                                {/* Sidebar */}
                                <div className="w-72 border-r border-slate-100 bg-white/40 backdrop-blur-sm p-6 hidden lg:block">
                                    <div className="space-y-2">
                                        {[
                                            { icon: Calendar, label: 'Calendar', active: true },
                                            { icon: MessageSquare, label: 'Conversations', badge: '3' },
                                            { icon: Users, label: 'Patients' },
                                            { icon: BarChart3, label: 'Analytics' },
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                                                    item.active
                                                        ? "bg-primary/10 text-primary shadow-sm"
                                                        : "text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-900"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={18} strokeWidth={2} />
                                                    {item.label}
                                                </div>
                                                {item.badge && (
                                                    <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-100">
                                        <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                            Upcoming
                                        </div>
                                        <div className="space-y-3">
                                            {[1, 2].map((i) => (
                                                <div key={i} className="flex items-center gap-3 px-4 py-2">
                                                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-700">Dr. Sarah Smith</div>
                                                        <div className="text-xs text-slate-400">10:00 AM • Check-up</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Main Area */}
                                <div className="flex-1 p-8 overflow-hidden">
                                    <div className="grid grid-cols-12 gap-8 h-full">
                                        {/* Calendar Column */}
                                        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">Today's Schedule</h3>
                                                    <p className="text-sm text-slate-500">Tuesday, Nov 14</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">Day</div>
                                                    <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 shadow-sm">Week</div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {[1, 2, 3].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="relative group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-md transition-all duration-300"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 text-sm font-medium text-slate-400 pt-1">09:00</div>
                                                            <div className="w-1 bg-primary/20 rounded-full h-12 group-hover:bg-primary transition-colors" />
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-bold text-slate-900">Emma Thompson</h4>
                                                                        <p className="text-sm text-slate-500">New Patient Consultation</p>
                                                                    </div>
                                                                    <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">
                                                                        CONFIRMED
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="col-span-12 lg:col-span-4 space-y-6">
                                            {/* Stats Card */}
                                            <div className="bg-gradient-to-br from-[#2B7BE4] to-[#1ABC9C] rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                                        <BarChart3 size={20} />
                                                    </div>
                                                    <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">+12%</span>
                                                </div>
                                                <div className="text-3xl font-bold mb-1">24</div>
                                                <div className="text-sm text-white/70">Appointments Today</div>
                                                <div className="mt-4 h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                                    <div className="h-full w-[70%] bg-white/90 rounded-full" />
                                                </div>
                                            </div>

                                            {/* Recent Activity */}
                                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                                <h4 className="font-bold text-slate-900 mb-4 text-sm">Live Activity</h4>
                                                <div className="space-y-4">
                                                    {[1, 2].map((i) => (
                                                        <div key={i} className="flex gap-3 items-start">
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <MessageSquare size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-slate-700 font-medium">
                                                                    <span className="text-primary">AI Agent</span> booked a follow-up.
                                                                </p>
                                                                <p className="text-xs text-slate-400 mt-1">2 mins ago</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </div>
            </div>
        </section>
    );
}

function TiltCard({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ['5deg', '-5deg']);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-5deg', '5deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className="perspective-1000"
        >
            {children}
        </motion.div>
    );
}
