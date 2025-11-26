export type UserRole = 'admin' | 'doctor' | 'staff';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    practiceId: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
    practiceName: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
export type AppointmentType = 'consultation' | 'follow-up' | 'check-up' | 'emergency';

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
    doctorId: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    type: AppointmentType;
    notes?: string;
    aiSummary?: string;
    createdAt: string;
    updatedAt: string;
}

export type CallOutcome = 'booked' | 'rescheduled' | 'cancelled' | 'inquiry' | 'voicemail' | 'escalated';
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

export interface DashboardMetrics {
    totalAppointments: number;
    confirmedAppointments: number;
    pendingFollowUps: number;
    aiHandledCalls: number;
    aiSuccessRate: number;
    estimatedTimeSaved: number; // minutes
}

export interface DateRange {
    startDate: string;
    endDate: string;
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

export type BookingSource = 'ai-voice' | 'online' | 'manual';

export interface BookingSourceData {
    source: BookingSource;
    count: number;
}

export interface PeakHourData {
    hour: number;
    count: number;
}
