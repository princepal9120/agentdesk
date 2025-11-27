'use client';

import { Star, Activity, Heart, Stethoscope, ShieldCheck, Cross } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const testimonials = [
    {
        quote: "We reduced front desk workload by nearly 40% in the first month. The AI handles the routine calls perfectly.",
        author: "Dr. Sarah Chen",
        role: "Dallas Dental Care",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
        quote: "MedVoice’s AI books appointments more accurately than our old staff. It's been a game changer for our clinic.",
        author: "James Wilson",
        role: "Lakeside Family Practice",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100"
    }
];

const partners = [
    { name: "HealthFirst", icon: Activity },
    { name: "MediCare+", icon: Cross },
    { name: "DocConnect", icon: Stethoscope },
    { name: "CarePoint", icon: Heart },
    { name: "SecureHealth", icon: ShieldCheck },
    { name: "DentalPlus", icon: Activity },
    { name: "HealthFirst", icon: Activity },
    { name: "MediCare+", icon: Cross },
    { name: "DocConnect", icon: Stethoscope },
    { name: "CarePoint", icon: Heart },
    { name: "SecureHealth", icon: ShieldCheck },
    { name: "DentalPlus", icon: Activity },
];

export function SocialProof() {
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(marqueeRef.current, {
                xPercent: -50,
                repeat: -1,
                duration: 20,
                ease: "linear",
            });
        }, marqueeRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="testimonials" className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={20} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <blockquote className="text-xl text-slate-900 font-medium leading-relaxed mb-6">
                                "{t.quote}"
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                                    <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{t.author}</div>
                                    <div className="text-sm text-slate-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mb-10">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                        Trusted by 500+ Healthcare Providers
                    </p>
                </div>

                <div className="relative w-full max-w-5xl mx-auto overflow-hidden mask-linear-fade">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10" />

                    <div ref={marqueeRef} className="flex items-center gap-16 w-max">
                        {partners.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default group">
                                <p.icon size={24} className="text-blue-600" />
                                <span className="text-xl font-bold text-slate-700 group-hover:text-blue-900">{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
