/**
 * Clinical Minimalism Landing Page
 * A HIPAA-ready medical SaaS product page communicating trust, calm, and premium reliability.
 * Aesthetic: Apple-inspired medical clean, soft gradients, rounded corners.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Shield, Activity, Clock, Users, Check, ArrowRight,
    Play, Star, Lock, Stethoscope, Phone, Calendar,
    FileText, BarChart, ChevronRight, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/utils/cn";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ========== DESIGN TOKENS ==========
const tokens = {
    colors: {
        primary: '#2BB59B', // Teal/Green
        secondary: '#D7EAFB', // Soft Blue
        text: {
            main: '#111827', // Gray 900
            muted: '#4B5563', // Gray 600
            light: '#9CA3AF', // Gray 400
        },
        bg: {
            white: '#FFFFFF',
            soft: '#F8FAFC', // Slate 50
        }
    },
    radius: 'rounded-3xl', // 24px
    shadow: 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
};

// ========== COMPONENTS ==========

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
        "bg-[#D7EAFB]/50 text-[#1B5E7A] border border-[#D7EAFB]",
        className
    )}>
        {children}
    </div>
);

const SectionHeader = ({ badge, title, subtitle, align = "center" }: { badge?: string, title: React.ReactNode, subtitle?: string, align?: "center" | "left" }) => (
    <div className={cn("mb-16", align === "center" ? "text-center" : "text-left")}>
        {badge && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn("mb-6", align === "center" && "flex justify-center")}
            >
                <Badge>{badge}</Badge>
            </motion.div>
        )}
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6"
        >
            {title}
        </motion.h2>
        {subtitle && (
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
            >
                {subtitle}
            </motion.p>
        )}
    </div>
);

// ========== SECTIONS ==========

// 1. HERO SECTION
const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-element", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
            {/* Soft Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#D7EAFB]/30 rounded-[100%] blur-3xl -z-10 pointer-events-none" />

            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="hero-element flex justify-center mb-8">
                        <Badge className="bg-white/80 backdrop-blur-sm shadow-sm">
                            <Shield className="w-4 h-4 text-[#2BB59B]" />
                            HIPAA-Ready Voice AI for Clinics
                        </Badge>
                    </div>

                    <h1 className="hero-element text-6xl md:text-7xl font-semibold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                        Simply automate <br />
                        <span className="text-[#2BB59B]">your appointments.</span>
                    </h1>

                    <p className="hero-element text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        24/7 call automation that feels human. Reduce admin work,
                        eliminate no-shows, and give your staff their time back.
                    </p>

                    <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Button className="h-14 px-8 rounded-full bg-[#2BB59B] hover:bg-[#249A84] text-white text-lg font-medium shadow-lg shadow-[#2BB59B]/20 transition-all hover:scale-105">
                            Start Free Trial
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 text-lg font-medium">
                            <Play className="w-4 h-4 mr-2 fill-current" />
                            See How It Works
                        </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="hero-element grid grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-slate-100 pt-8">
                        {[
                            { label: "HIPAA Compliant", value: "100%" },
                            { label: "Calls Handled", value: "2M+" },
                            { label: "Setup Time", value: "< 5m" },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Device Mockup */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-20 relative mx-auto max-w-5xl"
                >
                    <div className="relative rounded-t-[2.5rem] bg-white border border-slate-200 shadow-2xl overflow-hidden aspect-[16/10]">
                        <div className="absolute inset-0 bg-slate-50/50" />
                        {/* Mock UI Content */}
                        <div className="relative p-8 md:p-12 grid grid-cols-12 gap-8 h-full">
                            {/* Sidebar */}
                            <div className="col-span-3 hidden md:block space-y-4">
                                <div className="h-8 w-32 bg-slate-200 rounded-full mb-8" />
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-full bg-white rounded-xl border border-slate-100 shadow-sm" />
                                ))}
                            </div>
                            {/* Main Content */}
                            <div className="col-span-12 md:col-span-9 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="h-8 w-48 bg-slate-200 rounded-full" />
                                    <div className="h-10 w-10 bg-[#2BB59B] rounded-full" />
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                                            <div className="h-8 w-8 bg-[#D7EAFB] rounded-full mb-3" />
                                            <div className="h-4 w-20 bg-slate-100 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                                <div className="h-64 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-slate-100 rounded-full" />
                                                <div className="flex-1 h-10 bg-slate-50 rounded-xl" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// 2. TRUSTED BY SECTION
