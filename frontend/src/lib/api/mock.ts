import { InternalAxiosRequestConfig, AxiosResponse, AxiosAdapter } from 'axios';
import { User } from '@/types/models';

// Mock Data
const MOCK_USER: User = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Dr. Test User',
    role: 'admin',
    practiceId: 'practice-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const MOCK_TOKEN = 'mock-jwt-token-12345';

export const mockAdapter: AxiosAdapter = async (config) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const { url, method, data } = config;
    const parsedData = data ? JSON.parse(data) : {};

    // Helper to create response
    const success = (data: any): AxiosResponse => ({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
    });

    // Auth Endpoints
    if (url === '/auth/login' && method === 'post') {
        return success({
            user: MOCK_USER,
            token: MOCK_TOKEN,
            refreshToken: 'mock-refresh-token',
        });
    }

    if (url === '/auth/signup' && method === 'post') {
        return success({
            user: { ...MOCK_USER, name: parsedData.name, email: parsedData.email },
            token: MOCK_TOKEN,
            refreshToken: 'mock-refresh-token',
        });
    }

    if (url === '/auth/logout' && method === 'post') {
        return success({ message: 'Logged out successfully' });
    }

    if (url === '/auth/me' && method === 'get') {
        return success({ user: MOCK_USER });
    }

    if (url === '/auth/refresh' && method === 'post') {
        return success({ token: MOCK_TOKEN });
    }

    if (url?.startsWith('/auth/reset-password') && method === 'post') {
        return success({ message: 'Reset link sent' });
    }

    // Appointments Endpoints
    if (url === '/appointments' && method === 'get') {
        return success({
            data: [],
            meta: { total: 0, page: 1, limit: 10 }
        });
    }

    // Analytics Endpoints
    if (url?.startsWith('/analytics')) {
        if (url.includes('metrics')) return success({ metrics: {} });
        if (url.includes('call-volume')) return success({ data: [] });
        if (url.includes('outcomes')) return success({ data: [] });
        if (url.includes('booking-sources')) return success({ data: [] });
        if (url.includes('peak-hours')) return success({ data: [] });
    }

    // Fallback to default adapter for unhandled requests (if any)
    const error: any = new Error('Request failed with status code 404');
    error.response = {
        data: { message: 'Not Found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
    };
    throw error;
};
