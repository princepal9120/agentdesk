'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
                isScrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm py-4'
                    : 'bg-transparent py-6'
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <img
                        src="/darklogo.png"
                        alt="MedVoice Logo"
                        className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={cn("text-xl font-bold tracking-tight transition-colors", isScrolled ? "text-foreground" : "text-foreground")}>
                        MedVoice
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {['Features', 'How it Works', 'Testimonials', 'Pricing'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Log in
                    </Link>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 font-medium">
                        Get a Demo
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-5">
                    {['Features', 'How it Works', 'Pricing'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-lg font-medium text-muted-foreground py-2 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <div className="h-px bg-border my-2" />
                    <Link
                        href="/login"
                        className="text-lg font-medium text-muted-foreground py-2 hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Log in
                    </Link>
                    <Button className="w-full bg-primary text-primary-foreground rounded-full h-12 text-lg shadow-lg shadow-primary/25">
                        Get a Demo
                    </Button>
                </div>
            )}
        </nav>
    );
}
