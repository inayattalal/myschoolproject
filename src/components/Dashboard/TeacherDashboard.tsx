import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { Users, BookOpen, Calendar, CheckCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { students, teachers, attendance } = useSchool();

  const teacher = teachers.find(t => t.id === user?.profileId);
  const todayAttendance = attendance.filter(a => 
    a.date === new Date().toISOString().split('T')[0]
  );

  const myStudents = students.filter(s => s.class === '10'); // Example: teacher handles class 10
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  const absentToday = todayAttendance.filter(a => a.status === 'absent').length;

  if (!teacher) {
    return <div className="p-8 text-center text-red-600">Teacher profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {teacher.firstName}!</p>
        </div>
        <div className="text-sm text-gray-500">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 font-medium">{teacher.subject} Teacher</p>
            <p className="text-green-600 text-xs">{teacher.department} Department</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Students</p>
              <p className="text-2xl font-bold text-blue-600">{myStudents.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{presentToday}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{absentToday}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Experience</p>
              <p className="text-2xl font-bold text-indigo-600">{teacher.experience}y</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Profile & Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Profile</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{teacher.firstName} {teacher.lastName}</h3>
                <p className="text-sm text-gray-600">{teacher.subject} Teacher</p>
                <p className="text-sm text-gray-600">{teacher.department} Department</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500">Qualification</p>
                <p className="text-sm font-medium">{teacher.qualification}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Experience</p>
                <p className="text-sm font-medium">{teacher.experience} years</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium">{teacher.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{teacher.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Classes</h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">Class 10-A</h3>
                  <p className="text-sm text-gray-600">{teacher.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{myStudents.length} Students</p>
                  <p className="text-xs text-gray-500">Morning Shift</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">Class 10-B</h3>
                  <p className="text-sm text-gray-600">{teacher.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">25 Students</p>
                  <p className="text-xs text-gray-500">Morning Shift</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;