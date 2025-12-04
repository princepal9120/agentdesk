import React from 'react';
import { RegisterForm } from '../components/features/auth/RegisterForm/RegisterForm';
import { Card } from '@/components/ui/card';

const Register: React.FC = () => {
    return (
        <div className="w-full">
            <Card className="p-6 md:p-8 shadow-lg border-0 md:border">
                <RegisterForm />
            </Card>
        </div>
    );
};

export default Register;
