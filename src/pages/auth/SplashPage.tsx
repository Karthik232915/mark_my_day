import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { GraduationCap, School, Building2 } from 'lucide-react';

export const SplashPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'school' | 'college' | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedType) {
      navigate('/role-selection', { state: { institutionType: selectedType } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MarkMyDay</h1>
          <p className="text-gray-600">Smart Attendance Management System</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-center text-gray-900">
              Select Institution Type
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              onClick={() => setSelectedType('school')}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedType === 'school'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <School className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <h3 className="font-semibold">School</h3>
                  <p className="text-sm text-gray-500">For K-12 education institutions</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('college')}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedType === 'college'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <Building2 className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <h3 className="font-semibold">College/University</h3>
                  <p className="text-sm text-gray-500">For higher education institutions</p>
                </div>
              </div>
            </button>

            <Button
              onClick={handleContinue}
              disabled={!selectedType}
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Streamline attendance tracking and management
          </p>
        </div>
      </div>
    </div>
  );
};