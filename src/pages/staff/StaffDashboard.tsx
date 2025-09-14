import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../hooks/useAuth';
import { MOTIVATIONAL_QUOTES } from '../../utils/constants';
import { Staff, Student } from '../../types';
import { Users, FileText, Calendar, TrendingUp, Award, UserCheck } from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { state } = useAuth();
  const [quote, setQuote] = useState('');
  const [topStudents, setTopStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const staff = state.user as Staff;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set random motivational quote
        const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
        setQuote(randomQuote);
        
        // Fetch top students
        const students = await apiService.fetchTopStudents();
        setTopStudents(students.slice(0, 10)); // Top 10 students
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {staff.name}!
          </h1>
          <p className="text-primary-100 mb-4">
            {staff.staffRole === 'hod' ? 'Head of Department' : 'Tutor'} • {staff.department} • {staff.shift.charAt(0).toUpperCase() + staff.shift.slice(1)} Shift
          </p>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white/90 italic">"{quote}"</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending ODs</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Events</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Students */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Top 10 Students by Attendance</h3>
                    <p className="text-sm text-gray-600">Highest attendance percentages</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                      index < 3 ? 'bg-gradient-to-r from-primary-50 to-secondary-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.regNo} • {student.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">{student.attendance.percentage}%</p>
                      <p className="text-sm text-gray-600">{student.attendance.presentDays}/{student.attendance.totalDays}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <button className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 p-4 rounded-xl transition-colors text-left">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Manage Events</p>
                    <p className="text-sm text-gray-600">Create and edit events</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-xl transition-colors text-left">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Review OD Requests</p>
                    <p className="text-sm text-gray-600">Approve or reject requests</p>
                  </div>
                </div>
              </button>

              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl transition-colors text-left">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Mark Attendance</p>
                    <p className="text-sm text-gray-600">Take student attendance</p>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                <div>
                  <p className="text-sm font-medium text-green-800">OD Request approved</p>
                  <p className="text-xs text-green-600">Medical appointment for John Doe - 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                <div>
                  <p className="text-sm font-medium text-blue-800">New event created</p>
                  <p className="text-xs text-blue-600">Technical Symposium scheduled - 4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-4"></div>
                <div>
                  <p className="text-sm font-medium text-purple-800">Attendance marked</p>
                  <p className="text-xs text-purple-600">CS Section A - Morning batch completed - 6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};