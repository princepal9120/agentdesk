import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { LogOut, User, Calendar, Home } from 'lucide-react';

export const MainLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-xl font-bold text-primary flex items-center">
                            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center mr-2">
                                H
                            </div>
                            HealthVoice
                        </Link>

                        <nav className="hidden md:flex items-center space-x-6">
                            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/appointments/book" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Book Appointment
                            </Link>
                            <Link to="/appointments" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                My Appointments
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <User className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50">
                <Link to="/dashboard" className="flex flex-col items-center text-xs text-muted-foreground">
                    <Home className="w-5 h-5 mb-1" />
                    Home
                </Link>
                <Link to="/appointments/book" className="flex flex-col items-center text-xs text-primary">
                    <Calendar className="w-5 h-5 mb-1" />
                    Book
                </Link>
                <Link to="/profile" className="flex flex-col items-center text-xs text-muted-foreground">
                    <User className="w-5 h-5 mb-1" />
                    Profile
                </Link>
            </div>
        </div>
    );
};
