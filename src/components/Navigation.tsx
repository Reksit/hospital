import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Bed, 
  Users, 
  MapPin, 
  LogOut,
  Bell,
  Settings,
  Truck,
  Stethoscope 
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function Navigation() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  const getNavItems = () => {
    switch (user.role) {
      case 'HOSPITAL_ADMIN':
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: Activity },
          { href: '/admin/beds', label: 'Bed Management', icon: Bed },
          { href: '/admin/staff', label: 'Staff Management', icon: Users },
          { href: '/admin/tracking', label: 'Ambulance Tracking', icon: MapPin },
        ];
      case 'AMBULANCE_DRIVER':
        return [
          { href: '/driver/dashboard', label: 'Dashboard', icon: Truck },
        ];
      case 'DOCTOR':
      case 'NURSE':
        return [
          { href: '/doctor/dashboard', label: 'Dashboard', icon: Stethoscope },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CareFleet</span>
            </Link>

            <div className="hidden md:flex md:ml-10 md:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } border-b-2 px-1 pt-1 pb-4 text-sm font-medium transition-colors duration-200 flex items-center space-x-2`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Settings className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-500 capitalize">
                  {user.role.toLowerCase().replace('_', ' ')}
                </p>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}