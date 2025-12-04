/**
 * Clinical Minimalism Login Page
 * White background, simple form layout, soft shadows and clean input fields.
 */

import React, { useEffect, useRef } from 'react';
import { useRouter } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { LoginForm } from '@/components/features/auth/LoginForm/LoginForm';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Shield } from 'lucide-react';

const Login: React.FC = () => {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const message = (router.state.location.state as { message?: string } | undefined)?.message;

    useEffect(() => {
        // Clear history state to prevent showing message on refresh
        if (message) {
            window.history.replaceState({}, document.title);
        }
    }, [message]);

    // GSAP entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.login-element', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-50 via-white to-[#D7EAFB]/20 p-4"
        >
            {/* Soft Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D7EAFB]/20 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ECFDF5]/30 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="w-full max-w-md">
                {/* Logo & Branding */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="login-element text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-[#2BB59B] rounded-2xl flex items-center justify-center text-white shadow-teal">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-semibold text-grey-900">HealthVoice</span>
                    </div>
                    <p className="text-sm text-grey-500">HIPAA-compliant voice AI platform</p>
                </motion.div>

                {/* Success Message */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="login-element mb-6 p-4 bg-success-light text-success rounded-2xl flex items-center gap-3 border border-success/20"
                    >
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{message}</span>
                    </motion.div>
                )}

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="login-element p-8 md:p-10 shadow-lg border-grey-100/50 bg-white/80 backdrop-blur-sm">
                        <LoginForm />
                    </Card>
                </motion.div>

                {/* Security Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="login-element mt-8 flex items-center justify-center gap-6 text-grey-400"
                >
                    <div className="flex items-center gap-2 text-xs">
                        <Shield className="w-4 h-4" />
                        <span>HIPAA Compliant</span>
                    </div>
                    <div className="w-1 h-1 bg-grey-300 rounded-full" />
                    <div className="flex items-center gap-2 text-xs">
                        <Shield className="w-4 h-4" />
                        <span>256-bit Encryption</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
