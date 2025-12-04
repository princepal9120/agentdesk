/**
 * Clinical Minimalism Onboarding Page
 * Step-by-step clean wizard with soft illustrations and calm color usage.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { useNavigate } from '@tanstack/react-router';
import {
    Building, Users, Phone, Calendar, Check,
    ArrowRight, ArrowLeft, Shield, Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const Onboarding: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const totalSteps = 4;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.onboarding-content', {
                x: 20,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, [currentStep]);

    const steps: OnboardingStep[] = [
        { id: 1, title: 'Practice Details', description: 'Tell us about your practice', icon: <Building /> },
        { id: 2, title: 'Team Setup', description: 'Add your team members', icon: <Users /> },
        { id: 3, title: 'Phone Integration', description: 'Connect your phone system', icon: <Phone /> },
        { id: 4, title: 'Calendar Sync', description: 'Sync your appointments', icon: <Calendar /> },
    ];

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            navigate({ to: '/dashboard' });
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-br from-grey-50 via-white to-[#D7EAFB]/10 flex items-center justify-center p-4"
        >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D7EAFB]/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ECFDF5]/30 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-[#2BB59B] rounded-2xl flex items-center justify-center text-white shadow-teal">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-semibold text-grey-900">HealthVoice</span>
                    </div>
                    <h1 className="text-3xl font-semibold text-grey-900 mb-2">Welcome! Let's get you set up.</h1>
                    <p className="text-grey-500">This will only take a few minutes.</p>
                </motion.div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {steps.map((step, i) => (
                        <React.Fragment key={step.id}>
                            <div
                                className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all",
                                    currentStep === step.id && "bg-[#2BB59B] text-white shadow-teal",
                                    currentStep > step.id && "bg-success-light text-success",
                                    currentStep < step.id && "bg-grey-100 text-grey-400"
                                )}
                            >
                                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                            </div>
                            {i < steps.length - 1 && (
                                <div className={cn(
                                    "w-12 h-1 rounded-full transition-all",
                                    currentStep > step.id ? "bg-[#2BB59B]" : "bg-grey-200"
                                )} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content Card */}
                <Card className="p-8 md:p-12 shadow-lg border-grey-100/50 bg-white/80 backdrop-blur-sm">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="onboarding-content"
                        >
                            {/* Step Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-[#D7EAFB] rounded-2xl flex items-center justify-center text-[#1B5E7A]">
                                    {steps[currentStep - 1].icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-grey-900">{steps[currentStep - 1].title}</h2>
                                    <p className="text-grey-500">{steps[currentStep - 1].description}</p>
                                </div>
                            </div>

                            {/* Step 1: Practice Details */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Practice Name</Label>
                                            <Input placeholder="e.g., Central Medical Group" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Specialty</Label>
                                            <Input placeholder="e.g., Internal Medicine" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Practice Phone</Label>
                                            <Input placeholder="+1 (555) 000-0000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Number of Providers</Label>
                                            <Input type="number" placeholder="e.g., 5" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Team Setup */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <p className="text-grey-500 text-sm mb-4">
                                        Invite your team members to help manage appointments and calls.
                                    </p>
                                    {[1, 2].map((i) => (
                                        <div key={i} className="grid md:grid-cols-2 gap-4 p-4 bg-grey-50 rounded-2xl">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input placeholder="Team member name" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input type="email" placeholder="email@clinic.com" />
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full">
                                        <Users className="w-4 h-4 mr-2" />
                                        Add Another Team Member
                                    </Button>
                                </div>
                            )}

                            {/* Step 3: Phone Integration */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <p className="text-grey-500 text-sm mb-4">
                                        Forward your missed calls to your dedicated HealthVoice number.
                                    </p>
                                    <div className="p-6 bg-[#ECFDF5] rounded-2xl border border-success/20">
                                        <div className="text-sm text-grey-500 mb-2">Your HealthVoice Number</div>
                                        <div className="text-2xl font-bold text-grey-900">+1 (855) HV-VOICE</div>
                                        <div className="text-sm text-grey-500 mt-2">
                                            Forward calls to this number when you can't answer.
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Your Current Phone Number</Label>
                                        <Input placeholder="+1 (555) 000-0000" />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Calendar Sync */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <p className="text-grey-500 text-sm mb-4">
                                        Connect your calendar to enable AI scheduling.
                                    </p>
                                    <div className="grid gap-3">
                                        {[
                                            { name: 'Google Calendar', connected: true },
                                            { name: 'Microsoft Outlook', connected: false },
                                            { name: 'Apple Calendar', connected: false },
                                            { name: 'Epic / EHR', connected: false },
                                        ].map((cal, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                                    cal.connected
                                                        ? "bg-success-light border-success/20"
                                                        : "bg-grey-50 border-grey-100 hover:border-grey-200"
                                                )}
                                            >
                                                <span className="font-medium text-grey-900">{cal.name}</span>
                                                {cal.connected ? (
                                                    <span className="flex items-center gap-2 text-success text-sm font-medium">
                                                        <Check className="w-4 h-4" />
                                                        Connected
                                                    </span>
                                                ) : (
                                                    <Button variant="outline" size="sm">
                                                        Connect
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-grey-100">
                        <Button
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={cn(currentStep === 1 && "invisible")}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        <div className="text-sm text-grey-400">
                            Step {currentStep} of {totalSteps}
                        </div>

                        <Button onClick={nextStep}>
                            {currentStep === totalSteps ? (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Launch Dashboard
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </Card>

                {/* Skip Link */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate({ to: '/dashboard' })}
                        className="text-sm text-grey-400 hover:text-grey-600 transition-colors"
                    >
                        Skip for now, I'll set this up later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
