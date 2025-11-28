'use client';

import { useRef, useEffect } from 'react';
import { Calendar, Bell, ShieldCheck, Database } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        id: '01',
        title: 'Instant Booking',
        desc: 'Appointment is booked directly into your EMR and synced to your dashboard instantly.',
        icon: Calendar,
        color: 'text-[#1ABC9C]', // Teal
        bg: 'bg-[#1ABC9C]/10',
        border: 'border-[#1ABC9C]/20'
    },
    {
        id: '02',
        title: 'Automated Reminders',
        desc: 'Patient receives automated SMS/Email confirmations and reminders to reduce no-shows.',
        icon: Bell,
        color: 'text-[#2B7BE4]', // Blue
        bg: 'bg-[#2B7BE4]/10',
        border: 'border-[#2B7BE4]/20'
    },
    {
        id: '03',
        title: 'Insurance Verification',
        desc: 'AI collects insurance details and verifies eligibility before the appointment.',
        icon: ShieldCheck,
        color: 'text-[#22C55E]', // Green
        bg: 'bg-[#22C55E]/10',
        border: 'border-[#22C55E]/20'
    },
    {
        id: '04',
        title: 'EMR Integration',
        desc: 'All patient data and call transcripts are securely logged into your existing system.',
        icon: Database,
        color: 'text-[#06B6D4]', // Cyan
        bg: 'bg-[#06B6D4]/10',
        border: 'border-[#06B6D4]/20'
    }
];

export function AIFlowSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.flow-card', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-32 bg-[#0B1221] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="mb-20 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#1ABC9C] mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#1ABC9C] animate-pulse" />
                        Seamless Workflow
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                        How MedVoice books <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B7BE4] to-[#1ABC9C]">
                            appointments automatically.
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                        A seamless, AI-driven workflow that feels just like a human receptionist, but faster, error-free, and available 24/7.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flow-card group relative p-8 rounded-3xl bg-[#111827] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Background Number */}
                            <div className="absolute top-4 right-6 text-6xl font-bold text-white/[0.03] select-none group-hover:text-white/[0.06] transition-colors">
                                {step.id}
                            </div>

                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110", step.bg, step.border, "border")}>
                                <step.icon className={cn("w-7 h-7", step.color)} strokeWidth={1.5} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#2B7BE4] transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
