import { create } from 'zustand';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    updateProfile: (id: string, name: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('userInfo') || 'null'),
    isAuthenticated: !!localStorage.getItem('userInfo'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Login failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5000/api/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Signup failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    updateProfile: async (id, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id, name }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data, isLoading: false });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Update failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('userInfo');
        set({ user: null, isAuthenticated: false });
    },

    clearError: () => set({ error: null })
}));
