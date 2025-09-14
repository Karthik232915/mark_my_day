import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card, CardContent, CardHeader, CardActions } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../hooks/useAuth';
import { ODRequest, Student } from '../../types';
import { DEPARTMENTS, OD_TYPES, OD_CATEGORIES, DEPARTMENT_EVENTS } from '../../utils/constants';
import { Plus, FileText, Clock, CheckCircle, XCircle, Upload } from 'lucide-react';

export const StudentODRequests: React.FC = () => {
  const [requests, setRequests] = useState<ODRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { state } = useAuth();
  
  const student = state.user as Student;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'medical' as ODRequest['type'],
    category: 'other' as ODRequest['category'],
    department: student.department,
    eventName: '',
    dateFrom: '',
    dateTo: '',
    file: null as File | null
  });

  const fetchRequests = async () => {
    try {
      const fetchedRequests = await apiService.fetchODRequests(student.id);
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Failed to fetch OD requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [student.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset event name when category changes
      ...(name === 'category' ? { eventName: '' } : {})
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newRequest = await apiService.submitODRequest({
        studentId: student.id,
        studentName: student.name,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        department: formData.department,
        eventName: formData.eventName || undefined,
        dateFrom: formData.dateFrom,
        dateTo: formData.dateTo,
        fileUrl: formData.file ? 'uploaded-file-url' : undefined
      });

      setRequests(prev => [newRequest, ...prev]);
      setFormData({
        title: '',
        description: '',
        type: 'medical',
        category: 'other',
        department: student.department,
        eventName: '',
        dateFrom: '',
        dateTo: '',
        file: null
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to submit OD request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: ODRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved_by_tutor':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'approved_by_hod':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: ODRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'approved_by_tutor':
        return 'Approved by Tutor';
      case 'approved_by_hod':
        return 'Fully Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: ODRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-800';
      case 'approved_by_tutor':
        return 'bg-blue-50 text-blue-800';
      case 'approved_by_hod':
        return 'bg-green-50 text-green-800';
      case 'rejected':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OD Requests</h1>
            <p className="text-gray-600">Submit and track your leave applications</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* New Request Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Submit New OD Request</h3>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <FormInput
                  name="title"
                  label="Request Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Medical Appointment"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Provide details about your request..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {OD_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {OD_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.category === 'intracollege' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Name *
                      </label>
                      <select
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Event</option>
                        {DEPARTMENT_EVENTS[formData.department as keyof typeof DEPARTMENT_EVENTS]?.map(event => (
                          <option key={event} value={event}>{event}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {formData.category === 'intercollege' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.category === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="dateFrom"
                    type="date"
                    label="From Date"
                    value={formData.dateFrom}
                    onChange={handleInputChange}
                    required
                  />

                  <FormInput
                    name="dateTo"
                    type="date"
                    label="To Date"
                    value={formData.dateTo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Document
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 rounded-xl border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="mt-2 text-base text-gray-600">
                        {formData.file ? formData.file.name : 'Click to upload file'}
                      </span>
                      <span className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardActions className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  Submit Request
                </Button>
              </CardActions>
            </form>
          </Card>
        )}

        {/* Requests List */}
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {request.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Type: <span className="capitalize font-medium">{request.type}</span></span>
                        <span>Category: <span className="capitalize font-medium">{request.category}</span></span>
                        <span>Department: {request.department}</span>
                        {request.eventName && <span>Event: <span className="font-medium">{request.eventName}</span></span>}
                        <span>Duration: {request.dateFrom} to {request.dateTo}</span>
                        <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-2">{getStatusText(request.status)}</span>
                      </span>
                    </div>
                  </div>

                  {(request.tutorComments || request.hodComments) && (
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      {request.tutorComments && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-800">Tutor Comments:</p>
                          <p className="text-sm text-blue-700">{request.tutorComments}</p>
                        </div>
                      )}
                      {request.hodComments && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-green-800">HOD Comments:</p>
                          <p className="text-sm text-green-700">{request.hodComments}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No OD Requests</h3>
              <p className="text-gray-600 mb-4">
                You haven't submitted any OD requests yet.
              </p>
              <Button onClick={() => setShowForm(true)}>
                Submit Your First Request
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};