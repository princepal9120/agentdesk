'use client';

import { useEffect, useRef } from 'react';
import { Bot, Calendar, Headphones, BarChart, ShieldCheck, Zap, Clock, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: Bot,
        title: 'Smart AI Voice Agent',
        desc: 'Books appointments, handles rescheduling, sends reminders, and flags risky calls. It learns from your practice patterns.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
    },
    {
        icon: Calendar,
        title: 'Real-Time Calendar',
        desc: 'Drag-and-drop interface with color-coding, conflict detection, and live syncing across all devices.',
        color: 'text-teal-500',
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/20',
    },
    {
        icon: Headphones,
        title: 'Call Monitoring',
        desc: 'Listen to recordings, read transcripts, analyze sentiment, and export logs for compliance and training.',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
    },
    {
        icon: BarChart,
        title: 'Practice Analytics',
        desc: 'Track no-show rates, AI call handling performance, peak hours, and estimated time saved.',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
    },
    {
        icon: ShieldCheck,
        title: 'HIPAA Compliant',
        desc: 'Enterprise-grade security with end-to-end encryption to keep patient data safe and secure.',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
    },
    {
        icon: Zap,
        title: 'Instant Integration',
        desc: 'Connects with your existing EMR/EHR systems in minutes, not months.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
    },
    {
        icon: Clock,
        title: '24/7 Availability',
        desc: 'Never miss a patient call again. Your AI receptionist works round the clock.',
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
    },
    {
        icon: Globe,
        title: 'Multilingual Support',
        desc: 'Communicate with patients in their preferred language with real-time translation.',
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
    },
];

export function FeaturesSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.feature-item', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="features" className="py-32 bg-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="mb-20 max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Everything you need to run a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            modern healthcare practice.
                        </span>
                    </h2>
                    <p className="text-xl text-slate-500 leading-relaxed">
                        Powerful tools designed to automate administrative tasks, so you can focus on patient care.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={cn(
                                "feature-item p-8 rounded-3xl bg-white border border-slate-100 hover:border-blue-200/50 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group",
                                "hover:-translate-y-1"
                            )}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
