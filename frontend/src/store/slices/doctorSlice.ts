import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Doctor, TimeSlot } from '../../types';
import api from '../../services/api';

interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  filters: {
    specialization: string | null;
    search: string;
  };
}

const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  availableSlots: [],
  loading: false,
  error: null,
  filters: {
    specialization: null,
    search: '',
  },
};

// Async Thunks
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/doctors');
      // Backend returns { items: [], total: ... } or just [] depending on pagination
      // Assuming list for now based on backend router
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch doctors');
    }
  }
);

export const fetchDoctorAvailability = createAsyncThunk(
  'doctors/fetchAvailability',
  async ({ doctorId, date, duration = 30 }: { doctorId: string; date: string; duration?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/availability`, {
        params: { 
          date_from: date, 
          date_to: date, 
          duration 
        }
      });
      return response.data.available_slots;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch availability');
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setSelectedDoctor: (state, action: PayloadAction<Doctor | null>) => {
      state.selectedDoctor = action.payload;
      state.availableSlots = []; // Reset slots when doctor changes
    },
    setFilters: (state, action: PayloadAction<Partial<DoctorState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Doctors
    builder.addCase(fetchDoctors.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDoctors.fulfilled, (state, action) => {
      state.loading = false;
      state.doctors = action.payload;
    });
    builder.addCase(fetchDoctors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Availability
    builder.addCase(fetchDoctorAvailability.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDoctorAvailability.fulfilled, (state, action) => {
      state.loading = false;
      state.availableSlots = action.payload;
    });
    builder.addCase(fetchDoctorAvailability.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedDoctor, setFilters, clearErrors } = doctorSlice.actions;
export default doctorSlice.reducer;
