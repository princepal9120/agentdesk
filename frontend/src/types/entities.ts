export type UserRole = 'patient' | 'doctor' | 'admin' | 'receptionist';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  patient_id?: string;  // Set when role is patient
  doctor_id?: string;   // Set when role is doctor
  created_at?: string;
  updated_at?: string;
}

export interface Patient {
  id: string;
  user_id: string;
  date_of_birth: string;
  medical_history?: string; // Encrypted/Decrypted on backend, but string here
  allergies?: string;
  emergency_contact?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  preferred_contact_method: 'sms' | 'email' | 'call';
  sms_consent: boolean;
  email_consent: boolean;
  call_consent: boolean;
  user?: User;
}

export interface Doctor {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  license_number: string;
  phone_number: string;
  bio?: string;
  image_url?: string;
  clinic_address?: string;
  consultation_fee: number;
  working_hours: Record<string, any>; // JSON structure for hours
  appointment_duration_minutes: number;
  buffer_time_minutes: number;
  is_active: boolean;
  user?: User;
}

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  status: AppointmentStatus;
  type: string;
  reason?: string;
  notes?: string;
  cancellation_reason?: string;
  confirmation_code?: string;
  is_telemedicine: boolean;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
  patient?: Patient;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Notification {
  id: string;
  patient_id: string;
  type: 'sms' | 'email' | 'call';
  status: 'scheduled' | 'sent' | 'delivered' | 'failed';
  recipient_address: string;
  message_template?: string;
  message_body?: string;
  scheduled_for: string;
  sent_at?: string;
  delivered_at?: string;
  failure_reason?: string;
}
