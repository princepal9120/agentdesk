'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Mic, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

const demos = [
    {
        id: 'human',
        label: 'Standard Voicemail',
        duration: '0:45',
        color: 'bg-slate-100',
        waveColor: 'bg-slate-400',
        iconColor: 'text-slate-500',
        icon: Volume2
    },
    {
        id: 'ai',
        label: 'MedVoice AI Agent',
        duration: '0:32',
        color: 'bg-primary/5',
        waveColor: 'bg-primary',
        iconColor: 'text-primary',
        isPremium: true,
        icon: Sparkles
    },
];

export function AudioDemoSection() {
    const [playing, setPlaying] = useState<string | null>(null);

    const togglePlay = (id: string) => {
        if (playing === id) {
            setPlaying(null);
        } else {
            setPlaying(id);
        }
    };

    return (
        <section className="py-32 bg-slate-50/50 overflow-hidden relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                        Hear the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Difference</span>
                    </h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Don't settle for robotic voicemails. Experience the natural, conversational flow of MedVoice AI.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {demos.map((demo) => (
                        <div
                            key={demo.id}
                            className={cn(
                                "relative p-8 rounded-[2rem] border transition-all duration-500 group",
                                demo.isPremium
                                    ? "bg-white border-primary/20 shadow-2xl shadow-primary/10 scale-105 z-10"
                                    : "bg-white/50 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-lg"
                            )}
                        >
                            {demo.isPremium && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-primary/30 flex items-center gap-2">
                                    <Sparkles size={12} /> Recommended
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-5">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", demo.color)}>
                                        <demo.icon size={28} className={demo.iconColor} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{demo.label}</h3>
                                        <p className="text-sm text-slate-500 font-medium">Sample Recording</p>
                                    </div>
                                </div>
                                <div className="text-sm font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{demo.duration}</div>
                            </div>

                            {/* Audio Visualizer */}
                            <div className="flex items-center justify-center gap-1.5 h-24 mb-10 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                                {[...Array(35)].map((_, i) => (
                                    <WaveBar
                                        key={i}
                                        isPlaying={playing === demo.id}
                                        index={i}
                                        color={playing === demo.id ? demo.waveColor : 'bg-slate-200'}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => togglePlay(demo.id)}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 text-lg",
                                    playing === demo.id
                                        ? "bg-slate-900 text-white shadow-xl scale-[1.02]"
                                        : "bg-white border-2 border-slate-100 text-slate-600 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                                )}
                            >
                                {playing === demo.id ? (
                                    <>
                                        <Pause size={22} className="fill-current" /> Pause Playback
                                    </>
                                ) : (
                                    <>
                                        <Play size={22} className="fill-current" /> Play Sample
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WaveBar({ isPlaying, index, color }: { isPlaying: boolean; index: number; color: string }) {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!barRef.current) return;

        if (isPlaying) {
            gsap.to(barRef.current, {
                height: gsap.utils.random(20, 100) + '%',
                duration: 0.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.03,
            });
        } else {
            gsap.to(barRef.current, {
                height: '15%',
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true
            });
        }
    }, [isPlaying, index]);

    return (
        <div
            ref={barRef}
            className={cn("w-1.5 rounded-full transition-colors duration-300", color)}
            style={{ height: '15%' }}
        />
    );
}
