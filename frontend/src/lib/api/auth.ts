import type {
    AuthResponse,
    LoginCredentials,
    SignupCredentials,
    User,
} from '@/types/models';
import { apiClient } from './client';

export const authApi = {
    /**
     * Login with email and password
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/auth/login',
            credentials
        );
        return response.data;
    },

    /**
     * Register a new user
     */
    signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/auth/signup',
            credentials
        );
        return response.data;
    },

    /**
     * Logout and invalidate tokens
     */
    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post('/auth/logout', { refreshToken });
    },

    /**
     * Request password reset email
     */
    requestPasswordReset: async (email: string): Promise<void> => {
        await apiClient.post('/auth/reset-password', { email });
    },

    /**
     * Get current user profile
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<{ user: User }>('/auth/me');
        return response.data.user;
    },

    /**
     * Update user profile
     */
    updateProfile: async (updates: Partial<User>): Promise<User> => {
        const response = await apiClient.put<{ user: User }>(
            '/auth/profile',
            updates
        );
        return response.data.user;
    },

    /**
     * Change password
     */
    changePassword: async (
        currentPassword: string,
        newPassword: string
    ): Promise<void> => {
        await apiClient.post('/auth/change-password', {
            currentPassword,
            newPassword,
        });
    },
};
