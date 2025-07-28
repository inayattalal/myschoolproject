import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Calendar, Users, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import SweetAlert from '../Common/SweetAlert';
import { useSweetAlert } from '../../hooks/useSweetAlert';

const AttendanceSystem = () => {
  const { students, attendance, addAttendance } = useSchool();
  const { alertState, hideAlert, showSuccess } = useSweetAlert();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState<{[key: string]: 'present' | 'absent' | 'late'}>({});

  const classes = [...new Set(students.map(student => student.class))];
  
  const filteredStudents = students.filter(student => 
    selectedClass === '' || student.class === selectedClass
  );

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    const newAttendanceData: {[key: string]: 'present' | 'absent' | 'late'} = {};
    filteredStudents.forEach(student => {
      newAttendanceData[student.id] = 'present';
    });
    setAttendanceData(newAttendanceData);
  };

  const clearAllAttendance = () => {
    setAttendanceData({});
  };

  const saveAttendance = () => {
    Object.entries(attendanceData).forEach(([studentId, status]) => {
      const attendanceRecord = {
        id: `${studentId}-${selectedDate}`,
        studentId,
        date: selectedDate,
        status,
        remarks: ''
      };
      addAttendance(attendanceRecord);
    });
    setAttendanceData({});
    showSuccess('Attendance Saved', 'Attendance has been saved successfully!');
  };

  const getTodaysAttendance = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return attendance.filter(record => record.date === today);
  };

  const getAttendanceStats = () => {
    const todaysAttendance = getTodaysAttendance();
    const present = todaysAttendance.filter(record => record.status === 'present').length;
    const absent = todaysAttendance.filter(record => record.status === 'absent').length;
    const late = todaysAttendance.filter(record => record.status === 'late').length;
    
    return { present, absent, late, total: present + absent + late };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Attendance System</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          Today: {format(new Date(), 'MMMM dd, yyyy')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <X className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Date and Class Selection */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={markAllPresent}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              All Present
            </button>
            <button
              onClick={clearAllAttendance}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={saveAttendance}
              disabled={Object.keys(attendanceData).length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Save Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mark Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {student.rollNumber} • Class {student.class}-{student.section}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleAttendanceChange(student.id, 'present')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    attendanceData[student.id] === 'present'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <Check className="h-4 w-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleAttendanceChange(student.id, 'late')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    attendanceData[student.id] === 'late'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  <Clock className="h-4 w-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleAttendanceChange(student.id, 'absent')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    attendanceData[student.id] === 'absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  <X className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <SweetAlert
      type={alertState.options.type}
      title={alertState.options.title}
      message={alertState.options.message}
      isOpen={alertState.isOpen}
      onClose={hideAlert}
      onConfirm={alertState.onConfirm}
      showCancel={alertState.options.showCancel}
      confirmText={alertState.options.confirmText}
      cancelText={alertState.options.cancelText}
    />
  );
};

export default AttendanceSystem;