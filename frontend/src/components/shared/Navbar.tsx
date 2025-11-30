'use client';

import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { toggleSidebar } = useUIStore();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-6 backdrop-blur supports-[backdrop-filter]:bg-card/95">
            {/* Mobile menu button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Page title - could be dynamic */}
            <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                        3
                    </span>
                    <span className="sr-only">Notifications</span>
                </Button>

                {/* User menu */}
                <div className="flex items-center gap-3 ml-2">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-foreground">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">{user?.role || 'Staff'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
