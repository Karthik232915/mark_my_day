import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { AttendanceChart } from '../../components/AttendanceChart';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { MOTIVATIONAL_QUOTES } from '../../utils/constants';
import { Student } from '../../types';
import { Calendar, FileText, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { state } = useAuth();
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Random motivational quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);

    // Fake loading for smooth UI
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const student = state.user as Student;

  /** Quick Action Functions */
  const handleSubmitOD = () => {
    // Navigate to OD/Leave request page
    navigate('/student/od-request');
  };

  const handleViewEvents = () => {
    // Navigate to Events page
    navigate('/student/events');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {student.name}!
          </h1>
          <p className="text-primary-100 mb-4">
            {student.department} • {student.year}
            {student.year === 1 ? 'st' : student.year === 2 ? 'nd' : student.year === 3 ? 'rd' : 'th'} Year •{' '}
            {student.shift.charAt(0).toUpperCase() + student.shift.slice(1)} Shift
          </p>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white/90 italic">"{quote}"</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Attendance % */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">{student.attendance.percentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Present Days */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Present Days</p>
                  <p className="text-2xl font-bold text-gray-900">{student.attendance.presentDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaves */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Leaves Left</p>
                  <p className="text-2xl font-bold text-gray-900">{student.attendance.leavesRemaining}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rank */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rank</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {student.attendance.percentage >= 95
                      ? 'Excellent'
                      : student.attendance.percentage >= 85
                      ? 'Good'
                      : student.attendance.percentage >= 75
                      ? 'Average'
                      : 'Below Average'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Chart */}
          <div className="lg:col-span-2">
            <AttendanceChart attendance={student.attendance} />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 p-4 rounded-xl transition-colors text-left"
                onClick={handleSubmitOD}
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Submit OD Request</p>
                    <p className="text-sm text-gray-600">Apply for leave or official duty</p>
                  </div>
                </div>
              </button>

              <button
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl transition-colors text-left"
                onClick={handleViewEvents}
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">View Events</p>
                    <p className="text-sm text-gray-600">Check upcoming college events</p>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
