/**
 * Clinical Minimalism Login Form
 * Clean form layout with calm inputs and soft styling.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, LoginFormData } from '@/utils/validation';

export const LoginForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data: LoginFormData) => {
        const resultAction = await dispatch(loginUser(data));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate({ to: '/dashboard' });
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-grey-900 mb-2">Welcome Back</h2>
                <p className="text-grey-500 text-sm">Sign in to manage your appointments</p>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-error-light text-error p-4 rounded-2xl mb-6 flex items-start gap-3 border border-error/10"
                >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-grey-700 font-medium">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-12 h-12 rounded-xl"
                            {...register('email')}
                        />
                    </div>
                    {errors.email && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-error mt-1"
                        >
                            {errors.email.message}
                        </motion.p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-grey-700 font-medium">Password</Label>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-[#2BB59B] hover:text-[#249A84] font-medium transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-400" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-12 h-12 rounded-xl"
                            {...register('password')}
                        />
                    </div>
                    {errors.password && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-error mt-1"
                        >
                            {errors.password.message}
                        </motion.p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                    disabled={loading}
                >
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Sign In
                </Button>

                {/* Sign Up Link */}
                <div className="text-center text-sm text-grey-500 pt-4 border-t border-grey-100 mt-6">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-[#2BB59B] hover:text-[#249A84] font-semibold transition-colors"
                    >
                        Create account
                    </Link>
                </div>
            </form>
        </div>
    );
};
