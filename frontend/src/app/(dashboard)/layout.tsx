'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="dashboard-theme flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-y-auto p-6 bg-muted/30">{children}</main>
                </div>
            </div>
        );
    }

    return (
        <div className={`dashboard-theme ${theme === 'dark' ? 'dark' : ''} flex h-screen overflow-hidden bg-background`}>
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6 bg-muted/30">{children}</main>
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
        >
            <ProtectedRoute>
                <DashboardContent>{children}</DashboardContent>
            </ProtectedRoute>
        </ThemeProvider>
    );
}
