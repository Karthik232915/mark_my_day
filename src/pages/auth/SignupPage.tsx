import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { DEPARTMENTS, SHIFTS, DEGREE_NAMES, STREAMS } from '../../utils/constants';
import { validateEmail, validateRequired } from '../../utils/validators';
import { ArrowLeft, GraduationCap, UserPlus } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    regNo: '',
    staffId: '',
    department: '',
    degreeName: '',
    stream: '',
    shift: 'morning' as 'morning' | 'evening',
    year: 1,
    staffRole: 'tutor' as 'tutor' | 'hod'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const institutionType = location.state?.institutionType;
  const role = location.state?.role;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!validateRequired(formData.password) || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (role === 'student') {
      if (!validateRequired(formData.regNo)) {
        newErrors.regNo = 'Registration number is required';
      }
      if (!validateRequired(formData.degreeName)) {
        newErrors.degreeName = 'Degree name is required';
      }
      if (!validateRequired(formData.stream)) {
        newErrors.stream = 'Stream is required';
      }
    } else {
      if (!validateRequired(formData.staffId)) {
        newErrors.staffId = 'Staff ID is required';
      }
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await signup({
        ...formData,
        role,
        institutionType
      });
      
      // Navigate to appropriate dashboard
      if (role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/staff/dashboard');
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
  };

  const handleBack = () => {
    navigate('/role-selection', { state: { institutionType } });
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { institutionType, role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-600 mr-2" />
                <span className="font-semibold text-gray-900">MarkMyDay</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-900">
              {role === 'student' ? 'Student Registration' : 'Staff Registration'}
            </h2>
            <p className="text-center text-gray-600 capitalize">
              {institutionType} - {role}
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
              
              <FormInput
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
              />
              
              {role === 'student' ? (
                <FormInput
                  name="regNo"
                  label="Registration Number"
                  value={formData.regNo}
                  onChange={handleInputChange}
                  error={errors.regNo}
                  placeholder="e.g., CS2021001"
                  required
                />
              ) : (
                <FormInput
                  name="staffId"
                  label="Staff ID"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  error={errors.staffId}
                  placeholder="e.g., STAFF001"
                  required
                />
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift *
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {SHIFTS.map(shift => (
                    <option key={shift.value} value={shift.value}>
                      {shift.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree Name *
                    </label>
                    <select
                      name="degreeName"
                      value={formData.degreeName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Degree</option>
                      {DEGREE_NAMES.map(degree => (
                        <option key={degree} value={degree}>{degree}</option>
                      ))}
                    </select>
                    {errors.degreeName && (
                      <p className="mt-2 text-sm text-red-600">{errors.degreeName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stream *
                    </label>
                    <select
                      name="stream"
                      value={formData.stream}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Stream</option>
                      {STREAMS.map(stream => (
                        <option key={stream} value={stream}>{stream}</option>
                      ))}
                    </select>
                    {errors.stream && (
                      <p className="mt-2 text-sm text-red-600">{errors.stream}</p>
                    )}
                  </div>
                </div>
              )}
              
              {role === 'student' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="staffRole"
                    value={formData.staffRole}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="tutor">Tutor</option>
                    <option value="hod">Head of Department</option>
                  </select>
                </div>
              )}
              
              <FormInput
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              
              <FormInput
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
              />
              
              <FormInput
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
              />
              
              <Button type="submit" className="w-full" size="lg">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={handleLoginRedirect}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
