import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm } from '../components/features/auth/LoginForm/LoginForm';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        // Clear history state to prevent showing message on refresh
        if (message) {
            window.history.replaceState({}, document.title);
        }
    }, [message]);

    return (
        <div className="w-full">
            {message && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center shadow-sm border border-green-100">
                    <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{message}</span>
                </div>
            )}

            <Card className="p-6 md:p-8 shadow-lg border-0 md:border">
                <LoginForm />
            </Card>
        </div>
    );
};

export default Login;
