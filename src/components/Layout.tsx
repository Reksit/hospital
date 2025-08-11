import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useAuthStore } from '../stores/authStore';

export function Layout() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}