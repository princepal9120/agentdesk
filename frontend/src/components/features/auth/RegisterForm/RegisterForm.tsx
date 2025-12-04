import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { User, Mail, Lock, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, RegisterFormData } from '@/utils/validation';

export const RegisterForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data: RegisterFormData) => {
        // Exclude confirm_password before sending to API
        const { confirm_password, ...apiData } = data;
        const resultAction = await dispatch(registerUser(apiData));
        if (registerUser.fulfilled.match(resultAction)) {
            navigate({ to: '/login', state: { message: 'Registration successful! Please login.' } });
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
                <p className="text-muted-foreground mt-2">Join us to book appointments easily</p>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6 flex items-start text-sm">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="full_name"
                            placeholder="John Doe"
                            className="pl-10"
                            {...register('full_name')}
                        />
                    </div>
                    {errors.full_name && (
                        <p className="text-sm text-destructive">{errors.full_name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            {...register('email')}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="phone_number"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="pl-10"
                            {...register('phone_number')}
                        />
                    </div>
                    {errors.phone_number && (
                        <p className="text-sm text-destructive">{errors.phone_number.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...register('password')}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="confirm_password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...register('confirm_password')}
                        />
                    </div>
                    {errors.confirm_password && (
                        <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </Button>

                <div className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-primary hover:underline font-semibold"
                    >
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
    );
};
