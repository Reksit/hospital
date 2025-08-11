import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BedManagement } from './pages/admin/BedManagement';
import { StaffManagement } from './pages/admin/StaffManagement';
import { AmbulanceTracking } from './pages/admin/AmbulanceTracking';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const { isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN']}>
              <AdminRoutes />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/driver/*" 
          element={
            <ProtectedRoute allowedRoles={['AMBULANCE_DRIVER']}>
              <DriverRoutes />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/doctor/*" 
          element={
            <ProtectedRoute allowedRoles={['DOCTOR', 'NURSE']}>
              <DoctorRoutes />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
}

function DashboardRouter() {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'HOSPITAL_ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'AMBULANCE_DRIVER':
      return <Navigate to="/driver/dashboard" replace />;
    case 'DOCTOR':
    case 'NURSE':
      return <Navigate to="/doctor/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="beds" element={<BedManagement />} />
      <Route path="staff" element={<StaffManagement />} />
      <Route path="tracking" element={<AmbulanceTracking />} />
    </Routes>
  );
}

function DriverRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DriverDashboard />} />
    </Routes>
  );
}

function DoctorRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DoctorDashboard />} />
    </Routes>
  );
}

export default App;