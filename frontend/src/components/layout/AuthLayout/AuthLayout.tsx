import React from 'react';
import { Outlet } from '@tanstack/react-router';

export const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-neutral-light">
            {/* Left Side - Branding/Image */}
            <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-active opacity-90" />
                <div className="relative z-10 max-w-md">
                    <div className="mb-8">
                        {/* Logo Placeholder */}
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Healthcare Voice Agent</h1>
                        <p className="text-lg text-blue-100 leading-relaxed">
                            Experience the future of healthcare management. Book appointments effortlessly with our AI-powered voice assistant.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-blue-100">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✓</div>
                            <span>24/7 AI Voice Booking</span>
                        </div>
                        <div className="flex items-center space-x-3 text-blue-100">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✓</div>
                            <span>Instant Confirmation</span>
                        </div>
                        <div className="flex items-center space-x-3 text-blue-100">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✓</div>
                            <span>Secure & HIPAA Compliant</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
