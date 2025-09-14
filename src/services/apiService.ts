import { Event, ODRequest, Student } from '../types';

class ApiService {
  private baseUrl = 'http://localhost:5000/api';
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Mock API methods with realistic data
  async fetchEvents(): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: '1',
        title: 'Annual Sports Day',
        description: 'Inter-department sports competition',
        date: '2025-02-15',
        time: '09:00',
        department: 'All Departments',
        createdBy: 'admin',
        createdAt: '2025-01-10T08:00:00Z'
      },
      {
        id: '2',
        title: 'Technical Symposium',
        description: 'Technical paper presentations and competitions',
        date: '2025-02-20',
        time: '10:00',
        department: 'Computer Science',
        createdBy: 'staff-cs',
        createdAt: '2025-01-12T10:00:00Z'
      }
    ];
  }

  async createEvent(event: Omit<Event, 'id' | 'createdAt'>): Promise<Event> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
  }

  async fetchODRequests(studentId?: string): Promise<ODRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockRequests: ODRequest[] = [
      {
        id: '1',
        studentId: '1',
        studentName: 'John Doe',
        title: 'Medical Appointment',
        description: 'Regular health checkup',
        type: 'medical',
        category: 'other',
        department: 'Computer Science',
        dateFrom: '2025-01-20',
        dateTo: '2025-01-20',
        status: 'pending',
        submittedAt: '2025-01-15T09:00:00Z'
      },
      {
        id: '2',
        studentId: '2',
        studentName: 'Jane Smith',
        title: 'Family Function',
        description: 'Sister\'s wedding ceremony',
        type: 'personal',
        category: 'other',
        department: 'Electronics',
        dateFrom: '2025-01-25',
        dateTo: '2025-01-27',
        status: 'approved_by_tutor',
        tutorComments: 'Approved for family emergency',
        submittedAt: '2025-01-18T14:00:00Z'
      }
    ];
    
    if (studentId) {
      return mockRequests.filter(req => req.studentId === studentId);
    }
    
    return mockRequests;
  }

  async submitODRequest(request: Omit<ODRequest, 'id' | 'status' | 'submittedAt'>): Promise<ODRequest> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
  }

  async approveODRequest(id: string, comments: string, approverRole: 'tutor' | 'hod'): Promise<ODRequest> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockRequest: ODRequest = {
      id,
      studentId: '1',
      studentName: 'John Doe',
      title: 'Medical Appointment',
      description: 'Regular health checkup',
      type: 'medical',
      category: 'other',
      department: 'Computer Science',
      dateFrom: '2025-01-20',
      dateTo: '2025-01-20',
      status: approverRole === 'tutor' ? 'approved_by_tutor' : 'approved_by_hod',
      tutorComments: approverRole === 'tutor' ? comments : undefined,
      hodComments: approverRole === 'hod' ? comments : undefined,
      submittedAt: '2025-01-15T09:00:00Z'
    };
    
    return mockRequest;
  }

  async fetchTopStudents(): Promise<Student[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: '101',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'student',
        institutionType: 'college',
        regNo: 'CS2021001',
        department: 'Computer Science',
        shift: 'morning',
        year: 3,
        attendance: { totalDays: 180, presentDays: 175, absentDays: 5, percentage: 97.2, leavesRemaining: 25 }
      },
      {
        id: '102',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'student',
        institutionType: 'college',
        regNo: 'EE2021002',
        department: 'Electronics',
        shift: 'morning',
        year: 3,
        attendance: { totalDays: 180, presentDays: 172, absentDays: 8, percentage: 95.6, leavesRemaining: 22 }
      }
    ];
  }
}

export const apiService = new ApiService();