import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Users, UserCheck, ArrowLeft } from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'staff' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const institutionType = location.state?.institutionType;

  const handleContinue = (action: 'login' | 'signup') => {
    if (selectedRole && institutionType) {
      navigate(`/${action}`, { 
        state: { 
          institutionType, 
          role: selectedRole 
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-900">
              Select Your Role
            </h2>
            <p className="text-center text-gray-600 capitalize">
              {institutionType} - Choose how you'll use MarkMyDay
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              onClick={() => setSelectedRole('student')}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === 'student'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <h3 className="font-semibold">Student</h3>
                  <p className="text-sm text-gray-500">
                    Track attendance, view events, submit OD requests
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('staff')}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === 'staff'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <h3 className="font-semibold">Staff</h3>
                  <p className="text-sm text-gray-500">
                    Manage events, approve requests, track student attendance
                  </p>
                </div>
              </div>
            </button>

            <div className="space-y-3">
              <Button
                onClick={() => handleContinue('login')}
                disabled={!selectedRole}
                className="w-full"
                size="lg"
              >
                I have an account - Login
              </Button>
              
              <Button
                onClick={() => handleContinue('signup')}
                disabled={!selectedRole}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Create new account - Sign up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};