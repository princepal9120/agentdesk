// Appointments API methods

import type {
    Appointment,
    AppointmentFilters,
    CreateAppointmentInput,
    PaginatedResponse,
    UpdateAppointmentInput,
} from '@/types/models';
import { buildQueryString } from '../utils/helpers';
import { apiClient } from './client';

export const appointmentsApi = {
    /**
     * Get all appointments with optional filters
     */
    getAll: async (
        filters?: AppointmentFilters
    ): Promise<{ appointments: Appointment[] }> => {
        const queryString = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
        const response = await apiClient.get<{ appointments: Appointment[] }>(
            `/appointments${queryString}`
        );
        return response.data;
    },

    /**
     * Get paginated appointments
     */
    getPaginated: async (
        page: number = 1,
        pageSize: number = 25,
        filters?: AppointmentFilters
    ): Promise<PaginatedResponse<Appointment>> => {
        const params = {
            page,
            pageSize,
            ...filters,
        };
        const queryString = buildQueryString(params as Record<string, string | number | boolean | undefined>);
        const response = await apiClient.get<PaginatedResponse<Appointment>>(
            `/appointments${queryString}`
        );
        return response.data;
    },

    /**
     * Get single appointment by ID
     */
    getById: async (id: string): Promise<Appointment> => {
        const response = await apiClient.get<{ appointment: Appointment }>(
            `/appointments/${id}`
        );
        return response.data.appointment;
    },

    /**
     * Create new appointment
     */
    create: async (
        data: CreateAppointmentInput
    ): Promise<Appointment> => {
        const response = await apiClient.post<{ appointment: Appointment }>(
            '/appointments',
            data
        );
        return response.data.appointment;
    },

    /**
     * Update existing appointment
     */
    update: async (
        id: string,
        data: UpdateAppointmentInput
    ): Promise<Appointment> => {
        const response = await apiClient.put<{ appointment: Appointment }>(
            `/appointments/${id}`,
            data
        );
        return response.data.appointment;
    },

    /**
     * Cancel appointment
     */
    cancel: async (
        id: string,
        reason: string
    ): Promise<void> => {
        await apiClient.delete(`/appointments/${id}`, {
            data: { reason },
        });
    },

    /**
     * Reschedule appointment
     */
    reschedule: async (
        id: string,
        newDate: string,
        newTime: string,
        reason: string
    ): Promise<Appointment> => {
        const response = await apiClient.put<{ appointment: Appointment }>(
            `/appointments/${id}/reschedule`,
            {
                date: newDate,
                startTime: newTime,
                reason,
            }
        );
        return response.data.appointment;
    },

    /**
     * Bulk operations on appointments
     */
    bulkAction: async (
        appointmentIds: string[],
        action: 'confirm' | 'cancel' | 'export',
        reason?: string
    ): Promise<{ results: Array<{ id: string; success: boolean }> }> => {
        const response = await apiClient.post<{
            results: Array<{ id: string; success: boolean }>;
        }>('/appointments/bulk', {
            ids: appointmentIds,
            action,
            reason,
        });
        return response.data;
    },

    /**
     * Check appointment availability
     */
    checkAvailability: async (
        providerId: string,
        date: string,
        duration: number
    ): Promise<{ availableSlots: string[] }> => {
        const queryString = buildQueryString({ providerId, date, duration });
        const response = await apiClient.get<{ availableSlots: string[] }>(
            `/appointments/availability${queryString}`
        );
        return response.data;
    },
};
