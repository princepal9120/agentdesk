// Utility functions for formatting and manipulation

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// CSS Class Utilities
// ============================================================================

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// ============================================================================
// Date/Time Formatting
// ============================================================================

/**
 * Format date to readable string
 * @example formatDate('2024-11-25') => 'Nov 25, 2024'
 */
export function formatDate(
    date: string | Date,
    formatStr: string = 'MMM dd, yyyy'
): string {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Invalid date';
        return format(dateObj, formatStr);
    } catch {
        return 'Invalid date';
    }
}

/**
 * Format time to readable string
 * @example formatTime('14:30') => '2:30 PM'
 */
export function formatTime(time: string, use24Hour: boolean = false): string {
    try {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        return format(date, use24Hour ? 'HH:mm' : 'h:mm a');
    } catch {
        return time;
    }
}

/**
 * Format date and time together
 * @example formatDateTime('2024-11-25T14:30:00Z') => 'Nov 25, 2024 at 2:30 PM'
 */
export function formatDateTime(dateTime: string | Date): string {
    try {
        const dateObj =
            typeof dateTime === 'string' ? parseISO(dateTime) : dateTime;
        if (!isValid(dateObj)) return 'Invalid date';
        return format(dateObj, 'MMM dd, yyyy \'at\' h:mm a');
    } catch {
        return 'Invalid date';
    }
}

/**
 * Format duration in seconds to readable string
 * @example formatDuration(125) => '2m 5s'
 */
export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
        return `${remainingSeconds}s`;
    }

    return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Get relative time from now
 * @example formatRelativeTime('2024-11-25T10:00:00Z') => '2 hours ago'
 */
export function formatRelativeTime(date: string | Date): string {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Invalid date';
        return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
        return 'Invalid date';
    }
}

// ============================================================================
// Phone Number Formatting
// ============================================================================

/**
 * Format phone number to (XXX) XXX-XXXX
 * @example formatPhoneNumber('1234567890') => '(123) 456-7890'
 */
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length !== 10) {
        return phone; // Return original if not 10 digits
    }

    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

/**
 * Mask phone number for privacy
 * @example maskPhoneNumber('1234567890') => 'xxx-xxx-7890'
 */
export function maskPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length !== 10) {
        return phone;
    }

    return `xxx-xxx-${cleaned.slice(6)}`;
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Capitalize first letter of string
 * @example capitalize('hello') => 'Hello'
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string with ellipsis
 * @example truncate('Hello World', 5) => 'Hello...'
 */
export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return `${str.slice(0, length)}...`;
}

/**
 * Get initials from name
 * @example getInitials('John Doe') => 'JD'
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Mask patient name for privacy (first name + last initial)
 * @example maskPatientName('John Doe') => 'John D.'
 */
export function maskPatientName(fullName: string): string {
    const parts = fullName.trim().split(' ');

    if (parts.length === 1) {
        return parts[0]; // Single name, return as is
    }

    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1][0];

    return `${firstName} ${lastInitial}.`;
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with commas
 * @example formatNumber(1234567) => '1,234,567'
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage
 * @example formatPercentage(0.1234) => '12.34%'
 */
export function formatPercentage(
    value: number,
    decimals: number = 2
): string {
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format currency
 * @example formatCurrency(1234.56) => '$1,234.56'
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (10 digits)
 */
export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
    // At least 8 chars, 1 uppercase, 1 number
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return minLength && hasUppercase && hasNumber;
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Build query string from object
 * @example buildQueryString({ page: 1, limit: 10 }) => '?page=1&limit=10'
 */
export function buildQueryString(
    params: Record<string, string | number | boolean | undefined>
): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

// ============================================================================
// Array Utilities
// ============================================================================

/**
 * Group array by key
 * @example groupBy([{type: 'A', val: 1}, {type: 'B', val: 2}], 'type') => {A: [...], B: [...]}
 */
export function groupBy<T>(
    array: T[],
    key: keyof T
): Record<string, T[]> {
    return array.reduce(
        (result, item) => {
            const groupKey = String(item[key]);
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        },
        {} as Record<string, T[]>
    );
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array));
}

/**
 * Sort array by key
 */
export function sortBy<T>(
    array: T[],
    key: keyof T,
    order: 'asc' | 'desc' = 'asc'
): T[] {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

// ============================================================================
// Local Storage Utilities
// ============================================================================

/**
 * Safely get item from local storage
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;

    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
}

/**
 * Safely set item in local storage
 */
export function setStorageItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Remove item from local storage
 */
export function removeStorageItem(key: string): void {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

// ============================================================================
// Debounce/Throttle
// ============================================================================

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ============================================================================
// File Utilities
// ============================================================================

/**
 * Format file size to human readable
 * @example formatFileSize(1024) => '1 KB'
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Convert file to base64
 */
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

// ============================================================================
// Color Utilities
// ============================================================================

/**
 * Generate random color
 */
export function randomColor(): string {
    const colors = [
        '#2563eb', // blue
        '#10b981', // green
        '#f59e0b', // yellow
        '#ef4444', // red
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#06b6d4', // cyan
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get contrast color (black or white) for background
 */
export function getContrastColor(hexColor: string): string {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
        return (
            error.message.includes('Network') ||
            error.message.includes('Failed to fetch') ||
            error.message.includes('ERR_NETWORK')
        );
    }
    return false;
}
