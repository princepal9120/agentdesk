export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export const APP_NAME = 'MedVoice Scheduler';

export const TOKEN_KEY = 'medvoice_token';
export const REFRESH_TOKEN_KEY = 'medvoice_refresh_token';

export const PASSWORD_MIN_LENGTH = 8;

export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/calendar',
    CALENDAR: '/calendar',
    AI_CALLS: '/ai-calls',
    ANALYTICS: '/analytics',
    SETTINGS: '/settings',
};
