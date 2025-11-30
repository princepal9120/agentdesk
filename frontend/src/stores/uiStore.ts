// UI state store using Zustand

import { create } from 'zustand';
import type { Toast } from '@/types/models';

interface UIState {
    isSidebarOpen: boolean;
    activeModal: string | null;
    toasts: Toast[];
    isLoading: boolean;

    // Sidebar actions
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;

    // Modal actions
    openModal: (modalId: string) => void;
    closeModal: () => void;

    // Toast actions
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;

    // Loading actions
    setLoading: (isLoading: boolean) => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    activeModal: null,
    toasts: [],
    isLoading: false,

    toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    setSidebarOpen: (isOpen: boolean) =>
        set({ isSidebarOpen: isOpen }),

    openModal: (modalId: string) =>
        set({ activeModal: modalId }),

    closeModal: () =>
        set({ activeModal: null }),

    addToast: (toast: Omit<Toast, 'id'>) =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                {
                    ...toast,
                    id: `toast-${toastIdCounter++}`,
                },
            ],
        })),

    removeToast: (id: string) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),

    clearToasts: () =>
        set({ toasts: [] }),

    setLoading: (isLoading: boolean) =>
        set({ isLoading }),
}));
