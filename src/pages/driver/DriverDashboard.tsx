import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Truck,
  Activity,
  User
} from 'lucide-react';
import { ambulanceApi } from '../../services/api';
import { websocketService } from '../../services/websocket';
import { useAuthStore } from '../../stores/authStore';
import type { Ambulance, LocationUpdate, EmergencyCall } from '../../types/ambulance';

export function DriverDashboard() {
  const { user } = useAuthStore();
  const [ambulance, setAmbulance] = useState<Ambulance | null>(null);
  const [currentCall, setCurrentCall] = useState<EmergencyCall | null>(null);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Load driver's ambulance assignment
    loadAmbulanceData();
    
    // Connect to WebSocket for emergency calls
    const token = localStorage.getItem('accessToken');
    if (token) {
      websocketService.connect(token);
      websocketService.subscribeToEmergencyCalls(handleEmergencyCall);
    }

    return () => {
      websocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isLocationSharing && ambulance) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          const locationUpdate: LocationUpdate = {
            ambulanceId: ambulance.id,
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
          };
          
          websocketService.sendLocationUpdate(locationUpdate);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isLocationSharing, ambulance]);

  const loadAmbulanceData = async () => {
    try {
      const ambulances = await ambulanceApi.getAmbulances();
      // Find ambulance assigned to current driver
      const driverAmbulance = ambulances.find(a => a.driverId === user?.id);
      setAmbulance(driverAmbulance || null);
    } catch (error) {
      console.error('Error loading ambulance data:', error);
    }
  };

  const handleEmergencyCall = (call: EmergencyCall) => {
    setCurrentCall(call);
  };

  const toggleLocationSharing = () => {
    if (!isLocationSharing) {
      if (navigator.geolocation) {
        setIsLocationSharing(true);
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    } else {
      setIsLocationSharing(false);
      setCurrentLocation(null);
    }
  };

  const updateAmbulanceStatus = (newStatus: Ambulance['status']) => {
    if (ambulance) {
      setAmbulance({ ...ambulance, status: newStatus });
      // In real app, this would call API
    }
  };

  const completeCall = () => {
    if (currentCall) {
      setCurrentCall(null);
      updateAmbulanceStatus('AVAILABLE');
    }
  };

  if (!ambulance) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.firstName}!</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">No Ambulance Assigned</h3>
              <p className="text-yellow-700">Please contact your dispatcher to get an ambulance assignment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{ambulance.licensePlate}</h2>
              <p className="text-gray-600">Your assigned ambulance</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              ambulance.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
              ambulance.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
              ambulance.status === 'AT_SCENE' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {ambulance.status.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Location Sharing */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Location Sharing</h3>
              <p className="text-gray-600">
                {isLocationSharing ? 'Broadcasting live location' : 'Location sharing disabled'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleLocationSharing}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLocationSharing
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLocationSharing ? 'Stop Sharing' : 'Start Sharing'}
          </button>
        </div>
        
        {currentLocation && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              📍 Current Position: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => updateAmbulanceStatus('AVAILABLE')}
          className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Available</span>
        </button>
        
        <button
          onClick={() => updateAmbulanceStatus('IN_TRANSIT')}
          className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Navigation className="h-5 w-5" />
          <span>En Route</span>
        </button>
        
        <button
          onClick={() => updateAmbulanceStatus('AT_SCENE')}
          className="bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
        >
          <AlertTriangle className="h-5 w-5" />
          <span>On Scene</span>
        </button>
        
        <button
          onClick={() => updateAmbulanceStatus('TO_HOSPITAL')}
          className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Activity className="h-5 w-5" />
          <span>To Hospital</span>
        </button>
      </div>

      {/* Current Emergency Call */}
      {currentCall ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Active Emergency Call</h3>
                <p className="text-red-700">Priority: {currentCall.priority}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-red-600">Call ID: {currentCall.id}</p>
              <p className="text-sm text-red-600">
                {new Date(currentCall.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-900">Description:</h4>
              <p className="text-red-800">{currentCall.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-red-900">Location:</h4>
              <p className="text-red-800">{currentCall.location.address}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-red-900">Caller:</h4>
                <p className="text-red-800">{currentCall.callerName}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="h-4 w-4 text-red-600" />
                  <span className="text-red-800">{currentCall.callerPhone}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-red-900">Patients:</h4>
                <p className="text-red-800">{currentCall.estimatedPatients} estimated</p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => window.open(`tel:${currentCall.callerPhone}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Call Caller</span>
              </button>
              
              <button
                onClick={() => {
                  const { latitude, longitude } = currentCall.location;
                  window.open(`https://maps.google.com/?q=${latitude},${longitude}`);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Navigation className="h-4 w-4" />
                <span>Navigate</span>
              </button>
              
              <button
                onClick={completeCall}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Complete Call</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-900">No Active Calls</h3>
          <p className="text-green-700">You're available and ready for dispatch</p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="p-6 flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Call completed successfully</p>
              <p className="text-xs text-gray-500">Heart attack emergency - Downtown District</p>
            </div>
            <div className="text-sm text-gray-500">2 hours ago</div>
          </div>

          <div className="p-6 flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Patient transported to General Hospital</p>
              <p className="text-xs text-gray-500">Stable condition, successful handoff</p>
            </div>
            <div className="text-sm text-gray-500">2 hours ago</div>
          </div>

          <div className="p-6 flex items-center space-x-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Shift started</p>
              <p className="text-xs text-gray-500">Morning shift - 8:00 AM</p>
            </div>
            <div className="text-sm text-gray-500">6 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);