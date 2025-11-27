'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Calendar, Phone, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);
    const heroVisualRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Premium Easing
            const entranceEase = "power3.out";
            const floatEase = "sine.inOut";

            // Hero Content Animation - Staggered Entrance
            const tl = gsap.timeline({ defaults: { ease: entranceEase } });

            tl.fromTo(
                '.hero-badge',
                { y: 20, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 1, ease: "expo.out" }
            )
                .fromTo(
                    '.hero-title .word',
                    { y: 50, opacity: 0, rotateX: 10 },
                    { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.05, ease: "expo.out" },
                    '-=0.8'
                )
                .fromTo(
                    '.hero-desc',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1 },
                    '-=0.8'
                )
                .fromTo(
                    '.hero-cta',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
                    '-=0.8'
                )
                .fromTo(
                    '.hero-trust',
                    { opacity: 0 },
                    { opacity: 1, duration: 1 },
                    '-=0.6'
                );

            // Hero Visual Animation (3D Float & Scale)
            gsap.fromTo(
                '.hero-visual-card',
                { y: 100, opacity: 0, scale: 0.9, rotateX: 15, rotateY: -10 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    duration: 1.5,
                    stagger: 0.15,
                    ease: 'expo.out',
                    delay: 0.2,
                }
            );

            // Organic Floating Animation Loop
            gsap.to('.float-card-1', {
                y: '-=20',
                rotation: 2,
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: floatEase,
            });
            gsap.to('.float-card-2', {
                y: '+=25',
                rotation: -2,
                duration: 6,
                repeat: -1,
                yoyo: true,
                ease: floatEase,
                delay: 1,
            });
            gsap.to('.float-card-3', {
                y: '-=15',
                rotation: 1,
                duration: 5.5,
                repeat: -1,
                yoyo: true,
                ease: floatEase,
                delay: 0.5,
            });

            // Interactive Parallax
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const x = (clientX / window.innerWidth - 0.5) * 20;
                const y = (clientY / window.innerHeight - 0.5) * 20;

                gsap.to('.hero-visual-container', {
                    rotationY: x,
                    rotationX: -y,
                    duration: 1.5,
                    ease: 'power2.out',
                    transformPerspective: 1000,
                });
            };

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[110vh] pt-40 pb-32 overflow-hidden mesh-bg-light flex items-center"
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left Content */}
                    <div ref={heroContentRef} className="max-w-2xl relative z-20">
                        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-primary/10 text-primary text-sm font-semibold mb-8 shadow-sm hover:shadow-md transition-all duration-300 cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                            v2.0 Now Available
                            <span className="w-px h-3 bg-primary/20 mx-1" />
                            <span className="text-muted-foreground font-normal">AI Voice Agents</span>
                        </div>

                        <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[1.05] mb-8 text-balance">
                            <span className="inline-block word">Automate</span>{' '}
                            <span className="inline-block word">Your</span>{' '}
                            <span className="inline-block word text-gradient-premium">Practice</span>{' '}
                            <span className="inline-block word">With</span>{' '}
                            <span className="inline-block word">Voice</span>{' '}
                            <span className="inline-block word">AI</span>
                        </h1>

                        <p className="hero-desc text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg text-balance font-medium">
                            The first AI receptionist that handles scheduling, triage, and patient inquiries with human-level empathy.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 mb-12">
                            <Button className="hero-cta h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 group">
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hero-cta h-14 px-8 rounded-full border-border bg-white/50 backdrop-blur-sm text-foreground hover:bg-white text-lg font-medium gap-2 transition-all duration-300 hover:border-primary/20"
                            >
                                <Play size={18} className="fill-foreground" />
                                Watch Demo
                            </Button>
                        </div>

                        <div className="hero-trust flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <span>Trusted by 500+ Clinics</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div ref={heroVisualRef} className="relative hidden lg:block h-[800px] w-full">
                        <div className="hero-visual-container relative w-full h-full preserve-3d">

                            {/* Main Dashboard Interface */}
                            <div className="hero-visual-card absolute top-10 left-0 right-0 bottom-20 glass-panel rounded-3xl overflow-hidden z-10 shadow-2xl border-white/60">
                                {/* Window Controls */}
                                <div className="h-12 bg-white/50 border-b border-border/50 flex items-center px-6 gap-2 backdrop-blur-md">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-sm" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm" />
                                    <div className="ml-auto w-48 h-6 bg-slate-100/50 rounded-full" />
                                </div>

                                {/* Dashboard Content */}
                                <div className="p-8 grid grid-cols-12 gap-8 h-full bg-gradient-to-br from-slate-50/50 to-white/80">
                                    {/* Sidebar */}
                                    <div className="col-span-3 space-y-6">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                                            <div className="w-5 h-5 rounded bg-primary" />
                                        </div>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className={`h-10 w-full rounded-lg flex items-center gap-3 px-3 ${i === 1 ? 'bg-primary/5 text-primary' : 'text-slate-400'}`}>
                                                <div className={`w-5 h-5 rounded-md ${i === 1 ? 'bg-primary/20' : 'bg-slate-200'}`} />
                                                <div className={`h-2 rounded-full ${i === 1 ? 'w-20 bg-primary/20' : 'w-16 bg-slate-200'}`} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Main Area */}
                                    <div className="col-span-9 space-y-6">
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="space-y-2">
                                                <div className="h-6 w-48 bg-slate-900/10 rounded-lg" />
                                                <div className="h-4 w-32 bg-slate-900/5 rounded-lg" />
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-slate-200" />
                                        </div>

                                        {/* Calendar Grid */}
                                        <div className="grid grid-cols-2 gap-6">
                                            {[1, 2].map((col) => (
                                                <div key={col} className="space-y-4">
                                                    {[1, 2, 3].map((item) => (
                                                        <div key={item} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                            <div className="flex items-center gap-4 mb-3">
                                                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                                    <Calendar size={18} />
                                                                </div>
                                                                <div>
                                                                    <div className="h-3 w-24 bg-slate-900/10 rounded-full mb-1.5" />
                                                                    <div className="h-2 w-16 bg-slate-900/5 rounded-full" />
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <div className="h-6 w-16 rounded-md bg-green-50 text-green-600 text-[10px] font-bold flex items-center justify-center uppercase tracking-wider">Confirmed</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element 1: Live Call */}
                            <div className="hero-visual-card float-card-1 absolute top-20 -right-12 w-80 glass-panel rounded-2xl p-5 z-20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-white/80">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Phone size={24} />
                                        </div>
                                        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-foreground">Incoming Patient Call</div>
                                        <div className="text-xs text-muted-foreground font-medium">AI Agent Active • 00:24</div>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-green-500 rounded-full animate-pulse" />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                                        <span>Voice Analysis</span>
                                        <span>98% Accuracy</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element 2: Transcript */}
                            <div className="hero-visual-card float-card-2 absolute bottom-32 -left-16 w-80 glass-panel-dark rounded-2xl p-6 z-30 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-slate-700/50">
                                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                                    <span className="text-xs text-slate-300 font-mono tracking-widest uppercase">Live Transcript</span>
                                </div>
                                <div className="space-y-3 font-mono text-xs">
                                    <p className="text-slate-300 leading-relaxed">
                                        <span className="text-primary font-bold">AI:</span> Good morning, Dr. Smith's office. How can I help?
                                    </p>
                                    <p className="text-slate-400 leading-relaxed pl-4 border-l-2 border-slate-700">
                                        <span className="text-teal-400 font-bold">Patient:</span> I'd like to reschedule my appointment for next Tuesday.
                                    </p>
                                    <p className="text-slate-300 leading-relaxed">
                                        <span className="text-primary font-bold">AI:</span> I can help with that. Checking availability for Tuesday...
                                    </p>
                                </div>
                            </div>

                            {/* Floating Element 3: Success Notification */}
                            <div className="hero-visual-card float-card-3 absolute bottom-10 -right-8 w-72 glass-panel rounded-2xl p-4 z-20 flex items-center gap-4 shadow-xl">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-foreground">Appointment Booked</div>
                                    <div className="text-xs text-muted-foreground">Synced with EMR • Just now</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
