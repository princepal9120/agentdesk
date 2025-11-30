// Core type definitions for MedVoice Scheduler

// ============================================================================
// User & Authentication Types
// ============================================================================

export type UserRole = 'admin' | 'staff' | 'view-only';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    practiceId: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials extends LoginCredentials {
    practiceName: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
}

// ============================================================================
// Appointment Types
// ============================================================================

export type AppointmentStatus =
    | 'confirmed'
    | 'pending'
    | 'cancelled'
    | 'completed'
    | 'no-show';

export type BookingSource = 'ai-voice' | 'manual' | 'online';

export interface Appointment {
    id: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    appointmentType: string;
    appointmentTypeId: string;
    providerId: string;
    providerName: string;
    date: string; // ISO date string
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    duration: number; // minutes
    status: AppointmentStatus;
    bookingSource: BookingSource;
    notes?: string;
    callId?: string; // Reference to AI call if booked via AI
    reminderSent: boolean;
    noShowRisk: boolean; // Based on patient history
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentInput {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    appointmentTypeId: string;
    providerId: string;
    date: string;
    startTime: string;
    notes?: string;
}

export interface UpdateAppointmentInput {
    date?: string;
    startTime?: string;
    notes?: string;
    status?: AppointmentStatus;
}

export interface AppointmentFilters {
    startDate?: string;
    endDate?: string;
    providerId?: string;
    appointmentTypeId?: string;
    status?: AppointmentStatus;
    bookingSource?: BookingSource;
    searchQuery?: string;
}

// ============================================================================
// AI Call Types
// ============================================================================

export type CallOutcome =
    | 'booked'
    | 'rescheduled'
    | 'cancelled'
    | 'info-only'
    | 'escalated';

export type CallSentiment = 'positive' | 'neutral' | 'negative';

export interface Call {
    id: string;
    timestamp: string;
    patientName?: string;
    patientPhone: string;
    duration: number; // seconds
    outcome: CallOutcome;
    sentiment: CallSentiment;
    transcriptPreview: string;
    appointmentId?: string; // If call resulted in booking
    isFlagged: boolean;
    flagReason?: string;
}

export interface CallDetail extends Call {
    transcript: TranscriptMessage[];
    audioUrl: string;
    sentiment: CallSentiment;
}

export interface TranscriptMessage {
    speaker: 'ai' | 'patient';
    text: string;
    timestamp: number; // seconds from start
}

export interface CallFilters {
    startDate?: string;
    endDate?: string;
    outcome?: CallOutcome;
    sentiment?: CallSentiment;
    searchQuery?: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface DashboardMetrics {
    totalAppointments: number;
    totalAppointmentsChange: number; // percentage
    aiHandledPercentage: number;
    aiHandledChange: number; // percentage
    noShowRate: number;
    noShowRateChange: number; // percentage
    avgTimeSaved: number; // hours per week
    avgTimeSavedChange: number; // percentage
}

export interface CallVolumeData {
    date: string;
    totalCalls: number;
    aiHandledCalls: number;
}

export interface AppointmentOutcome {
    status: AppointmentStatus;
    count: number;
    percentage: number;
}

export interface BookingSourceData {
    source: BookingSource;
    count: number;
}

export interface PeakHourData {
    hour: number; // 0-23
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    callCount: number;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface Practice {
    id: string;
    name: string;
    address: string;
    timezone: string;
    phone: string;
    email: string;
    logo?: string;
    businessHours: BusinessHours[];
    createdAt: string;
    updatedAt: string;
}

export interface BusinessHours {
    dayOfWeek: number; // 0-6
    isOpen: boolean;
    openTime?: string; // HH:mm
    closeTime?: string; // HH:mm
    breakStart?: string; // HH:mm
    breakEnd?: string; // HH:mm
}

export interface Provider {
    id: string;
    name: string;
    email: string;
    specialties: string[];
    workingHours: BusinessHours[];
    defaultAppointmentDuration: number; // minutes
    color: string; // for calendar color-coding
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AppointmentType {
    id: string;
    name: string;
    duration: number; // minutes
    bufferBefore: number; // minutes
    bufferAfter: number; // minutes
    color: string;
    enabledForAI: boolean;
    preparationNotes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AIScriptConfig {
    greetingMessage: string;
    closingMessage: string;
    questions: AIQuestion[];
}

export interface AIQuestion {
    id: string;
    question: string;
    order: number;
    isRequired: boolean;
}

export interface NotificationSettings {
    smsReminders: {
        enabled: boolean;
        timings: string[]; // e.g., ['1 day', '2 hours']
    };
    emailNotifications: {
        newBooking: boolean;
        cancellation: boolean;
        noShow: boolean;
        dailySummary: boolean;
    };
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number; // milliseconds
}

export interface CalendarView {
    view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
    date: Date;
}

export interface PaginationState {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

// ============================================================================
// WebSocket Event Types
// ============================================================================

export type WebSocketEvent =
    | 'appointment:created'
    | 'appointment:updated'
    | 'appointment:cancelled'
    | 'call:incoming'
    | 'call:completed';

export interface AppointmentCreatedEvent {
    type: 'appointment:created';
    payload: Appointment;
}

export interface AppointmentUpdatedEvent {
    type: 'appointment:updated';
    payload: {
        appointmentId: string;
        changes: Partial<Appointment>;
    };
}

export interface AppointmentCancelledEvent {
    type: 'appointment:cancelled';
    payload: {
        appointmentId: string;
        reason: string;
    };
}

export interface CallIncomingEvent {
    type: 'call:incoming';
    payload: {
        callId: string;
        patientPhone: string;
    };
}

export interface CallCompletedEvent {
    type: 'call:completed';
    payload: Call;
}

export type WebSocketEventPayload =
    | AppointmentCreatedEvent
    | AppointmentUpdatedEvent
    | AppointmentCancelledEvent
    | CallIncomingEvent
    | CallCompletedEvent;

// ============================================================================
// API Response Types
// ============================================================================

export interface APIResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface APIError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

// ============================================================================
// Form Types
// ============================================================================

export interface AppointmentFormData {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    appointmentTypeId: string;
    providerId: string;
    date: Date;
    time: string;
    notes?: string;
}

export interface PracticeFormData {
    name: string;
    address: string;
    timezone: string;
    phone: string;
    email: string;
    logo?: File;
}

export interface ProviderFormData {
    name: string;
    email: string;
    specialties: string[];
    defaultAppointmentDuration: number;
    color: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };
