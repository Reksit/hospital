import { useState, useEffect } from 'react';
import { MapPin, Truck, Navigation, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { ambulanceApi } from '../../services/api';
import { websocketService } from '../../services/websocket';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { Ambulance, LocationUpdate } from '../../types/ambulance';

export function AmbulanceTracking() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmbulance, setSelectedAmbulance] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });

  useEffect(() => {
    loadAmbulances();

    // Connect to WebSocket for real-time location updates
    const token = localStorage.getItem('accessToken');
    if (token) {
      websocketService.connect(token);
      websocketService.subscribeToLocationUpdates(handleLocationUpdate);
    }

    return () => {
      websocketService.unsubscribeFromLocationUpdates();
      websocketService.disconnect();
    };
  }, []);

  const loadAmbulances = async () => {
    try {
      const data = await ambulanceApi.getAmbulances();
      setAmbulances(data);
    } catch (error) {
      console.error('Error loading ambulances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationUpdate = (update: LocationUpdate) => {
    setAmbulances(prev => prev.map(ambulance => 
      ambulance.id === update.ambulanceId
        ? {
            ...ambulance,
            currentLocation: {
              latitude: update.latitude,
              longitude: update.longitude,
              timestamp: update.timestamp,
            }
          }
        : ambulance
    ));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      AVAILABLE: 'text-green-600 bg-green-100',
      IN_TRANSIT: 'text-blue-600 bg-blue-100',
      AT_SCENE: 'text-orange-600 bg-orange-100',
      TO_HOSPITAL: 'text-purple-600 bg-purple-100',
      MAINTENANCE: 'text-gray-600 bg-gray-100',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
      case 'TO_HOSPITAL':
        return <Navigation className="h-4 w-4" />;
      case 'AT_SCENE':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading ambulance data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ambulance Tracking</h1>
        <p className="text-gray-600">Real-time tracking of ambulance fleet</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{ambulances.length}</div>
          <div className="text-sm text-gray-600">Total Fleet</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {ambulances.filter(a => a.status === 'AVAILABLE').length}
          </div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {ambulances.filter(a => a.status === 'IN_TRANSIT').length}
          </div>
          <div className="text-sm text-gray-600">En Route</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {ambulances.filter(a => a.status === 'AT_SCENE').length}
          </div>
          <div className="text-sm text-gray-600">On Scene</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {ambulances.filter(a => a.status === 'TO_HOSPITAL').length}
          </div>
          <div className="text-sm text-gray-600">To Hospital</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ambulance List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Ambulances</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {ambulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedAmbulance === ambulance.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedAmbulance(ambulance.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Truck className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ambulance.licensePlate}
                        </div>
                        <div className="text-xs text-gray-500">
                          Driver: {ambulance.driverId ? `#${ambulance.driverId}` : 'Unassigned'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ambulance.status)}`}>
                        {getStatusIcon(ambulance.status)}
                        <span className="ml-1">{ambulance.status.replace('_', ' ')}</span>
                      </div>
                      {ambulance.currentLocation && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(ambulance.currentLocation.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {ambulance.patientOnBoard && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      👤 Patient on board
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-96 flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Live Map View</h3>
              <p className="text-gray-500 mb-4">
                Real-time ambulance tracking powered by Google Maps
              </p>
              <div className="text-sm text-gray-400">
                🗺️ Integration with Google Maps API required
              </div>
            </div>

            {/* Mock location markers */}
            <div className="absolute top-4 left-4 bg-blue-600 text-white p-2 rounded-lg text-xs">
              📍 AMB-001: Downtown Hospital
            </div>
            <div className="absolute top-16 left-4 bg-orange-600 text-white p-2 rounded-lg text-xs">
              🚨 AMB-002: Emergency Scene
            </div>
            <div className="absolute top-28 left-4 bg-green-600 text-white p-2 rounded-lg text-xs">
              ✅ AMB-003: Station Ready
            </div>

            {selectedAmbulance && (
              <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg border border-gray-200 shadow-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Selected: {ambulances.find(a => a.id === selectedAmbulance)?.licensePlate}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div className="font-medium">
                      {ambulances.find(a => a.id === selectedAmbulance)?.status.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Update:</span>
                    <div className="font-medium">
                      {ambulances.find(a => a.id === selectedAmbulance)?.currentLocation?.timestamp
                        ? new Date(ambulances.find(a => a.id === selectedAmbulance)!.currentLocation!.timestamp).toLocaleTimeString()
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Calls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Emergency Calls</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {/* Mock emergency calls */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Cardiac Emergency - Downtown District
                </div>
                <div className="text-xs text-gray-500">
                  📍 123 Main Street • Called by: John Smith • Priority: CRITICAL
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-blue-600">AMB-001 Dispatched</div>
              <div className="text-xs text-gray-500">ETA: 8 minutes</div>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Traffic Accident - Highway 101
                </div>
                <div className="text-xs text-gray-500">
                  📍 Highway 101, Mile 15 • Called by: Sarah Johnson • Priority: HIGH
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-orange-600">AMB-002 On Scene</div>
              <div className="text-xs text-gray-500">Arrived 5 min ago</div>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Medical Transport - Elderly Care
                </div>
                <div className="text-xs text-gray-500">
                  📍 Sunset Retirement Home • Scheduled Transport • Priority: LOW
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">Completed</div>
              <div className="text-xs text-gray-500">30 min ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}