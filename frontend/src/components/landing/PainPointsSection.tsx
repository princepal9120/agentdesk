'use client';

import { useEffect, useRef } from 'react';
import { PhoneOff, CalendarX, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const painPoints = [
    {
        icon: PhoneOff,
        title: 'Stop drowning in phone calls',
        desc: 'AI handles 24/7 scheduling requests so your front desk can focus on patients, not ringtones.',
        color: 'text-red-500',
        bg: 'bg-red-50',
    },
    {
        icon: CalendarX,
        title: 'Reduce no-shows by 15%',
        desc: 'Automated reminders and predictive confirmation models ensure your slots stay full.',
        color: 'text-orange-500',
        bg: 'bg-orange-50',
    },
    {
        icon: Clock,
        title: '100% visibility of your day',
        desc: 'Real-time calendar synced across your entire team. No more double-booking or confusion.',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
    },
];

export function PainPointsSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.pain-card', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Healthcare teams are overwhelmed. <br />
                        <span className="text-blue-600">MedVoice fixes the ops overload.</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        We replace chaos with clarity by automating the most repetitive parts of your practice.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {painPoints.map((point, index) => (
                        <div
                            key={index}
                            className="pain-card group p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 rounded-xl ${point.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <point.icon className={`w-7 h-7 ${point.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {point.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {point.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
