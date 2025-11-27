'use client';

import { useEffect, useRef } from 'react';
import { PhoneIncoming, MessageSquare, UserCheck, CalendarCheck, Bell, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        icon: PhoneIncoming,
        title: 'Incoming Call',
        desc: 'Patient calls your practice line. AI answers instantly, 24/7, with zero hold time.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
    },
    {
        icon: MessageSquare,
        title: 'Intelligent Screening',
        desc: 'AI asks clinical screening questions, verifies insurance, and collects patient details.',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
    },
    {
        icon: UserCheck,
        title: 'Real-time Availability',
        desc: 'AI checks provider schedules in real-time across multiple calendars to find open slots.',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
    },
    {
        icon: CalendarCheck,
        title: 'Instant Booking',
        desc: 'Appointment is booked directly into your EMR and synced to your dashboard instantly.',
        color: 'text-teal-400',
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/20',
    },
    {
        icon: Bell,
        title: 'Automated Reminders',
        desc: 'Patient receives automated SMS/Email confirmations and reminders to reduce no-shows.',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
    },
];

export function AIFlowSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const totalWidth = sliderRef.current?.scrollWidth || 0;
            const viewportWidth = window.innerWidth;

            if (window.innerWidth > 768) {
                gsap.to(sliderRef.current, {
                    x: () => -(totalWidth - viewportWidth + 100),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        pin: true,
                        scrub: 1,
                        start: 'top top',
                        end: () => `+=${totalWidth}`,
                        invalidateOnRefresh: true,
                    },
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="how-it-works" className="py-32 bg-[#05050A] text-white overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] opacity-40" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] opacity-40" />
            </div>

            <div className="container mx-auto px-4 md:px-6 mb-20 relative z-10">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-400 mb-6">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                        Seamless Workflow
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
                        How MedVoice books <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            appointments automatically.
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                        A seamless, AI-driven workflow that feels just like a human receptionist, but faster, error-free, and available 24/7.
                    </p>
                </div>
            </div>

            <div className="w-full overflow-x-hidden relative z-10 pl-4 md:pl-6">
                <div ref={sliderRef} className="flex gap-8 w-max">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-[380px] md:w-[480px] flex-shrink-0 p-10 rounded-[2rem] glass-panel-dark relative group transition-all duration-500 border border-white/5 hover:border-white/10",
                                "hover:bg-white/[0.03]"
                            )}
                        >
                            <div className="absolute top-8 right-8 text-8xl font-bold text-white/[0.02] pointer-events-none select-none group-hover:text-white/[0.05] transition-colors">
                                0{index + 1}
                            </div>

                            <div className={`w-16 h-16 rounded-2xl ${step.bg} ${step.border} border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ease-out`}>
                                <step.icon size={32} className={step.color} strokeWidth={1.5} />
                            </div>

                            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-200 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-slate-400 text-lg leading-relaxed group-hover:text-slate-300 transition-colors">
                                {step.desc}
                            </p>

                            <div className="mt-8 flex items-center text-sm font-medium text-slate-500 group-hover:text-blue-400 transition-colors">
                                Learn more <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                    {/* Spacer for end of scroll */}
                    <div className="w-[20vw]" />
                </div>
            </div>
        </section>
    );
}
