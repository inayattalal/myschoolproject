import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { BookOpen, Calendar, CreditCard, FileText, User, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { students, fees, attendance } = useSchool();

  const student = students.find(s => s.id === user?.profileId);
  const studentFees = fees.filter(f => f.studentId === user?.profileId);
  const studentAttendance = attendance.filter(a => a.studentId === user?.profileId);

  const pendingFees = studentFees.filter(f => f.status === 'pending');
  const presentDays = studentAttendance.filter(a => a.status === 'present').length;
  const totalDays = studentAttendance.length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  if (!student) {
    return <div className="p-8 text-center text-red-600">Student profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {student.firstName}!</p>
        </div>
        <div className="text-sm text-gray-500">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 font-medium">Class {student.class}-{student.section}</p>
            <p className="text-blue-600 text-xs">Roll No: {student.rollNumber}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance</p>
              <p className="text-2xl font-bold text-green-600">{attendancePercentage}%</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Fees</p>
              <p className="text-2xl font-bold text-orange-600">{pendingFees.length}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-blue-600">{presentDays}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-indigo-600">{totalDays}</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Profile</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{student.firstName} {student.lastName}</h3>
                <p className="text-sm text-gray-600">Class {student.class}-{student.section}</p>
                <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500">Father's Name</p>
                <p className="text-sm font-medium">{student.fatherName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Blood Group</p>
                <p className="text-sm font-medium">{student.bloodGroup}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium">{student.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{student.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Fees</h2>
          {pendingFees.length > 0 ? (
            <div className="space-y-3">
              {pendingFees.slice(0, 3).map((fee) => (
                <div key={fee.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{fee.type}</p>
                    <p className="text-sm text-gray-600">{fee.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">${fee.amount}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending fees</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;