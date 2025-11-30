// AI Calls API methods

import type { Call, CallDetail, CallFilters, PaginatedResponse } from '@/types/models';
import { buildQueryString } from '../utils/helpers';
import { apiClient } from './client';

export const callsApi = {
    /**
     * Get all calls with optional filters
     */
    getAll: async (filters?: CallFilters): Promise<{ calls: Call[] }> => {
        const queryString = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
        const response = await apiClient.get<{ calls: Call[] }>(
            `/calls${queryString}`
        );
        return response.data;
    },

    /**
     * Get paginated calls
     */
    getPaginated: async (
        page: number = 1,
        pageSize: number = 25,
        filters?: CallFilters
    ): Promise<PaginatedResponse<Call>> => {
        const params = {
            page,
            pageSize,
            ...filters,
        };
        const queryString = buildQueryString(params as Record<string, string | number | boolean | undefined>);
        const response = await apiClient.get<PaginatedResponse<Call>>(
            `/calls${queryString}`
        );
        return response.data;
    },

    /**
     * Get single call details with transcript and audio
     */
    getById: async (id: string): Promise<CallDetail> => {
        const response = await apiClient.get<CallDetail>(`/calls/${id}`);
        return response.data;
    },

    /**
     * Flag a call for review
     */
    flag: async (id: string, reason: string): Promise<void> => {
        await apiClient.post(`/calls/${id}/flag`, { reason });
    },

    /**
     * Unflag a call
     */
    unflag: async (id: string): Promise<void> => {
        await apiClient.delete(`/calls/${id}/flag`);
    },

    /**
     * Export calls to CSV
     */
    exportToCsv: async (filters?: CallFilters): Promise<Blob> => {
        const queryString = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
        const response = await apiClient.get(`/calls/export${queryString}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    /**
     * Get call statistics
     */
    getStats: async (
        startDate: string,
        endDate: string
    ): Promise<{
        totalCalls: number;
        successfulBookings: number;
        escalations: number;
        avgDuration: number;
    }> => {
        const queryString = buildQueryString({ startDate, endDate });
        const response = await apiClient.get<{
            totalCalls: number;
            successfulBookings: number;
            escalations: number;
            avgDuration: number;
        }>(`/calls/stats${queryString}`);
        return response.data;
    },
};
