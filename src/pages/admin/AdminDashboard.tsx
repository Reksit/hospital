import { useState, useEffect } from 'react';
import { 
  Activity, 
  Bed as BedIcon, 
  Users, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp 
} from 'lucide-react';
import { hospitalApi, ambulanceApi } from '../../services/api';
import { websocketService } from '../../services/websocket';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { Bed, Staff } from '../../types/hospital';
import type { Ambulance } from '../../types/ambulance';

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bedsData, staffData, ambulancesData] = await Promise.all([
          hospitalApi.getBeds(),
          hospitalApi.getStaff(),
          ambulanceApi.getAmbulances(),
        ]);

        setBeds(bedsData);
        setStaff(staffData);
        setAmbulances(ambulancesData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Connect to WebSocket for real-time updates
    const token = localStorage.getItem('accessToken');
    if (token) {
      websocketService.connect(token);
    }

    return () => {
      websocketService.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const availableBeds = beds.filter(bed => bed.status === 'AVAILABLE').length;
  const occupiedBeds = beds.filter(bed => bed.status === 'OCCUPIED').length;
  const maintenanceBeds = beds.filter(bed => bed.status === 'MAINTENANCE').length;

  const activeStaff = staff.filter(s => s.isActive).length;
  const availableAmbulances = ambulances.filter(a => a.status === 'AVAILABLE').length;
  const inTransitAmbulances = ambulances.filter(a => a.status === 'IN_TRANSIT' || a.status === 'TO_HOSPITAL').length;

  // Mock data for charts
  const bedOccupancyData = [
    { time: '00:00', occupied: 45, available: 15 },
    { time: '04:00', occupied: 42, available: 18 },
    { time: '08:00', occupied: 48, available: 12 },
    { time: '12:00', occupied: 52, available: 8 },
    { time: '16:00', occupied: 47, available: 13 },
    { time: '20:00', occupied: 44, available: 16 },
  ];

  const emergencyCallsData = [
    { hour: '9am', calls: 12 },
    { hour: '10am', calls: 8 },
    { hour: '11am', calls: 15 },
    { hour: '12pm', calls: 22 },
    { hour: '1pm', calls: 18 },
    { hour: '2pm', calls: 14 },
    { hour: '3pm', calls: 19 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hospital Dashboard</h1>
        <p className="text-gray-600">Real-time overview of hospital operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BedIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Beds</p>
              <p className="text-2xl font-bold text-gray-900">{beds.length}</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-4 text-sm">
            <span className="text-green-600">
              {availableBeds} Available
            </span>
            <span className="text-red-600">
              {occupiedBeds} Occupied
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900">{activeStaff}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>On Duty</span>
              <span className="text-green-600 font-medium">
                {Math.round((activeStaff / staff.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ambulances</p>
              <p className="text-2xl font-bold text-gray-900">{ambulances.length}</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-4 text-sm">
            <span className="text-green-600">
              {availableAmbulances} Available
            </span>
            <span className="text-blue-600">
              {inTransitAmbulances} Active
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emergency Calls</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% from yesterday
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bed Occupancy (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bedOccupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="occupied" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Occupied"
              />
              <Line 
                type="monotone" 
                dataKey="available" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Available"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Calls Today</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emergencyCallsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Patient John Doe</span> admitted to Bed A101
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Ambulance AMB-001</span> dispatched to emergency
                </p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Dr. Sarah Johnson</span> started shift in Emergency
                </p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Critical patient alert in <span className="font-medium">ICU Bed C201</span>
                </p>
                <p className="text-xs text-gray-500">20 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}