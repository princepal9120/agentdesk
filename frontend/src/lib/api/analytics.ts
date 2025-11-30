// Analytics API methods

import type {
    AppointmentOutcome,
    BookingSourceData,
    CallVolumeData,
    DashboardMetrics,
    DateRange,
    PeakHourData,
} from '@/types/models';
import { buildQueryString } from '../utils/helpers';
import { apiClient } from './client';

export const analyticsApi = {
    /**
     * Get dashboard metrics
     */
    getMetrics: async (dateRange: DateRange): Promise<DashboardMetrics> => {
        const queryString = buildQueryString({ ...dateRange });
        const response = await apiClient.get<{ metrics: DashboardMetrics }>(
            `/analytics/metrics${queryString}`
        );
        return response.data.metrics;
    },

    /**
     * Get call volume over time
     */
    getCallVolume: async (
        dateRange: DateRange,
        granularity: 'day' | 'week' | 'month' = 'day'
    ): Promise<CallVolumeData[]> => {
        const queryString = buildQueryString({ ...dateRange, granularity });
        const response = await apiClient.get<{ data: CallVolumeData[] }>(
            `/analytics/call-volume${queryString}`
        );
        return response.data.data;
    },

    /**
     * Get appointment outcomes
     */
    getAppointmentOutcomes: async (
        dateRange: DateRange
    ): Promise<AppointmentOutcome[]> => {
        const queryString = buildQueryString({ ...dateRange });
        const response = await apiClient.get<{ data: AppointmentOutcome[] }>(
            `/analytics/outcomes${queryString}`
        );
        return response.data.data;
    },

    /**
     * Get booking sources distribution
     */
    getBookingSources: async (
        dateRange: DateRange
    ): Promise<BookingSourceData[]> => {
        const queryString = buildQueryString({ ...dateRange });
        const response = await apiClient.get<{ data: BookingSourceData[] }>(
            `/analytics/booking-sources${queryString}`
        );
        return response.data.data;
    },

    /**
     * Get peak call hours heatmap data
     */
    getPeakHours: async (dateRange: DateRange): Promise<PeakHourData[]> => {
        const queryString = buildQueryString({ ...dateRange });
        const response = await apiClient.get<{ data: PeakHourData[] }>(
            `/analytics/peak-hours${queryString}`
        );
        return response.data.data;
    },

    /**
     * Export analytics report to PDF
     */
    exportToPdf: async (dateRange: DateRange): Promise<Blob> => {
        const response = await apiClient.post(
            '/analytics/export',
            dateRange,
            {
                responseType: 'blob',
            }
        );
        return response.data;
    },
};
