// Authentication store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, SignupCredentials } from '@/types/models';
import { authApi } from '@/lib/api/auth';
import {
    setAuthToken,
    setRefreshToken,
    clearAuthTokens,
    getAuthToken,
} from '@/lib/api/client';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
    setUser: (user: User | null) => void;
    clearError: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.login(credentials);

                    // Store tokens
                    setAuthToken(response.token);
                    setRefreshToken(response.refreshToken);

                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const errorMessage =
                        error instanceof Error ? error.message : 'Login failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                    throw error;
                }
            },

            signup: async (credentials: SignupCredentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.signup(credentials);

                    // Store tokens
                    setAuthToken(response.token);
                    setRefreshToken(response.refreshToken);

                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const errorMessage =
                        error instanceof Error ? error.message : 'Signup failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                    throw error;
                }
            },

            logout: async () => {
                const { token } = get();

                try {
                    if (token) {
                        await authApi.logout(token);
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    // Clear tokens from storage
                    clearAuthTokens();

                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: null,
                    });
                }
            },

            updateUser: (updates: Partial<User>) => {
                const { user } = get();
                if (user) {
                    set({ user: { ...user, ...updates } });
                }
            },

            setUser: (user: User | null) => {
                set({
                    user,
                    isAuthenticated: !!user,
                });
            },

            clearError: () => {
                set({ error: null });
            },

            checkAuth: async () => {
                const token = getAuthToken();

                if (!token) {
                    set({ isAuthenticated: false, user: null });
                    return;
                }

                try {
                    const user = await authApi.getCurrentUser();
                    set({
                        user,
                        token,
                        isAuthenticated: true,
                    });
                } catch (error) {
                    // Token is invalid
                    clearAuthTokens();
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                    });
                }
            },
        }),
        {
            name: 'medvoice-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
