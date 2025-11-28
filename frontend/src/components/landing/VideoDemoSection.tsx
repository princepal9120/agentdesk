'use client';

import { useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function VideoDemoSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(videoRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                scale: 0.95,
                duration: 1,
                ease: 'power3.out'
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-[#F7FAFC] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6 tracking-tight">
                        See MedVoice in Action
                    </h2>
                    <p className="text-lg text-[#6B7280]">
                        Watch how our AI receptionist handles complex patient calls with ease, ensuring no appointment is missed.
                    </p>
                </div>

                <div
                    ref={videoRef}
                    className="relative max-w-5xl mx-auto aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 group cursor-pointer"
                >
                    {/* Video Placeholder / Thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        {/* Abstract UI Mockup in Background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-10 left-10 right-10 bottom-20 bg-white rounded-xl" />
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-700" />
                        </div>

                        <div className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                            <div className="w-16 h-16 bg-[#2B7BE4] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Play className="w-6 h-6 text-white fill-current ml-1" />
                            </div>
                        </div>
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
