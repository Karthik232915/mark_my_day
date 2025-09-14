import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { 
  Home, 
  Calendar, 
  FileText, 
  User, 
  LogOut, 
  GraduationCap,
  Users
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!state.user) return null;

  const isStudent = state.user.role === 'student';
  
  const studentNavItems = [
    { icon: Home, label: 'Home', path: '/student/dashboard' },
    { icon: Calendar, label: 'Events', path: '/student/events' },
    { icon: FileText, label: 'OD Requests', path: '/student/od-requests' },
    { icon: User, label: 'Profile', path: '/student/profile' }
  ];

  const staffNavItems = [
    { icon: Home, label: 'Home', path: '/staff/dashboard' },
    { icon: Calendar, label: 'Events', path: '/staff/events' },
    { icon: FileText, label: 'OD Requests', path: '/staff/od-requests' },
    { icon: Users, label: 'Students', path: '/staff/students' },
    { icon: User, label: 'Profile', path: '/staff/profile' }
  ];

  const navItems = isStudent ? studentNavItems : staffNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">MarkMyDay</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {state.user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex-1 flex flex-col items-center py-2 px-1 ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6 pb-20 md:pb-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};