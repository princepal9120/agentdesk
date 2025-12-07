/**
 * Clinical Minimalism Register Page
 * Clean step-by-step form with calm color usage.
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { RegisterForm } from '@/components/features/auth/RegisterForm/RegisterForm';
import { Card } from '@/components/ui/card';
import { Shield, UserPlus } from 'lucide-react';
import { isAuthenticated } from '@/utils/auth-utils';

const Register: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (isAuthenticated()) {
            navigate({ to: '/dashboard' });
        }
    }, [navigate]);

    // GSAP entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.register-element', {
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
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-50 via-white to-[#ECFDF5]/20 p-4 py-12"
        >
            {/* Soft Background Decoration */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D7EAFB]/20 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#ECFDF5]/30 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="w-full max-w-md">
                {/* Logo & Branding */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="register-element text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-[#2BB59B] rounded-2xl flex items-center justify-center text-white shadow-teal">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-semibold text-grey-900">HealthVoice</span>
                    </div>
                    <p className="text-sm text-grey-500">Create your secure healthcare account</p>
                </motion.div>

                {/* Registration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="register-element p-8 md:p-10 shadow-lg border-grey-100/50 bg-white/80 backdrop-blur-sm">
                        <RegisterForm />
                    </Card>
                </motion.div>

                {/* Security Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="register-element mt-8 flex items-center justify-center gap-6 text-grey-400"
                >
                    <div className="flex items-center gap-2 text-xs">
                        <Shield className="w-4 h-4" />
                        <span>HIPAA Compliant</span>
                    </div>
                    <div className="w-1 h-1 bg-grey-300 rounded-full" />
                    <div className="flex items-center gap-2 text-xs">
                        <UserPlus className="w-4 h-4" />
                        <span>Secure Signup</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
