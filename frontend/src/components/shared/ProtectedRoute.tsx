'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, checkAuth } = useAuthStore();

    useEffect(() => {
        // Check authentication on mount
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