const TrustedBySection = () => {
    const logos = ["Mayo Clinic", "Cleveland Clinic", "Kaiser Permanente", "Mount Sinai", "Johns Hopkins"];

    return (
        <section className="py-12 border-b border-slate-100 bg-white">
            <div className="container mx-auto px-6">
                <p className="text-center text-sm font-medium text-slate-400 mb-8">TRUSTED BY LEADING HEALTHCARE PROVIDERS</p>
                <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {logos.map((logo, i) => (
                        <span key={i} className="text-xl font-semibold text-slate-400">{logo}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 3. FEATURES BENTO SECTION
const FeaturesBento = () => {
    const features = [
        {
            title: "Smart Scheduling",
            desc: "AI that understands complex calendar rules.",
            icon: <Calendar className="w-6 h-6 text-[#2BB59B]" />,
            col: "col-span-1 md:col-span-2",
            bg: "bg-[#F0FDF4]" // Soft Green
        },
        {
            title: "Call Summaries",
            desc: "Instant transcripts & SOAP notes.",
            icon: <FileText className="w-6 h-6 text-blue-500" />,
            col: "col-span-1",
            bg: "bg-[#EFF6FF]" // Soft Blue
        },
        {
            title: "Analytics Dashboard",
            desc: "Track volume, outcomes, and patient sentiment.",
            icon: <BarChart className="w-6 h-6 text-purple-500" />,
            col: "col-span-1",
            bg: "bg-[#FAF5FF]" // Soft Purple
        },
        {
            title: "24/7 Availability",
            desc: "Never miss a patient call, even after hours.",
            icon: <Clock className="w-6 h-6 text-orange-500" />,
            col: "col-span-1 md:col-span-2",
            bg: "bg-[#FFF7ED]" // Soft Orange
        },
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <SectionHeader
                    badge="Capabilities"
                    title="Complete practice automation."
                    subtitle="Everything you need to modernize your front desk operations."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={cn(
                                "p-8 rounded-3xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-all",
                                f.col
                            )}
                        >
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", f.bg)}>
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{f.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 4. HOW IT WORKS SECTION
const HowItWorks = () => {
    const steps = [
        {
            num: "01",
            title: "Connect Your Phone",
            desc: "Forward missed calls to your dedicated AI number.",
            icon: <Phone className="w-6 h-6" />
        },
        {
            num: "02",
            title: "AI Handles Triage",
            desc: "Our agent screens urgent needs and books slots.",
            icon: <Activity className="w-6 h-6" />
        },
        {
            num: "03",
            title: "Syncs to EHR",
            desc: "Appointments appear instantly in your calendar.",
            icon: <Check className="w-6 h-6" />
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <SectionHeader
                    badge="Workflow"
                    title="Seamless integration."
                    subtitle="Up and running in less than 5 minutes."
                />

                <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-slate-100 -z-10" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white"
                        >
                            <div className="w-24 h-24 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm mb-6 mx-auto relative z-10">
                                <div className="w-12 h-12 bg-[#D7EAFB]/30 rounded-full flex items-center justify-center text-[#2BB59B]">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#2BB59B] text-white rounded-full flex items-center justify-center text-sm font-bold border-4 border-white">
                                    {step.num}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-center mb-3">{step.title}</h3>
                            <p className="text-slate-500 text-center leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 5. TESTIMONIALS SECTION
const Testimonials = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <SectionHeader
                    title="Loved by doctors."
                    subtitle="Join 500+ practices modernizing their patient experience."
                />

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[1, 2, 3].map((_, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                        >
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-[#2BB59B] fill-current" />)}
                            </div>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                "The voice AI is incredibly natural. Patients don't even realize they're talking to a computer. It's saved us 20 hours a week."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                                <div>
                                    <div className="font-semibold text-slate-900">Dr. Sarah Chen</div>
                                    <div className="text-sm text-slate-500">Medical Director</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 6. HIPAA SECTION
const HIPAASection = () => {
    return (
        <section className="py-24 bg-white border-y border-slate-100">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto bg-[#F8FAFC] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2BB59B] to-blue-500" />

                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-8">
                        <Lock className="w-8 h-8 text-[#2BB59B]" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">
                        Enterprise-grade security.
                    </h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12">
                        We exceed industry standards to keep your patient data safe.
                        Fully HIPAA compliant, SOC2 Type II certified, and end-to-end encrypted.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {["HIPAA Compliant", "SOC2 Type II", "256-bit Encryption", "BAA Included"].map((badge, i) => (
                            <div key={i} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-100 text-slate-600 font-medium">
                                <Check className="w-4 h-4 text-[#2BB59B]" />
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// 7. PRICING SECTION
const PricingSection = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <SectionHeader
                    badge="Pricing"
                    title="Simple, transparent plans."
                    subtitle="No hidden fees. Cancel anytime."
                />

                {/* Toggle */}
                <div className="flex justify-center items-center gap-4 mb-16">
                    <span className={cn("text-sm font-medium", !isYearly ? "text-slate-900" : "text-slate-500")}>Monthly</span>
                    <button
                        onClick={() => setIsYearly(!isYearly)}
                        className="w-14 h-8 bg-slate-200 rounded-full relative transition-colors duration-300 data-[state=checked]:bg-[#2BB59B]"
                        data-state={isYearly ? "checked" : "unchecked"}
                    >
                        <motion.div
                            className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm"
                            animate={{ x: isYearly ? 24 : 0 }}
                        />
                    </button>
                    <span className={cn("text-sm font-medium", isYearly ? "text-slate-900" : "text-slate-500")}>Yearly (Save 20%)</span>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { name: "Starter", price: 99, desc: "For solo practitioners." },
                        { name: "Clinic", price: 249, desc: "For growing practices.", popular: true },
                        { name: "Enterprise", price: "Custom", desc: "For hospitals & networks." }
                    ].map((plan, i) => (
                        <div
                            key={i}
                            className={cn(
                                "relative p-8 rounded-3xl bg-white border transition-all hover:shadow-lg",
                                plan.popular ? "border-[#2BB59B] shadow-md scale-105 z-10" : "border-slate-100 shadow-sm"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#2BB59B] text-white text-sm font-medium rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                            <p className="text-slate-500 text-sm mb-6">{plan.desc}</p>
                            <div className="mb-8">
                                <span className="text-4xl font-bold text-slate-900">
                                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                                </span>
                                {typeof plan.price === 'number' && <span className="text-slate-500">/mo</span>}
                            </div>
                            <Button className={cn(
                                "w-full rounded-full h-12 font-medium mb-8",
                                plan.popular ? "bg-[#2BB59B] hover:bg-[#249A84]" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                            )}>
                                Get Started
                            </Button>
                            <ul className="space-y-4">
                                {[1, 2, 3, 4].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                                        <Check className="w-4 h-4 text-[#2BB59B]" />
                                        Feature inclusion {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 8. USE CASES SECTION
const UseCases = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <SectionHeader title="Built for every specialty." />

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        { title: "Primary Care", icon: <Stethoscope /> },
                        { title: "Dental", icon: <Activity /> },
                        { title: "Telehealth", icon: <Phone /> }
                    ].map((uc, i) => (
                        <div key={i} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#2BB59B]/30 transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2BB59B] shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                {uc.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{uc.title}</h3>
                            <p className="text-slate-500 text-sm">Automate triage and scheduling for high-volume patient calls.</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 9. FINAL CTA
const FinalCTA = () => {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2BB59B]/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                    Ready to modernize <br /> your practice?
                </h2>
                <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                    Start your 14-day free trial today. No credit card required.
                </p>
                <Button className="h-16 px-10 rounded-full bg-[#2BB59B] hover:bg-[#249A84] text-white text-xl font-medium shadow-lg shadow-[#2BB59B]/20 hover:scale-105 transition-all">
                    Start Free Trial
                </Button>
            </div>
        </section>
    );
};

// 10. FOOTER
const Footer = () => {
    return (
        <footer className="py-16 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 font-bold text-xl text-slate-900 mb-6">
                            <Shield className="w-6 h-6 text-[#2BB59B]" />
                            HealthVoice
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            The most trusted voice AI platform for healthcare providers.
                        </p>
                    </div>
                    {[
                        { title: "Product", links: ["Features", "Pricing", "Security", "Changelog"] },
                        { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
                        { title: "Legal", links: ["Privacy", "Terms", "HIPAA", "BAA"] }
                    ].map((col, i) => (
                        <div key={i}>
                            <h4 className="font-semibold text-slate-900 mb-4">{col.title}</h4>
                            <ul className="space-y-3">
                                {col.links.map(l => (
                                    <li key={l}>
                                        <a href="#" className="text-slate-500 hover:text-[#2BB59B] text-sm transition-colors">{l}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 text-sm text-slate-400">
                    <p>© 2024 HealthVoice AI. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-slate-600">Twitter</a>
                        <a href="#" className="hover:text-slate-600">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// NAVBAR COMPONENT
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isScrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-100 py-4" : "bg-transparent py-6"
        )}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <Shield className="w-6 h-6 text-[#2BB59B]" />
                    HealthVoice
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {["Features", "How it Works", "Pricing", "Security"].map(l => (
                        <a key={l} href="#" className="text-sm font-medium text-slate-600 hover:text-[#2BB59B] transition-colors">
                            {l}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900">
                        Log in
                    </Link>
                    <Button className="rounded-full bg-[#111827] hover:bg-slate-800 text-white px-6">
                        Get Started
                    </Button>
                </div>
            </div>
        </nav>
    );
};

// MAIN PAGE LAYOUT
const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#D7EAFB] selection:text-[#1B5E7A]">
            <Navbar />
            <main>
                <HeroSection />
                <TrustedBySection />
                <FeaturesBento />
                <HowItWorks />
                <Testimonials />
                <HIPAASection />
                <PricingSection />
                <UseCases />
                <FinalCTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
