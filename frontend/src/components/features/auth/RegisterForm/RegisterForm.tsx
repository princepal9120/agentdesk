/**
 * Clinical Minimalism Register Form
 * Clean multi-field form with calm styling.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { User, Mail, Lock, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
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
        const { confirm_password, ...apiData } = data;
        const resultAction = await dispatch(registerUser(apiData));
        if (registerUser.fulfilled.match(resultAction)) {
            navigate({ to: '/login', state: { message: 'Registration successful! Please login.' } });
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-grey-900 mb-2">Create Account</h2>
                <p className="text-grey-500 text-sm">Join us for seamless appointment booking</p>
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-grey-700 font-medium">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-400" />
                        <Input
                            id="full_name"
                            placeholder="John Doe"
                            className="pl-12 h-12 rounded-xl"
                            {...register('full_name')}
                        />
                    </div>
                    {errors.full_name && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-error mt-1">
                            {errors.full_name.message}
                        </motion.p>
                    )}
                </div>

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
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-error mt-1">
                            {errors.email.message}
                        </motion.p>
                    )}
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-grey-700 font-medium">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-400" />
                        <Input
                            id="phone_number"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="pl-12 h-12 rounded-xl"
                            {...register('phone_number')}
                        />
                    </div>
                    {errors.phone_number && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-error mt-1">
                            {errors.phone_number.message}
                        </motion.p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-grey-700 font-medium">Password</Label>
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
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-error mt-1">
                            {errors.password.message}
                        </motion.p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-grey-700 font-medium">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-400" />
                        <Input
                            id="confirm_password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-12 h-12 rounded-xl"
                            {...register('confirm_password')}
                        />
                    </div>
                    {errors.confirm_password && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-error mt-1">
                            {errors.confirm_password.message}
                        </motion.p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium mt-2"
                    size="lg"
                    disabled={loading}
                >
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Create Account
                </Button>

                {/* Sign In Link */}
                <div className="text-center text-sm text-grey-500 pt-4 border-t border-grey-100 mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-[#2BB59B] hover:text-[#249A84] font-semibold transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
    );
};
