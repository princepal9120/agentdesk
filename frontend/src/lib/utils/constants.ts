// Application constants

// ============================================================================
// API Configuration
// ============================================================================

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.medvoice.com/v1';
export const WS_URL =
    process.env.NEXT_PUBLIC_WS_URL || 'wss://api.medvoice.com/ws';

export const API_TIMEOUT = 10000; // 10 seconds

// ============================================================================
// Authentication
// ============================================================================

export const TOKEN_KEY = 'medvoice_token';
export const REFRESH_TOKEN_KEY = 'medvoice_refresh_token';
export const USER_KEY = 'medvoice_user';

export const PASSWORD_MIN_LENGTH = 8;
export const AUTO_LOGOUT_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const MAX_LOGIN_ATTEMPTS = 5;

// ============================================================================
// Appointments
// ============================================================================

export const APPOINTMENT_DURATIONS = [15, 30, 45, 60, 90, 120] as const; // minutes

export const APPOINTMENT_STATUS_COLORS = {
    confirmed: '#10b981', // green
    pending: '#f59e0b', // yellow
    cancelled: '#6b7280', // gray
    completed: '#3b82f6', // blue
    'no-show': '#ef4444', // red
} as const;

export const BOOKING_SOURCE_LABELS = {
    'ai-voice': 'AI Voice',
    manual: 'Manual',
    online: 'Online',
} as const;

export const APPOINTMENT_BUFFER_WARNING = 15; // minutes

// ============================================================================
// Calendar
// ============================================================================

export const CALENDAR_VIEWS = {
    MONTH: 'dayGridMonth',
    WEEK: 'timeGridWeek',
    DAY: 'timeGridDay',
} as const;

export const CALENDAR_TIME_SLOTS = {
    slotDuration: '00:15:00', // 15-minute slots
    slotMinTime: '08:00:00', // 8 AM
    slotMaxTime: '18:00:00', // 6 PM
} as const;

// ============================================================================
// AI Calls
// ============================================================================

export const CALL_OUTCOME_LABELS = {
    booked: 'Booked',
    rescheduled: 'Rescheduled',
    cancelled: 'Cancelled',
    'info-only': 'Info Only',
    escalated: 'Escalated',
} as const;

export const CALL_SENTIMENT_EMOJIS = {
    positive: '😊',
    neutral: '😐',
    negative: '😞',
} as const;

export const CALL_SENTIMENT_COLORS = {
    positive: '#10b981',
    neutral: '#64748b',
    negative: '#ef4444',
} as const;

// ============================================================================
// Analytics
// ============================================================================

export const DATE_RANGE_PRESETS = {
    LAST_7_DAYS: 'Last 7 days',
    LAST_30_DAYS: 'Last 30 days',
    LAST_90_DAYS: 'Last 90 days',
    CUSTOM: 'Custom range',
} as const;

export const CHART_COLORS = {
    primary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    neutral: '#64748b',
} as const;

// ============================================================================
// Pagination
// ============================================================================

export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// ============================================================================
// WebSocket
// ============================================================================

export const WS_RECONNECTION_DELAY = 1000; // 1 second
export const WS_RECONNECTION_ATTEMPTS = 5;
export const WS_HEARTBEAT_INTERVAL = 30000; // 30 seconds

// ============================================================================
// UI
// ============================================================================

export const TOAST_DURATION = {
    SHORT: 3000, // 3 seconds
    MEDIUM: 5000, // 5 seconds
    LONG: 7000, // 7 seconds
} as const;

export const DEBOUNCE_DELAY = {
    SEARCH: 300, // ms
    RESIZE: 150, // ms
    INPUT: 500, // ms
} as const;

// ============================================================================
// Validation
// ============================================================================

export const PHONE_NUMBER_REGEX = /^\d{10}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FILE_SIZE_LIMITS = {
    LOGO: 2 * 1024 * 1024, // 2MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const;

export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
] as const;

// ============================================================================
// Messages
// ============================================================================

export const ERROR_MESSAGES = {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
    SERVER: 'Server error. Please try again later.',
} as const;

export const SUCCESS_MESSAGES = {
    LOGIN: 'Welcome back!',
    LOGOUT: 'You have been logged out successfully.',
    APPOINTMENT_CREATED: 'Appointment created successfully.',
    APPOINTMENT_UPDATED: 'Appointment updated successfully.',
    APPOINTMENT_CANCELLED: 'Appointment cancelled successfully.',
    SETTINGS_SAVED: 'Settings saved successfully.',
    USER_INVITED: 'User invitation sent successfully.',
} as const;

// ============================================================================
// Feature Flags
// ============================================================================

export const FEATURE_FLAGS = {
    ENABLE_SMS: process.env.NEXT_PUBLIC_ENABLE_SMS_FEATURE === 'true',
    ENABLE_ANALYTICS_EXPORT:
        process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_EXPORT === 'true',
    ENABLE_ONBOARDING: process.env.NEXT_PUBLIC_ENABLE_ONBOARDING === 'true',
} as const;

// ============================================================================
// Time Zones
// ============================================================================

export const TIMEZONES = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
] as const;

// ============================================================================
// Days of Week
// ============================================================================

export const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
] as const;

// ============================================================================
// User Roles
// ============================================================================

export const USER_ROLE_LABELS = {
    admin: 'Administrator',
    staff: 'Staff Member',
    'view-only': 'View Only',
} as const;

export const USER_ROLE_PERMISSIONS = {
    admin: [
        'view_all',
        'create',
        'edit',
        'delete',
        'manage_settings',
        'manage_users',
    ],
    staff: ['view_all', 'create', 'edit'],
    'view-only': ['view_all'],
} as const;
