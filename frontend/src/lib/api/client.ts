import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants';
import { useAuthStore } from '@/stores/authStore';
import { mockAdapter } from './mock';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/helpers';

// Token Management Helpers
export const getAuthToken = (): string | null => {
    return getStorageItem<string | null>(TOKEN_KEY, null);
};

export const setAuthToken = (token: string): void => {
    setStorageItem(TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
    return getStorageItem<string | null>(REFRESH_TOKEN_KEY, null);
};

export const setRefreshToken = (token: string): void => {
    setStorageItem(REFRESH_TOKEN_KEY, token);
};

export const clearAuthTokens = (): void => {
    removeStorageItem(TOKEN_KEY);
    removeStorageItem(REFRESH_TOKEN_KEY);
};

// Create Axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    adapter: mockAdapter, // Use mock adapter for demo
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from store
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // For demo mode, we don't need complex refresh logic
        // Just reject the error
        return Promise.reject(error);
    }
);
