// Zod validation schemas for appointments

import { z } from 'zod';
import { isValidPhone } from '../utils/helpers';

// ============================================================================
// Appointment Schema
// ============================================================================

export const appointmentSchema = z.object({
    patientName: z
        .string()
        .min(2, 'Patient name must be at least 2 characters')
        .max(100, 'Patient name must be less than 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Patient name can only contain letters and spaces'),

    patientPhone: z
        .string()
        .min(1, 'Phone number is required')
        .refine((phone) => isValidPhone(phone), {
            message: 'Phone number must be 10 digits',
        }),

    patientEmail: z
        .string()
        .email('Invalid email address')
        .optional()
        .or(z.literal('')),

    appointmentTypeId: z
        .string()
        .min(1, 'Appointment type is required'),

    providerId: z
        .string()
        .min(1, 'Provider is required'),

    date: z.date({
        required_error: 'Date is required',
        invalid_type_error: 'Invalid date',
    }),

    time: z
        .string()
        .min(1, 'Time is required')
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),

    notes: z
        .string()
        .max(500, 'Notes must be less than 500 characters')
        .optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// ============================================================================
// Reschedule Appointment Schema
// ============================================================================

export const rescheduleAppointmentSchema = z.object({
    date: z.date({
        required_error: 'Date is required',
        invalid_type_error: 'Invalid date',
    }),

    time: z
        .string()
        .min(1, 'Time is required')
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),

    reason: z
        .string()
        .min(1, 'Reason is required')
        .max(200, 'Reason must be less than 200 characters'),

    notifyPatient: z.boolean().default(true),
});

export type RescheduleAppointmentFormData = z.infer<typeof rescheduleAppointmentSchema>;

// ============================================================================
// Cancel Appointment Schema
// ============================================================================

export const cancelAppointmentSchema = z.object({
    reason: z
        .string()
        .min(1, 'Reason is required'),

    addToWaitlist: z.boolean().default(false),

    notifyPatient: z.boolean().default(true),

    notes: z
        .string()
        .max(500, 'Notes must be less than 500 characters')
        .optional(),
});

export type CancelAppointmentFormData = z.infer<typeof cancelAppointmentSchema>;

// ============================================================================
// Appointment Filter Schema
// ============================================================================

export const appointmentFilterSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    providerId: z.string().optional(),
    appointmentTypeId: z.string().optional(),
    status: z.enum(['confirmed', 'pending', 'cancelled', 'completed', 'no-show']).optional(),
    bookingSource: z.enum(['ai-voice', 'manual', 'online']).optional(),
    searchQuery: z.string().optional(),
});

export type AppointmentFilterFormData = z.infer<typeof appointmentFilterSchema>;

// ============================================================================
// Bulk Action Schema
// ============================================================================

export const bulkActionSchema = z.object({
    appointmentIds: z
        .array(z.string())
        .min(1, 'At least one appointment must be selected'),

    action: z.enum(['confirm', 'cancel', 'export']),

    reason: z.string().optional(), // Required for cancel action
});

export type BulkActionFormData = z.infer<typeof bulkActionSchema>;
