export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  class: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  fatherName: string;
  motherName: string;
  emergencyContact: string;
  photo?: string;
  bloodGroup: string;
  status: 'active' | 'inactive';
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  dateOfJoining: string;
  salary: number;
  photo?: string;
  qualification: string;
  experience: number;
  status: 'active' | 'inactive';
}

export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  type: 'tuition' | 'transport' | 'library' | 'laboratory' | 'other';
  description: string;
  receiptNumber?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

export interface Class {
  id: string;
  name: string;
  section: string;
  teacherId: string;
  capacity: number;
  currentStrength: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'master_admin' | 'admin' | 'teacher' | 'student' | 'parent';
  firstName: string;
  lastName: string;
  profileId?: string; // Links to Student/Teacher ID
  children?: string[]; // For parents - array of student IDs
  isActive: boolean;
  lastLogin?: string;
}

export interface SchoolSettings {
  id: string;
  schoolName: string;
  schoolNameUrdu: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  principalName: string;
  establishedYear: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  totalMarks: number;
  passingMarks: number;
}

export interface Mark {
  id: string;
  studentId: string;
  subjectId: string;
  examType: 'midterm' | 'final' | 'quiz' | 'assignment' | 'practical';
  marksObtained: number;
  totalMarks: number;
  examDate: string;
  remarks?: string;
  grade?: string;
}

export interface MarkSheet {
  id: string;
  studentId: string;
  class: string;
  section: string;
  examType: 'midterm' | 'final' | 'annual';
  academicYear: string;
  marks: Mark[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  position?: number;
  createdDate: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}