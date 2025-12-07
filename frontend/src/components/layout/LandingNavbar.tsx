/**
 * Landing Navbar Component
 * Floating navigation for the landing page
 */

import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, HeartPulse, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isAuthenticated } from '@/utils/auth-utils';

const LandingNavbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check auth status on mount
        setIsLoggedIn(isAuthenticated());

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'How it Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'About', href: '#about' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isScrolled
                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                                : 'bg-white/20 backdrop-blur-sm'
                                }`}>
                                <HeartPulse className={`w-6 h-6 ${isScrolled ? 'text-white' : 'text-blue-600'}`} />
                            </div>
                            <span className={isScrolled ? 'text-slate-900' : 'text-slate-800'}>
                                HealthVoice
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${isScrolled ? 'text-slate-600' : 'text-slate-700'
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center gap-4">
                            {isLoggedIn ? (
                                <Link to="/dashboard">
                                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="ghost" className={isScrolled ? '' : 'text-slate-700'}>
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-slate-900" />
                            ) : (
                                <Menu className={`w-6 h-6 ${isScrolled ? 'text-slate-900' : 'text-slate-800'}`} />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-[72px] z-40 md:hidden"
                    >
                        <div className="bg-white shadow-lg rounded-b-2xl mx-4 p-6 border border-slate-100">
                            <div className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="text-slate-600 font-medium py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <hr className="my-2" />
                                {isLoggedIn ? (
                                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingNavbar;
