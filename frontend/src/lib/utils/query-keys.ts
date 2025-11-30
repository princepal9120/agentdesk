// TanStack Query keys for consistent cache management

import type { AppointmentFilters, CallFilters, DateRange } from '@/types/models';

export const queryKeys = {
    // Authentication
    auth: {
        user: ['auth', 'user'] as const,
    },

    // Appointments
    appointments: {
        all: ['appointments'] as const,
        lists: () => [...queryKeys.appointments.all, 'list'] as const,
        list: (filters: AppointmentFilters) =>
            [...queryKeys.appointments.lists(), filters] as const,
        details: () => [...queryKeys.appointments.all, 'detail'] as const,
        detail: (id: string) =>
            [...queryKeys.appointments.details(), id] as const,
    },

    // AI Calls
    calls: {
        all: ['calls'] as const,
        lists: () => [...queryKeys.calls.all, 'list'] as const,
        list: (filters: CallFilters) =>
            [...queryKeys.calls.lists(), filters] as const,
        details: () => [...queryKeys.calls.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.calls.details(), id] as const,
    },

    // Analytics
    analytics: {
        all: ['analytics'] as const,
        metrics: (dateRange: DateRange) =>
            [...queryKeys.analytics.all, 'metrics', dateRange] as const,
        callVolume: (dateRange: DateRange) =>
            [...queryKeys.analytics.all, 'call-volume', dateRange] as const,
        outcomes: (dateRange: DateRange) =>
            [...queryKeys.analytics.all, 'outcomes', dateRange] as const,
        bookingSources: (dateRange: DateRange) =>
            [...queryKeys.analytics.all, 'booking-sources', dateRange] as const,
        peakHours: (dateRange: DateRange) =>
            [...queryKeys.analytics.all, 'peak-hours', dateRange] as const,
    },

    // Settings
    settings: {
        all: ['settings'] as const,
        practice: () => [...queryKeys.settings.all, 'practice'] as const,
        providers: () => [...queryKeys.settings.all, 'providers'] as const,
        provider: (id: string) =>
            [...queryKeys.settings.all, 'providers', id] as const,
        appointmentTypes: () =>
            [...queryKeys.settings.all, 'appointment-types'] as const,
        appointmentType: (id: string) =>
            [...queryKeys.settings.all, 'appointment-types', id] as const,
        aiScript: () => [...queryKeys.settings.all, 'ai-script'] as const,
        notifications: () =>
            [...queryKeys.settings.all, 'notifications'] as const,
        team: () => [...queryKeys.settings.all, 'team'] as const,
    },
} as const;
