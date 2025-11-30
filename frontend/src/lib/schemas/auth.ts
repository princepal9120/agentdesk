// Zod validation schemas for authentication

import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../utils/constants';

// ============================================================================
// Login Schema
// ============================================================================

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// Signup Schema
// ============================================================================

export const signupSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Invalid email address'),
        password: z
            .string()
            .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
            .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least 1 number'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        practiceName: z
            .string()
            .min(2, 'Practice name must be at least 2 characters')
            .max(100, 'Practice name must be less than 100 characters'),
        acceptTerms: z
            .boolean()
            .refine((val) => val === true, {
                message: 'You must accept the terms and conditions',
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type SignupFormData = z.infer<typeof signupSchema>;

// ============================================================================
// Password Reset Schema
// ============================================================================

export const resetPasswordRequestSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
});

export type ResetPasswordRequestFormData = z.infer<
    typeof resetPasswordRequestSchema
>;

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
            .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least 1 number'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// Change Password Schema
// ============================================================================

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
            .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least 1 number'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'New password must be different from current password',
        path: ['newPassword'],
    });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
