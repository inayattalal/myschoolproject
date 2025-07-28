import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, Teacher, Fee, Attendance, Class, Subject, Mark, MarkSheet, SchoolSettings } from '../types';

interface SchoolContextType {
  students: Student[];
  teachers: Teacher[];
  fees: Fee[];
  attendance: Attendance[];
  classes: Class[];
  subjects: Subject[];
  marks: Mark[];
  markSheets: MarkSheet[];
  schoolSettings: SchoolSettings;
  updateSchoolSettings: (settings: Partial<SchoolSettings>) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  addFee: (fee: Fee) => void;
  updateFee: (id: string, fee: Partial<Fee>) => void;
  addAttendance: (attendance: Attendance) => void;
  addClass: (classData: Class) => void;
  addSubject: (subject: Subject) => void;
  addMark: (mark: Mark) => void;
  updateMark: (id: string, mark: Partial<Mark>) => void;
  addMarkSheet: (markSheet: MarkSheet) => void;
}

const defaultSchoolSettings: SchoolSettings = {
  id: '1',
  schoolName: 'Inayat Public School',
  schoolNameUrdu: 'عنایت پبلک سکول',
  logo: 'shield',
  address: 'Kumber, Maidan, Khyber Pakhtunkhwa',
  phone: '+92-XXX-XXXXXXX',
  email: 'info@inayatschool.edu.pk',
  principalName: 'Principal Name',
  establishedYear: '2010',
  updatedBy: 'System',
  updatedAt: new Date().toISOString()
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// Sample data for demonstration
const sampleStudents: Student[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1234567890',
    dateOfBirth: '2005-03-15',
    address: '123 Main St, City, State 12345',
    class: '10',
    section: 'A',
    rollNumber: 'STU001',
    admissionDate: '2020-04-01',
    fatherName: 'Robert Doe',
    motherName: 'Sarah Doe',
    emergencyContact: '+1234567891',
    bloodGroup: 'A+',
    status: 'active'
  },
  {
    id: '2',
    firstName: 'Emma',
    lastName: 'Smith',
    email: 'emma.smith@email.com',
    phone: '+1234567892',
    dateOfBirth: '2005-07-22',
    address: '456 Oak Ave, City, State 12345',
    class: '10',
    section: 'B',
    rollNumber: 'STU002',
    admissionDate: '2020-04-01',
    fatherName: 'Michael Smith',
    motherName: 'Lisa Smith',
    emergencyContact: '+1234567893',
    bloodGroup: 'B+',
    status: 'active'
  }
];

const sampleTeachers: Teacher[] = [
  {
    id: '1',
    firstName: 'Dr. Jane',
    lastName: 'Wilson',
    email: 'jane.wilson@school.edu',
    phone: '+1234567894',
    subject: 'Mathematics',
    department: 'Science',
    dateOfJoining: '2018-06-01',
    salary: 45000,
    qualification: 'PhD in Mathematics',
    experience: 8,
    status: 'active'
  }
];

const sampleFees: Fee[] = [
  {
    id: '1',
    studentId: '1',
    amount: 500,
    dueDate: '2024-01-15',
    status: 'pending',
    type: 'tuition',
    description: 'Monthly Tuition Fee - January 2024'
  }
];

const sampleSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', code: 'MATH', totalMarks: 100, passingMarks: 40 },
  { id: '2', name: 'English', code: 'ENG', totalMarks: 100, passingMarks: 40 },
  { id: '3', name: 'Physics', code: 'PHY', totalMarks: 100, passingMarks: 40 },
  { id: '4', name: 'Chemistry', code: 'CHEM', totalMarks: 100, passingMarks: 40 },
  { id: '5', name: 'Biology', code: 'BIO', totalMarks: 100, passingMarks: 40 },
  { id: '6', name: 'Urdu', code: 'URD', totalMarks: 100, passingMarks: 40 },
  { id: '7', name: 'Islamiat', code: 'ISL', totalMarks: 100, passingMarks: 40 },
  { id: '8', name: 'Pakistan Studies', code: 'PST', totalMarks: 100, passingMarks: 40 }
];

const sampleMarks: Mark[] = [
  {
    id: '1',
    studentId: '1',
    subjectId: '1',
    examType: 'midterm',
    marksObtained: 85,
    totalMarks: 100,
    examDate: '2024-01-15',
    grade: 'A'
  },
  {
    id: '2',
    studentId: '1',
    subjectId: '2',
    examType: 'midterm',
    marksObtained: 78,
    totalMarks: 100,
    examDate: '2024-01-16',
    grade: 'B+'
  }
];

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(sampleTeachers);
  const [fees, setFees] = useState<Fee[]>(sampleFees);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(sampleSubjects);
  const [marks, setMarks] = useState<Mark[]>(sampleMarks);
  const [markSheets, setMarkSheets] = useState<MarkSheet[]>([]);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(defaultSchoolSettings);

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const addTeacher = (teacher: Teacher) => {
    setTeachers(prev => [...prev, teacher]);
  };

  const updateTeacher = (id: string, updatedTeacher: Partial<Teacher>) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
    ));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== id));
  };

  const addFee = (fee: Fee) => {
    setFees(prev => [...prev, fee]);
  };

  const updateFee = (id: string, updatedFee: Partial<Fee>) => {
    setFees(prev => prev.map(fee => 
      fee.id === id ? { ...fee, ...updatedFee } : fee
    ));
  };

  const addAttendance = (attendanceRecord: Attendance) => {
    setAttendance(prev => [...prev, attendanceRecord]);
  };

  const addClass = (classData: Class) => {
    setClasses(prev => [...prev, classData]);
  };

  const addSubject = (subject: Subject) => {
    setSubjects(prev => [...prev, subject]);
  };

  const addMark = (mark: Mark) => {
    setMarks(prev => [...prev, mark]);
  };

  const updateMark = (id: string, updatedMark: Partial<Mark>) => {
    setMarks(prev => prev.map(mark => 
      mark.id === id ? { ...mark, ...updatedMark } : mark
    ));
  };

  const addMarkSheet = (markSheet: MarkSheet) => {
    setMarkSheets(prev => [...prev, markSheet]);
  };

  const updateSchoolSettings = (updatedSettings: Partial<SchoolSettings>) => {
    setSchoolSettings(prev => ({
      ...prev,
      ...updatedSettings,
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <SchoolContext.Provider value={{
      students,
      teachers,
      fees,
      attendance,
      classes,
      subjects,
      marks,
      markSheets,
      schoolSettings,
      updateSchoolSettings,
      addStudent,
      updateStudent,
      deleteStudent,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addFee,
      updateFee,
      addAttendance,
      addClass,
      addSubject,
      addMark,
      updateMark,
      addMarkSheet
    }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}