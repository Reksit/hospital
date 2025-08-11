export type UserRole = 'HOSPITAL_ADMIN' | 'AMBULANCE_DRIVER' | 'DOCTOR' | 'NURSE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  hospitalId?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  exp: number;
  iat: number;
}

export interface VerifyEmailRequest {
  token: string;
  otp: string;
}