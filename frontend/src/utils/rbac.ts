/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * PRD Reference: Section 3.3 - Staff Management (RBAC)
 * TRS Reference: Section 7.1 - Auth Flow
 * 
 * This module provides centralized role-based access control for the frontend.
 */

import { UserRole, User } from '@/types';

/**
 * Permission definitions for each role
 * Maps roles to their allowed actions/features
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    patient: [
        'view:own-appointments',
        'create:appointment',
        'reschedule:own-appointment',
        'cancel:own-appointment',
        'view:doctors',
        'view:own-profile',
        'edit:own-profile',
        'view:own-notifications',
    ],
    doctor: [
        'view:all-appointments',
        'view:own-schedule',
        'edit:own-schedule',
        'view:patients',
        'view:own-profile',
        'edit:own-profile',
        'view:analytics',
        'complete:appointment',
        'add:appointment-notes',
    ],
    receptionist: [
        'view:all-appointments',
        'create:appointment',
        'reschedule:any-appointment',
        'cancel:any-appointment',
        'view:doctors',
        'view:patients',
        'send:notifications',
        'view:call-logs',
    ],
    admin: [
        'view:all-appointments',
        'create:appointment',
        'reschedule:any-appointment',
        'cancel:any-appointment',
        'view:doctors',
        'manage:doctors',
        'view:patients',
        'manage:patients',
        'view:analytics',
        'view:compliance',
        'manage:settings',
        'view:billing',
        'manage:billing',
        'view:audit-logs',
        'send:notifications',
        'view:developer-tools',
    ],
};

/**
 * Route access definitions
 * Maps routes to required roles
 */
export const ROUTE_ACCESS: Record<string, UserRole[]> = {
    // Patient routes
    '/dashboard': ['patient', 'doctor', 'admin', 'receptionist'],
    '/appointments': ['patient', 'doctor', 'admin', 'receptionist'],
    '/appointments/book': ['patient', 'receptionist', 'admin'],

    // Doctor-specific routes
    '/doctor/dashboard': ['doctor'],
    '/doctor/schedule': ['doctor'],
    '/doctor/patients': ['doctor'],

    // Admin routes
    '/admin/dashboard': ['admin'],
    '/admin/doctors': ['admin'],
    '/admin/patients': ['admin', 'receptionist'],
    '/admin/settings': ['admin'],

    // Shared routes
    '/analytics': ['doctor', 'admin'],
    '/compliance': ['admin'],
    '/billing': ['admin'],
    '/developer': ['admin'],
    '/settings': ['patient', 'doctor', 'admin', 'receptionist'],
    '/calls': ['admin', 'receptionist'],
    '/help': ['patient', 'doctor', 'admin', 'receptionist'],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.role) return false;

    const permissions = ROLE_PERMISSIONS[user.role as UserRole];
    return permissions?.includes(permission) ?? false;
}

/**
 * Check if a user can access a specific route
 */
export function canAccessRoute(user: User | null, route: string): boolean {
    if (!user || !user.role) return false;

    // Find the matching route pattern
    const routeKey = Object.keys(ROUTE_ACCESS).find(key => {
        if (key === route) return true;
        // Handle dynamic routes (e.g., /appointments/:id)
        if (key.includes(':')) {
            const pattern = key.replace(/:[^/]+/g, '[^/]+');
            return new RegExp(`^${pattern}$`).test(route);
        }
        return false;
    });

    if (!routeKey) {
        // If route not defined, allow access (public or authenticated-only)
        return true;
    }

    const allowedRoles = ROUTE_ACCESS[routeKey];
    return allowedRoles.includes(user.role as UserRole);
}

/**
 * Get the default dashboard route for a user based on their role
 */
export function getDefaultDashboard(role: UserRole): string {
    switch (role) {
        case 'doctor':
            return '/dashboard'; // Doctor uses same dashboard with different view
        case 'admin':
            return '/dashboard'; // Admin uses same dashboard with full access
        case 'receptionist':
            return '/appointments'; // Receptionist starts at appointments
        case 'patient':
        default:
            return '/dashboard';
    }
}

/**
 * Get navigation items based on user role
 */
export function getNavigationForRole(role: UserRole): NavigationItem[] {
    const baseNavigation: NavigationItem[] = [
        { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    ];

    const navigationByRole: Record<UserRole, NavigationItem[]> = {
        patient: [
            ...baseNavigation,
            { name: 'Appointments', path: '/appointments', icon: 'Calendar' },
            { name: 'Help', path: '/help', icon: 'HelpCircle' },
        ],
        doctor: [
            ...baseNavigation,
            { name: 'Appointments', path: '/appointments', icon: 'Calendar' },
            { name: 'Analytics', path: '/analytics', icon: 'BarChart3' },
            { name: 'Help', path: '/help', icon: 'HelpCircle' },
        ],
        receptionist: [
            ...baseNavigation,
            { name: 'Appointments', path: '/appointments', icon: 'Calendar' },
            { name: 'Call Logs', path: '/calls', icon: 'Phone' },
            { name: 'Help', path: '/help', icon: 'HelpCircle' },
        ],
        admin: [
            ...baseNavigation,
            { name: 'Appointments', path: '/appointments', icon: 'Calendar' },
            { name: 'Call Logs', path: '/calls', icon: 'Phone' },
            { name: 'Developer', path: '/developer', icon: 'BarChart3' },
            { name: 'Analytics', path: '/analytics', icon: 'BarChart3' },
            { name: 'Compliance', path: '/compliance', icon: 'Shield' },
            { name: 'Billing', path: '/billing', icon: 'CreditCard' },
            { name: 'Help', path: '/help', icon: 'HelpCircle' },
        ],
    };

    return navigationByRole[role] || baseNavigation;
}

/**
 * Navigation item type
 */
export interface NavigationItem {
    name: string;
    path: string;
    icon: string;
    badge?: number;
    children?: NavigationItem[];
}

/**
 * Check if user is of a specific role
 */
export function isRole(user: User | null, ...roles: UserRole[]): boolean {
    if (!user || !user.role) return false;
    return roles.includes(user.role as UserRole);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
    const displayNames: Record<UserRole, string> = {
        patient: 'Patient',
        doctor: 'Doctor',
        receptionist: 'Receptionist',
        admin: 'Administrator',
    };
    return displayNames[role] || role;
}

