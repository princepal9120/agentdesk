import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api/auth';
import type { LoginCredentials, SignupCredentials } from '@/types/models';

export function useAuth() {
    const {
        user,
        isAuthenticated,
        isLoading: authLoading,
        error,
        login: loginAction,
        signup: signupAction,
        logout: logoutAction,
        updateUser,
        clearError,
    } = useAuthStore();

    const queryClient = useQueryClient();

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => loginAction(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    // Signup mutation
    const signupMutation = useMutation({
        mutationFn: (credentials: SignupCredentials) => signupAction(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: () => logoutAction(),
        onSuccess: () => {
            queryClient.clear();
        },
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: authApi.updateProfile,
        onSuccess: (updatedUser) => {
            updateUser(updatedUser);
            queryClient.setQueryData(['user'], updatedUser);
        },
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: ({
            currentPassword,
            newPassword,
        }: {
            currentPassword: string;
            newPassword: string;
        }) => authApi.changePassword(currentPassword, newPassword),
    });

    // Request password reset mutation
    const requestPasswordResetMutation = useMutation({
        mutationFn: (email: string) => authApi.requestPasswordReset(email),
    });

    return {
        // State
        user,
        isAuthenticated,
        isLoading: authLoading || loginMutation.isPending || signupMutation.isPending,
        error: error || loginMutation.error || signupMutation.error,

        // Actions
        login: loginMutation.mutateAsync,
        signup: signupMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        updateProfile: updateProfileMutation.mutateAsync,
        changePassword: changePasswordMutation.mutateAsync,
        requestPasswordReset: requestPasswordResetMutation.mutateAsync,
        clearError,

        // Mutation states
        isLoggingIn: loginMutation.isPending,
        isSigningUp: signupMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        isResettingPassword: requestPasswordResetMutation.isPending,
    };
}
