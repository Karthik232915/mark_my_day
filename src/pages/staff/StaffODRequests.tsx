import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card, CardContent, CardHeader, CardActions } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../hooks/useAuth';
import { ODRequest, Staff } from '../../types';
import { FileText, Clock, CheckCircle, XCircle, Eye, MessageCircle } from 'lucide-react';

export const StaffODRequests: React.FC = () => {
  const [requests, setRequests] = useState<ODRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ODRequest | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [comments, setComments] = useState('');
  const { state } = useAuth();
  
  const staff = state.user as Staff;

  const fetchRequests = async () => {
    try {
      const fetchedRequests = await apiService.fetchODRequests();
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Failed to fetch OD requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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

  const canApprove = (request: ODRequest) => {
    if (staff.staffRole === 'tutor' && request.status === 'pending') {
      return true;
    }
    if (staff.staffRole === 'hod' && request.status === 'approved_by_tutor') {
      return true;
    }
    return false;
  };

  const handleApprove = async (request: ODRequest) => {
    if (!comments.trim()) {
      alert('Please provide comments before approving.');
      return;
    }

    setActionLoading(true);
    try {
      const updatedRequest = await apiService.approveODRequest(
        request.id,
        comments,
        staff.staffRole
      );
      
      setRequests(prev => 
        prev.map(req => req.id === request.id ? updatedRequest : req)
      );
      
      setSelectedRequest(null);
      setComments('');
    } catch (error) {
      console.error('Failed to approve request:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (request: ODRequest) => {
    if (!comments.trim()) {
      alert('Please provide comments before rejecting.');
      return;
    }

    setActionLoading(true);
    try {
      // Mock reject implementation
      const updatedRequest = {
        ...request,
        status: 'rejected' as ODRequest['status'],
        [staff.staffRole === 'tutor' ? 'tutorComments' : 'hodComments']: comments
      };
      
      setRequests(prev => 
        prev.map(req => req.id === request.id ? updatedRequest : req)
      );
      
      setSelectedRequest(null);
      setComments('');
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (staff.staffRole === 'tutor') {
      return request.status === 'pending' || request.status === 'approved_by_tutor';
    } else if (staff.staffRole === 'hod') {
      return true; // HOD can see all requests
    }
    return false;
  });

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
            <p className="text-gray-600">Review and manage student leave applications</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Role: <span className="font-medium capitalize">{staff.staffRole}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tutor Approved</p>
                  <p className="text-xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'approved_by_tutor').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Fully Approved</p>
                  <p className="text-xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'approved_by_hod').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {request.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{request.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                          <span>Student: <span className="font-medium">{request.studentName}</span></span>
                          <span>Type: <span className="capitalize font-medium">{request.type}</span></span>
                          <span>Category: <span className="capitalize font-medium">{request.category}</span></span>
                          <span>Department: {request.department}</span>
                          {request.eventName && <span>Event: <span className="font-medium">{request.eventName}</span></span>}
                          <span>Duration: {request.dateFrom} to {request.dateTo}</span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-2">{getStatusText(request.status)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      {canApprove(request) && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setComments('');
                            }}
                          >
                            Review
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Found</h3>
                  <p className="text-gray-600">
                    There are no OD requests requiring your attention at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Request Details Panel */}
          {selectedRequest && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Request Details</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedRequest.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{selectedRequest.description}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Student:</span>
                    <span className="font-medium">{selectedRequest.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{selectedRequest.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{selectedRequest.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{selectedRequest.department}</span>
                  </div>
                  {selectedRequest.eventName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event:</span>
                      <span className="font-medium">{selectedRequest.eventName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedRequest.dateFrom} to {selectedRequest.dateTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{new Date(selectedRequest.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {(selectedRequest.tutorComments || selectedRequest.hodComments) && (
                  <div className="space-y-2">
                    {selectedRequest.tutorComments && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-800">Tutor Comments:</p>
                        <p className="text-sm text-blue-700">{selectedRequest.tutorComments}</p>
                      </div>
                    )}
                    {selectedRequest.hodComments && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-800">HOD Comments:</p>
                        <p className="text-sm text-green-700">{selectedRequest.hodComments}</p>
                      </div>
                    )}
                  </div>
                )}

                {canApprove(selectedRequest) && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageCircle className="h-4 w-4 inline mr-1" />
                        Comments *
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Add your comments..."
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApprove(selectedRequest)}
                        loading={actionLoading}
                        className="flex-1"
                        size="sm"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedRequest)}
                        loading={actionLoading}
                        variant="danger"
                        className="flex-1"
                        size="sm"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(null);
                    setComments('');
                  }}
                  className="w-full"
                >
                  Close
                </Button>
              </CardActions>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};