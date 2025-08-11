import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../services/api';
import type { User, LoginCredentials, RegisterData, JWTPayload } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string, otp: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  initializeAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          const decodedToken = jwtDecode<JWTPayload>(response.accessToken);
          
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: {
              id: decodedToken.sub,
              email: decodedToken.email,
              role: decodedToken.role,
              firstName: decodedToken.firstName,
              lastName: decodedToken.lastName,
              isEmailVerified: decodedToken.isEmailVerified,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Login failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register(data);
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Registration failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      verifyEmail: async (token, otp) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.verifyEmail(token, otp);
          const decodedToken = jwtDecode<JWTPayload>(response.accessToken);
          
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: {
              id: decodedToken.sub,
              email: decodedToken.email,
              role: decodedToken.role,
              firstName: decodedToken.firstName,
              lastName: decodedToken.lastName,
              isEmailVerified: true,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Email verification failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          get().logout();
          return;
        }

        try {
          const response = await authApi.refreshToken(refreshToken);
          const decodedToken = jwtDecode<JWTPayload>(response.accessToken);
          
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: {
              id: decodedToken.sub,
              email: decodedToken.email,
              role: decodedToken.role,
              firstName: decodedToken.firstName,
              lastName: decodedToken.lastName,
              isEmailVerified: decodedToken.isEmailVerified,
            },
            isAuthenticated: true,
          });
        } catch (error) {
          get().logout();
        }
      },

      initializeAuth: () => {
        set({ isLoading: true });
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken) {
          try {
            const decodedToken = jwtDecode<JWTPayload>(accessToken);
            const now = Date.now() / 1000;
            
            if (decodedToken.exp > now) {
              set({
                user: {
                  id: decodedToken.sub,
                  email: decodedToken.email,
                  role: decodedToken.role,
                  firstName: decodedToken.firstName,
                  lastName: decodedToken.lastName,
                  isEmailVerified: decodedToken.isEmailVerified,
                },
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              get().refreshToken();
            }
          } catch (error) {
            get().logout();
            set({ isLoading: false });
          }
        } else {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);