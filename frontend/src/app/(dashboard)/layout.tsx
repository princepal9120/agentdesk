import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="flex h-screen overflow-hidden bg-gray-50">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-y-auto p-6">{children}</main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
