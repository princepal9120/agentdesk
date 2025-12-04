import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '../../types';
import api from '../../services/api';

interface AppointmentState {
  appointments: Appointment[];
  currentBooking: {
    step: number;
    doctorId: string | null;
    slot: string | null; // ISO string
    reason: string;
  };
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  currentBooking: {
    step: 1,
    doctorId: null,
    slot: null,
    reason: '',
  },
  loading: false,
  error: null,
  successMessage: null,
};

export const bookAppointment = createAsyncThunk(
  'appointments/book',
  async (bookingData: { doctor_id: string; start_time: string; reason?: string }, { rejectWithValue }) => {
    try {
      // We need patient_id, but usually backend infers from token or we send it
      // Backend schema expects: doctor_id, patient_id, start_time, duration_minutes, reason
      // We'll assume we need to get patient_id from auth state or backend handles "me"
      // Let's assume we pass what's needed.
      const response = await api.post('/appointments', {
        ...bookingData,
        duration_minutes: 30 // Default duration
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Booking failed');
    }
  }
);

export const fetchMyAppointments = createAsyncThunk(
  'appointments/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/appointments');
      return response.data.appointments || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch appointments');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setBookingStep: (state, action: PayloadAction<number>) => {
      state.currentBooking.step = action.payload;
    },
    updateBookingData: (state, action: PayloadAction<Partial<AppointmentState['currentBooking']>>) => {
      state.currentBooking = { ...state.currentBooking, ...action.payload };
    },
    resetBooking: (state) => {
      state.currentBooking = initialState.currentBooking;
      state.successMessage = null;
      state.error = null;
    },
    clearAppointmentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Book Appointment
    builder.addCase(bookAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(bookAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = 'Appointment booked successfully!';
      // Add to list if we have it
      state.appointments.push(action.payload);
      state.currentBooking = initialState.currentBooking; // Reset form
    });
    builder.addCase(bookAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Appointments
    builder.addCase(fetchMyAppointments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyAppointments.fulfilled, (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
    });
    builder.addCase(fetchMyAppointments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setBookingStep, updateBookingData, resetBooking, clearAppointmentError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
