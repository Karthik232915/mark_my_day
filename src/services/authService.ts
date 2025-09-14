import { Student, Staff } from '../types';

export const authService = {
  login: async (credentials: any): Promise<{ user: Student | Staff; token: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.role === 'student') {
      const studentUser: Student = {
        id: '1',
        name: credentials.name,
        email: credentials.email,
        role: 'student',
        institutionType: credentials.institutionType,
        regNo: credentials.regNo,
        department: credentials.department,
        degreeName: credentials.degreeName || 'Bachelor of Technology (B.Tech)',
        stream: credentials.stream || 'Computer Science and Engineering',
        shift: credentials.shift,
        year: credentials.year,
        attendance: {
          totalDays: 180,
          presentDays: 162,
          absentDays: 18,
          percentage: 90,
          leavesRemaining: 12
        }
      };
      
      return {
        user: studentUser,
        token: 'mock-jwt-token-student'
      };
    } else {
      const staffUser: Staff = {
        id: '2',
        name: credentials.name,
        email: credentials.email,
        role: 'staff',
        institutionType: credentials.institutionType,
        staffId: credentials.staffId,
        department: credentials.department,
        shift: credentials.shift,
        staffRole: credentials.staffRole
      };
      
      return {
        user: staffUser,
        token: 'mock-jwt-token-staff'
      };
    }
  },

  signup: async (credentials: any): Promise<{ user: Student | Staff; token: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (credentials.role === 'student') {
      const studentUser: Student = {
        id: Date.now().toString(),
        name: credentials.name,
        email: credentials.email,
        role: 'student',
        institutionType: credentials.institutionType,
        regNo: credentials.regNo,
        department: credentials.department || 'Computer Science',
        degreeName: credentials.degreeName,
        stream: credentials.stream,
        shift: credentials.shift,
        year: credentials.year,
        attendance: {
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          percentage: 0,
          leavesRemaining: 0
        }
      };
      
      return {
        user: studentUser,
        token: 'mock-jwt-token-student-new'
      };
    } else {
      const staffUser: Staff = {
        id: Date.now().toString(),
        name: credentials.name,
        email: credentials.email,
        role: 'staff',
        institutionType: credentials.institutionType,
        staffId: credentials.staffId,
        department: credentials.department || 'Computer Science',
        shift: credentials.shift,
        staffRole: credentials.staffRole
      };
      
      return {
        user: staffUser,
        token: 'mock-jwt-token-staff-new'
      };
    }
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  getCurrentUser: (): { user: Student | Staff | null; token: string | null } => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        return { user, token };
      } catch {
        return { user: null, token: null };
      }
    }
    
    return { user: null, token: null };
  },

  saveAuthData: (user: Student | Staff, token: string): void => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  }
};