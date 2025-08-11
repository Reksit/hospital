export interface Ambulance {
  id: string;
  licensePlate: string;
  driverId?: string;
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'AT_SCENE' | 'TO_HOSPITAL' | 'MAINTENANCE';
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  destinationHospitalId?: string;
  patientOnBoard: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocationUpdate {
  ambulanceId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
  heading?: number;
}

export interface EmergencyCall {
  id: string;
  ambulanceId?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description: string;
  callerName: string;
  callerPhone: string;
  estimatedPatients: number;
  dispatchTime?: string;
  arrivalTime?: string;
  completionTime?: string;
  createdAt: string;
  updatedAt: string;
}