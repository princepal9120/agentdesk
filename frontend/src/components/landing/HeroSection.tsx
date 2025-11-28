'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Play, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

            tl.fromTo(
                '.hero-badge',
                { y: 20, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 1 }
            )
                .fromTo(
                    '.hero-title .word',
                    { y: 50, opacity: 0, rotateX: -20 },
                    { y: 0, opacity: 1, rotateX: 0, stagger: 0.05, duration: 1.2 },
                    "-=0.6"
                )
                .fromTo(
                    '.hero-desc',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1 },
                    "-=0.8"
                )
                .fromTo(
                    '.hero-cta',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 1 },
                    "-=0.8"
                )
                .fromTo(
                    '.hero-visual',
                    { y: 100, opacity: 0, scale: 0.9, rotateX: 10 },
                    { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: "power3.out" },
                    "-=1"
                );

            // Floating animations for visual elements
            gsap.to('.float-element-1', {
                y: -15,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            gsap.to('.float-element-2', {
                y: -20,
                duration: 3.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 0.5
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[90vh] pt-32 pb-20 overflow-hidden bg-[#0B1221] text-white"
        >
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#2B7BE4]/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#1ABC9C]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <div className="max-w-2xl">
                        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-[#1ABC9C] mb-8 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1ABC9C] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1ABC9C]"></span>
                            </span>
                            New: AI Voice 2.0 is live
                        </div>

                        <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-balance">
                            <span className="inline-block word">AI-Powered</span>{' '}
                            <span className="inline-block word text-transparent bg-clip-text bg-gradient-to-r from-[#2B7BE4] to-[#1ABC9C]">
                                Receptionist
                            </span>{' '}
                            <br />
                            <span className="inline-block word">for Healthcare</span>
                        </h1>

                        <p className="hero-desc text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
                            Automate appointment booking, patient triage, and follow-ups with a voice agent that sounds human and integrates with your EHR.
                        </p>

                        <div className="hero-cta flex flex-col sm:flex-row gap-4 mb-12">
                            <Button size="lg" className="bg-[#2B7BE4] hover:bg-[#1d6ad2] text-white rounded-full px-8 h-12 text-base shadow-lg shadow-blue-900/20">
                                Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-12 text-base backdrop-blur-sm">
                                <Play className="mr-2 w-4 h-4 fill-current" /> Watch Demo
                            </Button>
                        </div>

                        <div className="hero-cta flex items-center gap-6 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#1ABC9C]" />
                                <span>HIPAA Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#1ABC9C]" />
                                <span>24/7 Availability</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#1ABC9C]" />
                                <span>No Credit Card</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="hero-visual relative lg:h-[600px] flex items-center justify-center perspective-1000">
                        {/* Main Dashboard Card */}
                        <div className="relative w-full max-w-[500px] aspect-[4/5] bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-blue-900/50 overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-500">
                            {/* Header */}
                            <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="text-xs font-medium text-slate-400">MedVoice Dashboard</div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Stat Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-[#2B7BE4]/10 border border-[#2B7BE4]/20">
                                        <div className="text-[#2B7BE4] mb-2"><Star size={20} /></div>
                                        <div className="text-2xl font-bold text-white">4.9/5</div>
                                        <div className="text-xs text-slate-400">Patient Satisfaction</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#1ABC9C]/10 border border-[#1ABC9C]/20">
                                        <div className="text-[#1ABC9C] mb-2"><ShieldCheck size={20} /></div>
                                        <div className="text-2xl font-bold text-white">100%</div>
                                        <div className="text-xs text-slate-400">HIPAA Secure</div>
                                    </div>
                                </div>

                                {/* Incoming Call Card */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm font-medium text-slate-300">Live Call Analysis</div>
                                        <div className="px-2 py-1 rounded text-[10px] bg-green-500/20 text-green-400 animate-pulse">Active</div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">AI</div>
                                            <div className="flex-1 p-2 rounded-lg bg-[#2B7BE4]/20 text-xs text-slate-200">
                                                Hello, this is MedVoice. How can I help you schedule an appointment today?
                                            </div>
                                        </div>
                                        <div className="flex gap-3 flex-row-reverse">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-300">Pt</div>
                                            <div className="flex-1 p-2 rounded-lg bg-white/5 text-xs text-slate-300">
                                                Hi, I need to see Dr. Smith for a check-up next Tuesday.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule Preview */}
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-slate-400">Upcoming</div>
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex flex-col items-center justify-center text-xs border border-white/10">
                                                <span className="font-bold text-white">1{i}</span>
                                                <span className="text-[10px] text-slate-500">NOV</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-200">New Patient Consult</div>
                                                <div className="text-xs text-slate-500">09:30 AM • 45 min</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="float-element-1 absolute -right-8 top-20 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl max-w-[200px]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs font-medium text-white">Appointment Booked</span>
                            </div>
                            <p className="text-xs text-slate-300">Sarah J. confirmed for Tuesday at 10 AM.</p>
                        </div>

                        <div className="float-element-2 absolute -left-8 bottom-32 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl max-w-[200px]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 rounded-lg bg-[#2B7BE4] text-white">
                                    <Play size={10} fill="currentColor" />
                                </div>
                                <span className="text-xs font-medium text-white">Voice Demo</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-[#2B7BE4]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
