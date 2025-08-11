import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import type { Hospital, Bed, Staff, Patient, Assignment } from '../types/hospital';
import type { Ambulance, EmergencyCall, LocationUpdate } from '../types/ambulance';

// Mock API - Replace with actual backend endpoints
const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await authApi.refreshToken(refreshToken);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${response.accessToken}`;
          return apiClient.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@hospital.com',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Admin',
    role: 'HOSPITAL_ADMIN',
    isEmailVerified: true,
  },
  {
    id: '2',
    email: 'driver@ambulance.com',
    password: 'driver123',
    firstName: 'Mike',
    lastName: 'Driver',
    role: 'AMBULANCE_DRIVER',
    isEmailVerified: true,
  },
  {
    id: '3',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    firstName: 'Sarah',
    lastName: 'Doctor',
    role: 'DOCTOR',
    isEmailVerified: true,
  },
];

// Mock JWT token generation
const generateMockToken = (user: any) => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    isEmailVerified: user.isEmailVerified,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000),
  };
  
  // In a real app, this would be signed by the server
  return btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' })) + '.' +
         btoa(JSON.stringify(payload)) + '.' +
         btoa('mock-signature');
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const accessToken = generateMockToken(user);
    const refreshToken = 'mock-refresh-token';
    
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as any,
        isEmailVerified: user.isEmailVerified,
      },
    };
  },

  register: async (data: RegisterData): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock success
  },

  verifyEmail: async (token: string, otp: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock verification
    const mockUser = mockUsers[0];
    const accessToken = generateMockToken(mockUser);
    const refreshToken = 'mock-refresh-token';
    
    return {
      accessToken,
      refreshToken,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role as any,
        isEmailVerified: true,
      },
    };
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = mockUsers[0];
    const accessToken = generateMockToken(mockUser);
    const newRefreshToken = 'new-mock-refresh-token';
    
    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role as any,
        isEmailVerified: true,
      },
    };
  },
};

// Hospital API
export const hospitalApi = {
  getBeds: async (): Promise<Bed[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        hospitalId: '1',
        bedNumber: 'A101',
        type: 'ICU',
        status: 'OCCUPIED',
        patientId: '1',
        assignedStaffId: '1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        hospitalId: '1',
        bedNumber: 'A102',
        type: 'GENERAL',
        status: 'AVAILABLE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];
  },

  getStaff: async (): Promise<Staff[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        hospitalId: '1',
        employeeId: 'EMP001',
        firstName: 'Dr. Jane',
        lastName: 'Smith',
        role: 'DOCTOR',
        department: 'Emergency',
        shift: 'MORNING',
        isActive: true,
        phoneNumber: '+1234567890',
        email: 'jane.smith@hospital.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];
  },

  getAssignments: async (): Promise<Assignment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        staffId: '3',
        patientId: '1',
        bedId: '1',
        taskType: 'CHECKUP',
        description: 'Morning checkup and vitals',
        priority: 'MEDIUM',
        status: 'PENDING',
        scheduledTime: '2024-01-15T09:00:00Z',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
      },
    ];
  },
};

// Ambulance API
export const ambulanceApi = {
  getAmbulances: async (): Promise<Ambulance[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        licensePlate: 'AMB-001',
        driverId: '2',
        status: 'IN_TRANSIT',
        currentLocation: {
          latitude: 40.7128,
          longitude: -74.0060,
          timestamp: new Date().toISOString(),
        },
        patientOnBoard: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  updateLocation: async (update: LocationUpdate): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Mock success
  },
};