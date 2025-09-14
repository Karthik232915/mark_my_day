export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff';
  institutionType: 'school' | 'college';
}

export interface Student extends User {
  regNo: string;
  department: string;
  degreeName: string;
  stream: string;
  shift: 'morning' | 'evening';
  year: number;
  attendance: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    percentage: number;
    leavesRemaining: number;
  };
}

export interface Staff extends User {
  staffId: string;
  department: string;
  shift: 'morning' | 'evening';
  staffRole: 'tutor' | 'hod';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  department: string;
  createdBy: string;
  createdAt: string;
}

export interface ODRequest {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  type: 'medical' | 'personal' | 'official' | 'academic';
  category: 'intercollege' | 'intracollege' | 'other';
  department: string;
  eventName?: string;
  dateFrom: string;
  dateTo: string;
  status: 'pending' | 'approved_by_tutor' | 'approved_by_hod' | 'rejected';
  fileUrl?: string;
  tutorComments?: string;
  hodComments?: string;
  submittedAt: string;
}

export interface AuthState {
  user: Student | Staff | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  events: Event[];
  odRequests: ODRequest[];
  topStudents: Student[];
  isLoading: boolean;
  error: string | null;
}