import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { User, Calendar, CreditCard, BookOpen, AlertTriangle } from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const { students, fees, attendance } = useSchool();

  const children = students.filter(s => user?.children?.includes(s.id));
  const childrenFees = fees.filter(f => user?.children?.includes(f.studentId));
  const childrenAttendance = attendance.filter(a => user?.children?.includes(a.studentId));

  const pendingFees = childrenFees.filter(f => f.status === 'pending');
  const totalFeeAmount = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
        </div>
        <div className="text-sm text-gray-500">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-purple-800 font-medium">Parent Account</p>
            <p className="text-purple-600 text-xs">{children.length} Child(ren)</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Children</p>
              <p className="text-2xl font-bold text-blue-600">{children.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Fees</p>
              <p className="text-2xl font-bold text-orange-600">${totalFeeAmount}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Records</p>
              <p className="text-2xl font-bold text-green-600">{childrenAttendance.length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-red-600">{pendingFees.length}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Children Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Children</h2>
          <div className="space-y-4">
            {children.map((child) => {
              const childAttendance = childrenAttendance.filter(a => a.studentId === child.id);
              const presentDays = childAttendance.filter(a => a.status === 'present').length;
              const totalDays = childAttendance.length;
              const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

              return (
                <div key={child.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{child.firstName} {child.lastName}</h3>
                      <p className="text-sm text-gray-600">Class {child.class}-{child.section} • Roll No: {child.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{attendancePercentage}%</p>
                      <p className="text-xs text-gray-500">Attendance</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Present</p>
                      <p className="text-sm font-medium text-green-600">{presentDays}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Days</p>
                      <p className="text-sm font-medium text-blue-600">{totalDays}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Blood Group</p>
                      <p className="text-sm font-medium text-red-600">{child.bloodGroup}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fee Status</h2>
          {pendingFees.length > 0 ? (
            <div className="space-y-3">
              {pendingFees.map((fee) => {
                const child = children.find(c => c.id === fee.studentId);
                return (
                  <div key={fee.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{child?.firstName} {child?.lastName}</p>
                        <p className="text-sm text-gray-600 capitalize">{fee.type} - {fee.description}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">${fee.amount}</p>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          {fee.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-red-900">Total Pending:</span>
                  <span className="font-bold text-red-600">${totalFeeAmount}</span>
                </div>
              </div>
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

export default ParentDashboard;