export interface Hospital {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  totalBeds: number;
  availableBeds: number;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Bed {
  id: string;
  hospitalId: string;
  bedNumber: string;
  type: 'ICU' | 'GENERAL' | 'EMERGENCY' | 'MATERNITY' | 'PEDIATRIC';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  patientId?: string;
  assignedStaffId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  hospitalId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  role: 'DOCTOR' | 'NURSE' | 'TECHNICIAN';
  department: string;
  shift: 'MORNING' | 'EVENING' | 'NIGHT';
  isActive: boolean;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber: string;
  emergencyContact: string;
  medicalHistory?: string;
  admissionDate: string;
  bedId?: string;
  assignedDoctorId?: string;
  status: 'ADMITTED' | 'DISCHARGED' | 'CRITICAL' | 'STABLE';
}

export interface Assignment {
  id: string;
  staffId: string;
  patientId: string;
  bedId: string;
  taskType: 'CHECKUP' | 'MEDICATION' | 'SURGERY' | 'DISCHARGE' | 'ADMISSION';
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledTime: string;
  completedTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}