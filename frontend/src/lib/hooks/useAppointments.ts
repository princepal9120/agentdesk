// Custom React hook for appointments

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments';
import { queryKeys } from '../utils/query-keys';
import type {
    Appointment,
    AppointmentFilters,
    CreateAppointmentInput,
    UpdateAppointmentInput,
} from '@/types/models';

export function useAppointments(filters?: AppointmentFilters) {
    const queryClient = useQueryClient();

    // Fetch appointments
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.appointments.list(filters || {}),
        queryFn: () => appointmentsApi.getAll(filters),
        staleTime: 30_000, // 30 seconds
    });

    // Create appointment mutation
    const createMutation = useMutation({
        mutationFn: appointmentsApi.create,
        onSuccess: (newAppointment) => {
            // Invalidate and refetch appointments
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });

            // Optimistically add to cache
            queryClient.setQueryData(
                queryKeys.appointments.detail(newAppointment.id),
                newAppointment
            );
        },
    });

    // Update appointment mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateAppointmentInput;
        }) => appointmentsApi.update(id, data),
        onSuccess: (updatedAppointment) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
            queryClient.setQueryData(
                queryKeys.appointments.detail(updatedAppointment.id),
                updatedAppointment
            );
        },
    });

    // Cancel appointment mutation
    const cancelMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            appointmentsApi.cancel(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
        },
    });

    // Reschedule appointment mutation
    const rescheduleMutation = useMutation({
        mutationFn: ({
            id,
            newDate,
            newTime,
            reason,
        }: {
            id: string;
            newDate: string;
            newTime: string;
            reason: string;
        }) => appointmentsApi.reschedule(id, newDate, newTime, reason),
        onSuccess: (updatedAppointment) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
            queryClient.setQueryData(
                queryKeys.appointments.detail(updatedAppointment.id),
                updatedAppointment
            );
        },
    });

    return {
        // Data
        appointments: data?.appointments ?? [],
        isLoading,
        error,
        refetch,

        // Mutations
        createAppointment: createMutation.mutateAsync,
        updateAppointment: updateMutation.mutateAsync,
        cancelAppointment: cancelMutation.mutateAsync,
        rescheduleAppointment: rescheduleMutation.mutateAsync,

        // Mutation states
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isCancelling: cancelMutation.isPending,
        isRescheduling: rescheduleMutation.isPending,
    };
}

// Hook for single appointment
export function useAppointment(id: string) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.appointments.detail(id),
        queryFn: () => appointmentsApi.getById(id),
        enabled: !!id,
    });

    return {
        appointment: data,
        isLoading,
        error,
    };
}

// Hook for checking availability
export function useAppointmentAvailability() {
    const checkAvailabilityMutation = useMutation({
        mutationFn: ({
            providerId,
            date,
            duration,
        }: {
            providerId: string;
            date: string;
            duration: number;
        }) => appointmentsApi.checkAvailability(providerId, date, duration),
    });

    return {
        checkAvailability: checkAvailabilityMutation.mutateAsync,
        availableSlots: checkAvailabilityMutation.data?.availableSlots ?? [],
        isChecking: checkAvailabilityMutation.isPending,
    };
}
