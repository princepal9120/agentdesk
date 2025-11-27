'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: '$49',
        desc: 'Perfect for solo practitioners.',
        features: ['1 Provider', '500 AI Calls / month', 'Real-time Calendar', 'Basic Reminders'],
        cta: 'Start Free Trial',
        popular: false,
    },
    {
        name: 'Growth',
        price: '$149',
        desc: 'For growing clinics and teams.',
        features: ['Up to 5 Providers', 'Unlimited AI Calls', 'Advanced Analytics', 'Call Monitoring', 'Priority Support'],
        cta: 'Get Started',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        desc: 'For hospitals and large networks.',
        features: ['Unlimited Providers', 'Custom AI Scripts', 'SSO & API Access', 'Dedicated Account Manager', 'SLA Guarantee'],
        cta: 'Contact Sales',
        popular: false,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-slate-600">
                        Designed for practices of all sizes. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl border ${plan.popular
                                    ? 'border-blue-200 bg-blue-50/50 shadow-xl scale-105 z-10'
                                    : 'border-slate-100 bg-white shadow-sm hover:shadow-md'
                                } transition-all duration-300 flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                    {plan.price !== 'Custom' && <span className="text-slate-500">/month</span>}
                                </div>
                                <p className="text-sm text-slate-500">{plan.desc}</p>
                            </div>

                            <div className="flex-1 mb-8 space-y-4">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={`w-full rounded-full h-12 font-medium ${plan.popular
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                    }`}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
