/**
 * Clinical Minimalism Billing Page
 * Clear pricing tables, minimal lines, pill CTA buttons.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import {
    CreditCard, Check, ArrowRight, Download, Calendar,
    FileText, ChevronRight, AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

const Billing: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.billing-card', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const plans = [
        {
            name: 'Starter',
            desc: 'For solo practitioners',
            price: { monthly: 99, yearly: 79 },
            features: ['500 calls/month', 'Basic analytics', 'Email support', 'HIPAA compliant'],
            popular: false,
        },
        {
            name: 'Professional',
            desc: 'For growing practices',
            price: { monthly: 249, yearly: 199 },
            features: ['2,500 calls/month', 'Advanced analytics', 'Priority support', 'HIPAA compliant', 'Custom AI training', 'EHR integration'],
            popular: true,
        },
        {
            name: 'Enterprise',
            desc: 'For hospitals & networks',
            price: { monthly: 'Custom', yearly: 'Custom' },
            features: ['Unlimited calls', 'White-glove onboarding', 'Dedicated CSM', 'HIPAA + SOC2', 'Custom integrations', 'SLA guarantee'],
            popular: false,
        },
    ];

    const invoices = [
        { date: 'Dec 1, 2024', amount: '$199.00', status: 'Paid', id: 'INV-2024-012' },
        { date: 'Nov 1, 2024', amount: '$199.00', status: 'Paid', id: 'INV-2024-011' },
        { date: 'Oct 1, 2024', amount: '$199.00', status: 'Paid', id: 'INV-2024-010' },
    ];

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-semibold text-grey-900 tracking-tight">Billing</h1>
                <p className="text-grey-500 mt-2">Manage your subscription and payment methods.</p>
            </motion.div>

            {/* Current Plan Card */}
            <Card className="billing-card p-6 mb-8 bg-gradient-to-r from-[#2BB59B]/5 to-[#D7EAFB]/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="teal">Current Plan</Badge>
                            <Badge variant="success">Active</Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-grey-900">Professional Plan</h3>
                        <p className="text-grey-500 mt-1">Your next billing date is January 1, 2025</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">Manage Plan</Button>
                        <Button>
                            Upgrade
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center gap-4 bg-white rounded-full p-1.5 border border-grey-100">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                            billingCycle === 'monthly'
                                ? "bg-grey-900 text-white"
                                : "text-grey-500 hover:text-grey-900"
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                            billingCycle === 'yearly'
                                ? "bg-grey-900 text-white"
                                : "text-grey-500 hover:text-grey-900"
                        )}
                    >
                        Yearly
                        <span className="text-[#2BB59B] text-xs font-bold bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                            Save 20%
                        </span>
                    </button>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card
                            className={cn(
                                "billing-card relative p-6 h-full flex flex-col",
                                plan.popular && "border-[#2BB59B] shadow-teal scale-105 z-10"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-[#2BB59B] text-white border-0">Most Popular</Badge>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-grey-900">{plan.name}</h3>
                                <p className="text-sm text-grey-500 mt-1">{plan.desc}</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-grey-900">
                                    {typeof plan.price[billingCycle] === 'number'
                                        ? `$${plan.price[billingCycle]}`
                                        : plan.price[billingCycle]
                                    }
                                </span>
                                {typeof plan.price[billingCycle] === 'number' && (
                                    <span className="text-grey-500 ml-1">/mo</span>
                                )}
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm text-grey-600">
                                        <Check className="w-4 h-4 text-[#2BB59B] flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={cn(
                                    "w-full",
                                    !plan.popular && "bg-grey-100 text-grey-900 hover:bg-grey-200"
                                )}
                            >
                                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Payment Method & Invoices */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Payment Method */}
                <Card className="billing-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-grey-900">Payment Method</h3>
                        <Button variant="ghost" size="sm">
                            Edit
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-grey-50 rounded-2xl">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-grey-900">•••• •••• •••• 4242</div>
                            <div className="text-sm text-grey-500">Expires 12/2025</div>
                        </div>
                        <Badge variant="default">Default</Badge>
                    </div>

                    <Button variant="outline" className="w-full mt-4">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Add Payment Method
                    </Button>
                </Card>

                {/* Billing History */}
                <Card className="billing-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-grey-900">Billing History</h3>
                        <Button variant="ghost" size="sm">
                            View All
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {invoices.map((invoice, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 hover:bg-grey-50 rounded-xl transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-grey-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-grey-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-grey-900">{invoice.id}</div>
                                        <div className="text-sm text-grey-500">{invoice.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-grey-900">{invoice.amount}</span>
                                    <Button variant="ghost" size="icon-sm">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Billing;
