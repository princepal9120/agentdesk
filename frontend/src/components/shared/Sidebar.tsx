'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Calendar,
    Phone,
    BarChart3,
    Settings,
    Menu,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';

const navigation = [
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'AI Calls', href: '/ai-calls', icon: Phone },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <>
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 lg:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                                <span className="text-primary-foreground font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">MedVoice</span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-primary/10 text-primary shadow-sm dark:bg-primary/20'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    )}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) {
                                            toggleSidebar();
                                        }
                                    }}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-border p-4 bg-muted/30">
                        <p className="text-xs text-muted-foreground text-center">
                            © 2025 MedVoice. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
