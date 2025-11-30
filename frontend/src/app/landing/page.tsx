'use client';

import { useState } from 'react';
import {
    Phone,
    Calendar,
    Clock,
    Shield,
    Zap,
    Globe,
    BarChart3,
    CheckCircle2,
    ArrowRight,
    Star,
    Users,
    TrendingUp,
    MessageSquare,
    ChevronDown,
    Menu,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Note: Metadata is defined in metadata.ts for SEO optimization

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                MedVoice
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
                            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
                            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</a>
                            <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">FAQ</a>
                            <Link href="/login">
                                <Button variant="ghost" className="text-gray-700">Sign In</Button>
                            </Link>
                            <a href="#demo">
                                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                                    Start Free Trial
                                </Button>
                            </a>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 space-y-3 border-t border-blue-100">
                            <a href="#features" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
                            <a href="#testimonials" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
                            <a href="#pricing" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</a>
                            <a href="#faq" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">FAQ</a>
                            <Link href="/login" className="block">
                                <Button variant="ghost" className="w-full text-gray-700">Sign In</Button>
                            </Link>
                            <a href="#demo" className="block">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white">
                                    Start Free Trial
                                </Button>
                            </a>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-transparent to-green-100/50" />
                <div className="max-w-7xl mx-auto relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-fade-in">
                            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                                <Zap className="w-4 h-4" />
                                <span>AI-Powered Healthcare Scheduling</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                AI Voice Agent for{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                    Healthcare Scheduling
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed">
                                Never miss a call—automate your clinic's appointments, save thousands in missed revenue,
                                and reduce staff burnout with MedVoice's voice AI.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="#demo">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6 group"
                                    >
                                        Start Free Trial
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </a>
                                <a href="#demo">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
                                    >
                                        See Demo
                                    </Button>
                                </a>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center gap-6 pt-4">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span className="text-sm text-gray-600">HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span className="text-sm text-gray-600">Epic & Athena Integration</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span className="text-sm text-gray-600">24/7 Availability</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-green-400/20 blur-3xl" />
                            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg animate-pulse-slow">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                                            <Phone className="w-6 h-6 text-white animate-bounce-slow" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-600">Incoming Call</div>
                                            <div className="font-semibold text-gray-900">Patient: Sarah Johnson</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-3 flex-1">
                                                <p className="text-sm text-gray-700">"I'd like to schedule an appointment with Dr. Smith"</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Zap className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-3 flex-1">
                                                <p className="text-sm text-gray-700">"I have availability on Tuesday at 2 PM or Thursday at 10 AM. Which works better for you?"</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                                <span className="font-semibold text-gray-900">Appointment Booked</span>
                                            </div>
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            Tuesday, Nov 28 at 2:00 PM
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-4xl md:text-5xl font-bold">25%</div>
                            <div className="text-blue-100">Reduction in No-Shows</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl md:text-5xl font-bold">40+</div>
                            <div className="text-blue-100">Staff Hours Saved/Month</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl md:text-5xl font-bold">99.9%</div>
                            <div className="text-blue-100">Uptime Guarantee</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl md:text-5xl font-bold">$50K+</div>
                            <div className="text-blue-100">Avg. Revenue Recovered</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Markers */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Trusted by Healthcare Providers
                        </h2>
                        <p className="text-xl text-gray-600">
                            Built with security, compliance, and reliability at the core
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-200 hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">HIPAA Compliant</h3>
                            <p className="text-gray-600">
                                Full HIPAA compliance with end-to-end encryption and secure data handling
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center border border-green-200 hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">EHR Integration</h3>
                            <p className="text-gray-600">
                                Seamless integration with Epic, Athena, and other major EHR systems
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center border border-purple-200 hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Availability</h3>
                            <p className="text-gray-600">
                                Never miss a call with round-the-clock AI-powered scheduling
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Powerful Features for Modern Clinics
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to streamline scheduling and improve patient experience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Phone,
                                title: '24/7 Automated Voice Scheduling',
                                description: 'AI-powered voice agent handles appointment booking, rescheduling, and cancellations around the clock',
                                color: 'blue'
                            },
                            {
                                icon: Zap,
                                title: 'EHR Sync (Epic/Athena)',
                                description: 'Real-time synchronization with your existing EHR system for seamless workflow integration',
                                color: 'green'
                            },
                            {
                                icon: MessageSquare,
                                title: 'Intelligent Reminders',
                                description: 'Automated SMS and voice reminders reduce no-shows and keep patients informed',
                                color: 'purple'
                            },
                            {
                                icon: Globe,
                                title: 'Multi-Language Support',
                                description: 'Serve diverse patient populations with support for 40+ languages',
                                color: 'orange'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Urgent Triage Detection',
                                description: 'Smart AI identifies urgent cases and routes them appropriately',
                                color: 'red'
                            },
                            {
                                icon: BarChart3,
                                title: 'Seamless Dashboard',
                                description: 'Comprehensive analytics and reporting to optimize your practice',
                                color: 'indigo'
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 group hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Get started in minutes with our simple 4-step process
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Connect Your EHR',
                                description: 'Seamlessly integrate with your existing Epic, Athena, or other EHR system in minutes',
                                icon: Zap,
                                color: 'blue'
                            },
                            {
                                step: '02',
                                title: 'Customize Your AI',
                                description: 'Train the voice agent with your clinic\'s specific workflows, hours, and preferences',
                                icon: MessageSquare,
                                color: 'green'
                            },
                            {
                                step: '03',
                                title: 'Go Live',
                                description: 'Forward your phone line to MedVoice and start handling calls automatically',
                                icon: Phone,
                                color: 'purple'
                            },
                            {
                                step: '04',
                                title: 'Monitor & Optimize',
                                description: 'Track performance with real-time analytics and continuously improve results',
                                icon: BarChart3,
                                color: 'orange'
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                {/* Connector Line */}
                                {index < 3 && (
                                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-green-200 z-0" />
                                )}

                                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-2 z-10">
                                    <div className={`w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                                        <item.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-center mb-4">
                                        <span className="text-4xl font-bold text-gray-200">{item.step}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                                    <p className="text-gray-600 text-center leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <a href="#demo">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all"
                            >
                                Get Started Now
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Loved by Healthcare Professionals
                        </h2>
                        <p className="text-xl text-gray-600">
                            See what clinic owners and staff are saying about MedVoice
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Dr. Emily Chen',
                                role: 'Family Medicine, Portland Clinic',
                                image: '👩‍⚕️',
                                rating: 5,
                                text: 'MedVoice has been a game-changer for our practice. We\'ve recovered over $60K in missed appointments and our staff can finally focus on patient care instead of phone calls.'
                            },
                            {
                                name: 'Michael Rodriguez',
                                role: 'Practice Manager, HealthFirst Medical',
                                image: '👨‍💼',
                                rating: 5,
                                text: 'The Epic integration was seamless. Setup took less than a day and we saw immediate results. No-shows dropped by 30% in the first month alone.'
                            },
                            {
                                name: 'Dr. Sarah Williams',
                                role: 'Pediatrics, Sunshine Children\'s Clinic',
                                image: '👩‍⚕️',
                                rating: 5,
                                text: 'Parents love the 24/7 scheduling. They can book appointments at midnight if they want. The multi-language support has been incredible for our diverse community.'
                            }
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center space-x-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                                <div className="flex items-center space-x-3">
                                    <div className="text-4xl">{testimonial.image}</div>
                                    <div>
                                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600">
                            Choose the plan that fits your practice. All plans include 14-day free trial.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Starter Plan */}
                        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-xl">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                                <p className="text-gray-600">Perfect for small practices</p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-bold text-gray-900">$299</span>
                                    <span className="text-gray-600 ml-2">/month</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Up to 500 calls/month</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">24/7 AI voice scheduling</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Basic EHR integration</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">SMS reminders</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Email support</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Basic analytics</span>
                                </li>
                            </ul>
                            <a href="#demo">
                                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                                    Start Free Trial
                                </Button>
                            </a>
                        </div>

                        {/* Professional Plan - Featured */}
                        <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-8 border-2 border-blue-600 relative transform md:scale-105 shadow-2xl">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                                    MOST POPULAR
                                </span>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                                <p className="text-blue-100">For growing practices</p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-bold text-white">$599</span>
                                    <span className="text-blue-100 ml-2">/month</span>
                                </div>
                                <p className="text-sm text-blue-100 mt-2">Up to 2,000 calls/month</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-white font-medium">Everything in Starter, plus:</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-white">Advanced EHR integration (Epic, Athena)</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-white">Multi-language support (40+ languages)</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-white">Urgent triage detection</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-white">Priority phone support</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-white">Advanced analytics & reporting</span>
                                </li>
                            </ul>
                            <a href="#demo">
                                <Button className="w-full bg-white hover:bg-gray-100 text-blue-600 font-bold">
                                    Start Free Trial
                                </Button>
                            </a>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-green-400 transition-all hover:shadow-xl">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                                <p className="text-gray-600">For multi-location practices</p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-bold text-gray-900">Custom</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Unlimited calls</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 font-medium">Everything in Professional, plus:</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Custom EHR integrations</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Dedicated account manager</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Custom AI training</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">24/7 priority support</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">SLA guarantees</span>
                                </li>
                            </ul>
                            <a href="#demo">
                                <Button variant="outline" className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
                                    Contact Sales
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Pricing Features Comparison */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-600 mb-4">
                            All plans include HIPAA compliance, end-to-end encryption, and regular feature updates
                        </p>
                        <a href="#demo" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                            Compare all features
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Demo/Contact Form Section */}
            <section id="demo" className="py-20 bg-gradient-to-br from-blue-600 to-green-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Ready to Transform Your Practice?
                        </h2>
                        <p className="text-xl text-blue-100">
                            Start your free 14-day trial. No credit card required.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                                        placeholder="Dr. John Smith"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="clinic" className="block text-sm font-medium text-gray-700 mb-2">
                                        Clinic Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="clinic"
                                        name="clinic"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                                        placeholder="Your Clinic Name"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                                        placeholder="(555) 123-4567"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                                        placeholder="doctor@clinic.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="ehr" className="block text-sm font-medium text-gray-700 mb-2">
                                    Current EHR System
                                </label>
                                <select
                                    id="ehr"
                                    name="ehr"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                                >
                                    <option value="">Select your EHR</option>
                                    <option value="epic">Epic</option>
                                    <option value="athena">Athena Health</option>
                                    <option value="cerner">Cerner</option>
                                    <option value="allscripts">Allscripts</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tell us about your needs (optional)
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                                    placeholder="What challenges are you facing with appointment scheduling?"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-lg py-6 shadow-xl hover:shadow-2xl transition-all"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>

                            <p className="text-center text-sm text-gray-600">
                                By submitting this form, you agree to our{' '}
                                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need to know about MedVoice
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                question: 'How does MedVoice ensure HIPAA compliance?',
                                answer: 'MedVoice is fully HIPAA compliant with end-to-end encryption, secure data storage, and regular security audits. All voice data is encrypted in transit and at rest, and we maintain strict access controls. We sign BAAs (Business Associate Agreements) with all healthcare providers and undergo annual third-party security assessments.'
                            },
                            {
                                question: 'How long does onboarding take?',
                                answer: 'Most clinics are up and running within 24-48 hours. Our onboarding process includes: (1) EHR integration setup (2-4 hours), (2) Voice agent customization for your practice (1-2 hours), (3) Staff training (1 hour), and (4) Testing period (24 hours). Our dedicated onboarding team guides you through every step.'
                            },
                            {
                                question: 'Which EHR systems do you integrate with?',
                                answer: 'We integrate seamlessly with Epic, Athena Health, Cerner, Allscripts, eClinicalWorks, and 20+ other major EHR systems. Our API-based integration ensures real-time synchronization of appointments, patient data, and availability. If your EHR isn\'t listed, we can typically build a custom integration within 2-4 weeks.'
                            },
                            {
                                question: 'What is your pricing model?',
                                answer: 'We offer flexible pricing based on your clinic size and call volume. Plans start at $299/month for small practices (up to 500 calls/month) and scale up for larger organizations. All plans include unlimited users, EHR integration, 24/7 support, and regular feature updates. We also offer custom enterprise pricing for multi-location practices.'
                            },
                            {
                                question: 'Can the AI handle complex scheduling scenarios?',
                                answer: 'Yes! Our AI is trained on millions of healthcare conversations and can handle complex scenarios including: multi-provider scheduling, insurance verification, urgent vs. routine triage, rescheduling conflicts, waitlist management, and special appointment types. The AI learns your practice\'s specific workflows and improves over time.'
                            },
                            {
                                question: 'What happens if the AI can\'t handle a call?',
                                answer: 'If the AI encounters a situation it can\'t handle, it seamlessly transfers the call to your staff with full context of the conversation. You can also set custom escalation rules for specific scenarios. Our AI successfully handles 95%+ of calls without human intervention, and the transfer process is smooth and professional.'
                            }
                        ].map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900 text-lg pr-8">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
                                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Banner */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-[length:200%_100%] animate-gradient relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Practice?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join hundreds of healthcare providers who are saving time, reducing costs, and improving patient satisfaction with MedVoice.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <a href="#demo">
                            <Button
                                size="lg"
                                className="bg-white hover:bg-gray-100 text-blue-600 font-bold shadow-2xl hover:shadow-3xl transition-all text-lg px-10 py-6"
                            >
                                Start Your Free Trial
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </a>
                        <a href="#pricing">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6"
                            >
                                View Pricing
                            </Button>
                        </a>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8 text-white/90">
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>14-day free trial</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">MedVoice</span>
                            </div>
                            <p className="text-gray-400">
                                AI-powered voice scheduling for modern healthcare practices.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Request Demo</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">HIPAA Compliance</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="text-gray-400 text-sm">
                                © 2025 MedVoice. All rights reserved.
                            </div>
                            <div className="flex items-center space-x-6">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Users className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <MessageSquare className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Globe className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Partner Logos */}
                    <div className="mt-12 pt-8 border-t border-gray-800">
                        <div className="text-center mb-6">
                            <p className="text-gray-400 text-sm">Integrated with leading EHR systems</p>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                            <div className="text-gray-500 font-bold text-xl">EPIC</div>
                            <div className="text-gray-500 font-bold text-xl">athenahealth</div>
                            <div className="text-gray-500 font-bold text-xl">Cerner</div>
                            <div className="text-gray-500 font-bold text-xl">Allscripts</div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
