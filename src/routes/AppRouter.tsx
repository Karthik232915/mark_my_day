import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppStateProvider } from '../context/AppStateProvider';

// Auth Pages
import { SplashPage } from '../pages/auth/SplashPage';
import { RoleSelectionPage } from '../pages/auth/RoleSelectionPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentEvents } from '../pages/student/StudentEvents';
import { StudentODRequests } from '../pages/student/StudentODRequests';
import { StudentProfile } from '../pages/student/StudentProfile';

// Staff Pages
import { StaffDashboard } from '../pages/staff/StaffDashboard';
import { StaffEvents } from '../pages/staff/StaffEvents';
import { StaffODRequests } from '../pages/staff/StaffODRequests';
import { StaffProfile } from '../pages/staff/StaffProfile';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'student' | 'staff' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { state } = useAuth();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && state.user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { state } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/events"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/od-requests"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentODRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute requiredRole="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/events"
        element={
          <ProtectedRoute requiredRole="staff">
            <StaffEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/od-requests"
        element={
          <ProtectedRoute requiredRole="staff">
            <StaffODRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/students"
        element={
          <ProtectedRoute requiredRole="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/profile"
        element={
          <ProtectedRoute requiredRole="staff">
            <StaffProfile />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={
              state.isAuthenticated 
                ? state.user?.role === 'student' 
                  ? '/student/dashboard' 
                  : '/staff/dashboard'
                : '/'
            } 
            replace 
          />
        } 
      />
    </Routes>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppStateProvider>
          <AppRoutes />
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};