import React from 'react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { TrendingUp, Calendar, Clock } from 'lucide-react';

interface AttendanceChartProps {
  attendance: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    percentage: number;
    leavesRemaining: number;
  };
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ attendance }) => {
  const { totalDays, presentDays, absentDays, percentage, leavesRemaining } = attendance;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
          <TrendingUp className="h-5 w-5 text-primary-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Circular Progress */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32" viewBox="0 0 36 36">
                <path
                  className="stroke-current text-gray-200"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-current text-primary-600 transition-all duration-1000 ease-in-out"
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                <span className="text-xs text-gray-500">Attendance</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Present Days</p>
                  <p className="text-lg font-bold text-green-900">{presentDays}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-800">Absent Days</p>
                  <p className="text-lg font-bold text-red-900">{absentDays}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-800">Leaves Remaining</p>
                <p className="text-xl font-bold text-blue-900">{leavesRemaining}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-800">Total Days</p>
                <p className="text-xl font-bold text-blue-900">{totalDays}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};