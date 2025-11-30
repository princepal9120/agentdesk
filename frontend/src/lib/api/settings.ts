// Settings API methods

import type {
    AIScriptConfig,
    AppointmentType,
    NotificationSettings,
    Practice,
    Provider,
    TeamMember,
} from '@/types/models';
import { apiClient } from './client';

export const settingsApi = {
    // Practice Settings
    practice: {
        get: async (): Promise<Practice> => {
            const response = await apiClient.get<{ practice: Practice }>(
                '/settings/practice'
            );
            return response.data.practice;
        },

        update: async (data: Partial<Practice>): Promise<Practice> => {
            const response = await apiClient.put<{ practice: Practice }>(
                '/settings/practice',
                data
            );
            return response.data.practice;
        },

        uploadLogo: async (file: File): Promise<{ logoUrl: string }> => {
            const formData = new FormData();
            formData.append('logo', file);
            const response = await apiClient.post<{ logoUrl: string }>(
                '/settings/practice/logo',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        },
    },

    // Providers
    providers: {
        getAll: async (): Promise<Provider[]> => {
            const response = await apiClient.get<{ providers: Provider[] }>(
                '/settings/providers'
            );
            return response.data.providers;
        },

        getById: async (id: string): Promise<Provider> => {
            const response = await apiClient.get<{ provider: Provider }>(
                `/settings/providers/${id}`
            );
            return response.data.provider;
        },

        create: async (data: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider> => {
            const response = await apiClient.post<{ provider: Provider }>(
                '/settings/providers',
                data
            );
            return response.data.provider;
        },

        update: async (id: string, data: Partial<Provider>): Promise<Provider> => {
            const response = await apiClient.put<{ provider: Provider }>(
                `/settings/providers/${id}`,
                data
            );
            return response.data.provider;
        },

        delete: async (id: string): Promise<void> => {
            await apiClient.delete(`/settings/providers/${id}`);
        },
    },

    // Appointment Types
    appointmentTypes: {
        getAll: async (): Promise<AppointmentType[]> => {
            const response = await apiClient.get<{ types: AppointmentType[] }>(
                '/settings/appointment-types'
            );
            return response.data.types;
        },

        getById: async (id: string): Promise<AppointmentType> => {
            const response = await apiClient.get<{ type: AppointmentType }>(
                `/settings/appointment-types/${id}`
            );
            return response.data.type;
        },

        create: async (
            data: Omit<AppointmentType, 'id' | 'createdAt' | 'updatedAt'>
        ): Promise<AppointmentType> => {
            const response = await apiClient.post<{ type: AppointmentType }>(
                '/settings/appointment-types',
                data
            );
            return response.data.type;
        },

        update: async (
            id: string,
            data: Partial<AppointmentType>
        ): Promise<AppointmentType> => {
            const response = await apiClient.put<{ type: AppointmentType }>(
                `/settings/appointment-types/${id}`,
                data
            );
            return response.data.type;
        },

        delete: async (id: string): Promise<void> => {
            await apiClient.delete(`/settings/appointment-types/${id}`);
        },
    },

    // AI Script Configuration
    aiScript: {
        get: async (): Promise<AIScriptConfig> => {
            const response = await apiClient.get<AIScriptConfig>(
                '/settings/ai-script'
            );
            return response.data;
        },

        update: async (data: AIScriptConfig): Promise<AIScriptConfig> => {
            const response = await apiClient.put<AIScriptConfig>(
                '/settings/ai-script',
                data
            );
            return response.data;
        },

        reset: async (): Promise<AIScriptConfig> => {
            const response = await apiClient.post<AIScriptConfig>(
                '/settings/ai-script/reset'
            );
            return response.data;
        },
    },

    // Notification Settings
    notifications: {
        get: async (): Promise<NotificationSettings> => {
            const response = await apiClient.get<NotificationSettings>(
                '/settings/notifications'
            );
            return response.data;
        },

        update: async (
            data: Partial<NotificationSettings>
        ): Promise<NotificationSettings> => {
            const response = await apiClient.put<NotificationSettings>(
                '/settings/notifications',
                data
            );
            return response.data;
        },
    },

    // Team Management
    team: {
        getAll: async (): Promise<TeamMember[]> => {
            const response = await apiClient.get<{ members: TeamMember[] }>(
                '/settings/team'
            );
            return response.data.members;
        },

        invite: async (email: string, role: 'admin' | 'staff' | 'view-only'): Promise<void> => {
            await apiClient.post('/settings/team/invite', { email, role });
        },

        updateRole: async (
            userId: string,
            role: 'admin' | 'staff' | 'view-only'
        ): Promise<TeamMember> => {
            const response = await apiClient.put<{ member: TeamMember }>(
                `/settings/team/${userId}/role`,
                { role }
            );
            return response.data.member;
        },

        deactivate: async (userId: string): Promise<void> => {
            await apiClient.post(`/settings/team/${userId}/deactivate`);
        },

        reactivate: async (userId: string): Promise<void> => {
            await apiClient.post(`/settings/team/${userId}/reactivate`);
        },

        remove: async (userId: string): Promise<void> => {
            await apiClient.delete(`/settings/team/${userId}`);
        },
    },
};
