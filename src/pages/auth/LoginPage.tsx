import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { validateEmail, validateRequired } from '../../utils/validators';
import { ArrowLeft, GraduationCap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const institutionType = location.state?.institutionType;
  const role = location.state?.role;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!validateRequired(formData.password) || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login({
        ...formData,
        role,
        institutionType
      });

      if (role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/staff/dashboard');
      }
    } catch (error) {
      setErrors({ submit: 'Invalid credentials. Please try again.' });
    }
  };

  const handleBack = () => {
    navigate('/role-selection', { state: { institutionType } });
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
              <div className="flex-1 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-600 mr-2" />
                <span className="font-semibold text-gray-900">MarkMyDay</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-900">
              Login
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

              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup', { state: { institutionType, role } })}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Sign up here
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
