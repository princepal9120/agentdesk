/**
 * Landing Page - HealthVoice AI
 * A stunning, animated landing page for the AI Voice Agent system
 */

import React, { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, useInView } from 'motion/react';
import {
    Phone, Calendar, Shield, Mic,
    CheckCircle2, ArrowRight, Star, Play, Sparkles,
    MessageSquare, Bell, Brain, HeartPulse, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import LandingNavbar from '@/components/layout/LandingNavbar';

// ============== HERO SECTION ==============
const HeroSection: React.FC = () => {
    const words = ["appointments", "scheduling", "reminders", "healthcare"];
    const [currentWord, setCurrentWord] = React.useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-sm mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700">AI-Powered Healthcare Scheduling</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight"
                    >
                        Revolutionize Your <br />{' '}
                        <span className="relative">
                            <motion.span
                                key={currentWord}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                {words[currentWord]}
                            </motion.span>
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto"
                    >
                        Let our AI voice agent handle appointment booking, reminders, and patient communication 24/7.
                        Reduce no-shows by 40% and save 15+ hours per week.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link to="/register">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full border-2">
                            <Play className="mr-2 w-5 h-5" />
                            Watch Demo
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {[
                            { value: '50K+', label: 'Appointments Booked' },
                            { value: '98%', label: 'Patient Satisfaction' },
                            { value: '40%', label: 'Reduced No-Shows' },
                            { value: '24/7', label: 'AI Availability' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Hero Image/Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-20 max-w-5xl mx-auto"
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-slate-100 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="pt-8 p-6 bg-gradient-to-br from-slate-50 to-white min-h-[300px] flex items-center justify-center">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                                    <Mic className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-slate-600 text-lg">"Hi, I'd like to book an appointment with Dr. Smith for next Tuesday..."</p>
                                <div className="mt-4 flex justify-center gap-2">
                                    <div className="w-2 h-8 bg-blue-400 rounded-full animate-pulse" />
                                    <div className="w-2 h-12 bg-blue-500 rounded-full animate-pulse delay-75" />
                                    <div className="w-2 h-6 bg-blue-400 rounded-full animate-pulse delay-150" />
                                    <div className="w-2 h-10 bg-blue-600 rounded-full animate-pulse delay-100" />
                                    <div className="w-2 h-7 bg-blue-400 rounded-full animate-pulse delay-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ============== TRUSTED BY SECTION ==============
const TrustedBySection: React.FC = () => {
    const logos = [
        'Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins', 'Mass General',
        'Stanford Health', 'UCLA Health', 'NYU Langone', 'Mount Sinai'
    ];

    return (
        <section className="py-16 bg-white border-y border-slate-100">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-wider font-medium">
                    Trusted by leading healthcare providers
                </p>
                <div className="relative overflow-hidden">
                    <motion.div
                        className="flex gap-16 items-center"
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                        {[...logos, ...logos].map((logo, index) => (
                            <div key={index} className="flex-shrink-0 text-2xl font-bold text-slate-300 hover:text-slate-500 transition-colors whitespace-nowrap">
                                {logo}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============== FEATURES BENTO GRID ==============
const FeaturesSection: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const features = [
        {
            title: "AI Voice Agent",
            description: "Natural conversation AI that handles bookings, reschedules, and cancellations just like a human receptionist.",
            icon: <Mic className="w-6 h-6 text-blue-600" />,
            className: "md:col-span-2",
            header: (
                <div className="h-full min-h-[150px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                    <div className="flex gap-1">
                        {[...Array(7)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 bg-blue-500 rounded-full"
                                animate={{ height: [20, 40, 20] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: "Smart Scheduling",
            description: "Intelligent conflict detection and optimal slot recommendations based on doctor availability.",
            icon: <Calendar className="w-6 h-6 text-green-600" />,
            header: (
                <div className="h-full min-h-[150px] bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-green-400" />
                </div>
            ),
        },
        {
            title: "Automated Reminders",
            description: "SMS, email, and voice call reminders reduce no-shows by up to 40%.",
            icon: <Bell className="w-6 h-6 text-amber-600" />,
            header: (
                <div className="h-full min-h-[150px] bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                        <Bell className="w-16 h-16 text-amber-400" />
                    </motion.div>
                </div>
            ),
        },
        {
            title: "HIPAA Compliant",
            description: "Enterprise-grade security with AES-256 encryption and full audit logging for all PHI.",
            icon: <Shield className="w-6 h-6 text-purple-600" />,
            header: (
                <div className="h-full min-h-[150px] bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-16 h-16 text-purple-400" />
                </div>
            ),
        },
        {
            title: "Real-time Analytics",
            description: "Track appointment metrics, no-show rates, revenue, and patient satisfaction in real-time.",
            icon: <Zap className="w-6 h-6 text-rose-600" />,
            className: "md:col-span-2",
            header: (
                <div className="h-full min-h-[150px] bg-gradient-to-br from-rose-50 to-pink-100 rounded-lg flex items-center justify-center p-4">
                    <div className="w-full max-w-xs">
                        <div className="flex items-end gap-2 h-24">
                            {[40, 65, 45, 80, 55, 70, 90].map((height, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-rose-400 to-pink-300 rounded-t"
                                    initial={{ height: 0 }}
                                    animate={isInView ? { height: `${height}%` } : {}}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section ref={ref} className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Everything you need to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            automate scheduling
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Powerful features designed for modern healthcare practices
                    </p>
                </motion.div>

                <BentoGrid className="max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <BentoGridItem
                                title={feature.title}
                                description={feature.description}
                                header={feature.header}
                                icon={feature.icon}
                                className={feature.className}
                            />
                        </motion.div>
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
};

// ============== HOW IT WORKS SECTION ==============
const HowItWorksSection: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const steps = [
        {
            number: "01",
            title: "Patient Calls or Uses Web",
            description: "Patients can call your AI voice line 24/7 or book through the web portal anytime.",
            icon: <Phone className="w-8 h-8" />,
        },
        {
            number: "02",
            title: "AI Handles the Conversation",
            description: "Our AI understands intent, checks availability, and books the appointment naturally.",
            icon: <Brain className="w-8 h-8" />,
        },
        {
            number: "03",
            title: "Confirmations & Reminders",
            description: "Automatic SMS, email, and voice reminders ensure patients show up on time.",
            icon: <MessageSquare className="w-8 h-8" />,
        },
    ];

    return (
        <section ref={ref} className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        How it works
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Get started in minutes, not weeks
                    </p>
                </motion.div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="relative"
                            >
                                {/* Connection line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />
                                )}

                                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow relative z-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
                                        {step.icon}
                                    </div>
                                    <div className="text-sm font-bold text-blue-600 mb-2">{step.number}</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                    <p className="text-slate-600">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ============== TESTIMONIALS SECTION ==============
const TestimonialsSection: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const testimonials = [
        {
            quote: "HealthVoice reduced our no-show rate from 25% to just 8%. The ROI was immediate and substantial.",
            author: "Dr. Sarah Chen",
            role: "Medical Director",
            clinic: "Bay Area Family Medicine",
            rating: 5,
        },
        {
            quote: "Our front desk staff now focuses on patient care instead of answering phones all day. Game changer!",
            author: "Michael Rodriguez",
            role: "Practice Manager",
            clinic: "Sunrise Cardiology",
            rating: 5,
        },
        {
            quote: "Patients love that they can book appointments at 2 AM. Our after-hours bookings increased 300%.",
            author: "Dr. Emily Watson",
            role: "Owner",
            clinic: "Downtown Dermatology",
            rating: 5,
        },
    ];

    return (
        <section ref={ref} className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Loved by healthcare providers
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        See what our customers have to say
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-white text-lg mb-6">"{testimonial.quote}"</p>
                            <div>
                                <div className="font-semibold text-white">{testimonial.author}</div>
                                <div className="text-slate-400 text-sm">{testimonial.role}</div>
                                <div className="text-slate-500 text-sm">{testimonial.clinic}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============== PRICING SECTION ==============
const PricingSection: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const plans = [
        {
            name: "Starter",
            price: 99,
            description: "Perfect for small practices",
            features: [
                "Up to 200 appointments/month",
                "AI voice agent (business hours)",
                "SMS reminders",
                "Basic analytics",
                "Email support",
            ],
        },
        {
            name: "Professional",
            price: 249,
            description: "For growing practices",
            popular: true,
            features: [
                "Up to 1,000 appointments/month",
                "24/7 AI voice agent",
                "SMS + Email + Voice reminders",
                "Advanced analytics",
                "Priority support",
                "Custom voice persona",
            ],
        },
        {
            name: "Enterprise",
            price: null,
            description: "For large healthcare systems",
            features: [
                "Unlimited appointments",
                "Multi-location support",
                "Custom integrations",
                "Dedicated account manager",
                "SLA guarantee",
                "HIPAA BAA included",
            ],
        },
    ];

    return (
        <section ref={ref} className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Start free for 14 days. No credit card required.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className={`relative rounded-2xl p-8 ${plan.popular
                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl scale-105'
                                : 'bg-white border border-slate-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                {plan.name}
                            </h3>
                            <p className={`text-sm mb-4 ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
                                {plan.description}
                            </p>
                            <div className="mb-6">
                                {plan.price ? (
                                    <div className="flex items-baseline">
                                        <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                            ${plan.price}
                                        </span>
                                        <span className={`ml-2 ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
                                            /month
                                        </span>
                                    </div>
                                ) : (
                                    <div className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                        Custom
                                    </div>
                                )}
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle2 className={`w-5 h-5 mt-0.5 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`} />
                                        <span className={plan.popular ? 'text-blue-50' : 'text-slate-600'}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className={`w-full ${plan.popular
                                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============== CTA SECTION ==============
const CTASection: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                    animate={{ y: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                    animate={{ y: [0, -50, 0], opacity: [0.2, 0.1, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to transform your practice?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Join 500+ healthcare providers who have already automated their scheduling.
                        Start your free 14-day trial today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-full">
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full">
                            Schedule Demo
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ============== FOOTER SECTION ==============
const FooterSection: React.FC = () => {
    const links = {
        Product: ['Features', 'Pricing', 'Integrations', 'API'],
        Company: ['About', 'Blog', 'Careers', 'Press'],
        Resources: ['Documentation', 'Help Center', 'Status', 'Contact'],
        Legal: ['Privacy', 'Terms', 'HIPAA', 'Security'],
    };

    return (
        <footer className="bg-slate-900 text-slate-400 py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-5 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 text-white text-xl font-bold mb-4">
                            <HeartPulse className="w-8 h-8 text-blue-500" />
                            HealthVoice
                        </div>
                        <p className="text-sm">
                            AI-powered appointment scheduling for modern healthcare.
                        </p>
                    </div>
                    {Object.entries(links).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="text-white font-semibold mb-4">{category}</h3>
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-white transition-colors text-sm">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm">© 2024 HealthVoice. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// ============== MAIN LANDING PAGE ==============
const Landing: React.FC = () => {
    return (
        <div className="min-h-screen">
            <LandingNavbar />
            <HeroSection />
            <TrustedBySection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <PricingSection />
            <CTASection />
            <FooterSection />
        </div>
    );
};

export default Landing;
