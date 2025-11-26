'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    PhoneCall,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn, getInitials } from '@/lib/utils/helpers';
import { ROUTES } from '@/lib/utils/constants';

const SIDEBAR_ITEMS = [
    {
        title: 'Calendar',
        href: ROUTES.CALENDAR,
        icon: LayoutDashboard,
    },
    {
        title: 'AI Calls',
        href: ROUTES.AI_CALLS,
        icon: PhoneCall,
    },
    {
        title: 'Analytics',
        href: ROUTES.ANALYTICS,
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: ROUTES.SETTINGS,
        icon: Settings,
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push(ROUTES.LOGIN);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar for Desktop */}
            <aside className="hidden w-64 flex-col border-r bg-white md:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 font-bold text-xl text-primary">
                        <PhoneCall className="h-6 w-6" />
                        <span>MedVoice</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-1">
                        {SIDEBAR_ITEMS.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        pathname === item.href
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="border-t p-4">
                    <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium">{user?.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Sidebar Overlay */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
                    <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 font-bold text-lg text-primary">
                        <PhoneCall className="h-5 w-5" />
                        <span>MedVoice</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </header>

                {/* Mobile Sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 flex md:hidden">
                        <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
                        <aside className="relative flex w-64 flex-col bg-white shadow-xl">
                            <div className="flex h-16 items-center justify-between border-b px-4">
                                <span className="font-bold text-lg">Menu</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <nav className="flex-1 overflow-y-auto p-4">
                                <ul className="space-y-1">
                                    {SIDEBAR_ITEMS.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsSidebarOpen(false)}
                                                className={cn(
                                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                                    pathname === item.href
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                                                )}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="border-t p-4">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-600"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
