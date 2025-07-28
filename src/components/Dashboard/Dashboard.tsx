import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, CreditCard, Calendar, BookOpen, Award } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

const Dashboard = () => {
  const { students, teachers, fees } = useSchool();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Teachers',
      value: teachers.length,
      icon: GraduationCap,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Fees',
      value: fees.filter(fee => fee.status === 'pending').length,
      icon: CreditCard,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: 'Classes',
      value: 12,
      icon: Calendar,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    }
  ];

  const recentActivities = [
    { type: 'Student Added', description: 'John Doe admitted to Class 10-A', time: '2 hours ago' },
    { type: 'Fee Paid', description: 'Emma Smith paid tuition fee', time: '4 hours ago' },
    { type: 'Attendance', description: 'Class 9-B attendance marked', time: '6 hours ago' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">ڈیش بورڈ - School Management Overview</p>
        </div>
        <div className="text-sm text-gray-500">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 font-medium">Welcome to School Management System</p>
            <p className="text-green-600 text-xs">اسکول منیجمنٹ سسٹم میں خوش آمدید</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/students')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors border border-green-200 hover:shadow-md"
            >
              <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-600">Manage Students</span>
            </button>
            <button 
              onClick={() => navigate('/attendance')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors border border-blue-200 hover:shadow-md"
            >
              <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">Mark Attendance</span>
            </button>
            <button 
              onClick={() => navigate('/fees')}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors border border-orange-200 hover:shadow-md"
            >
              <CreditCard className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-600">Collect Fee</span>
            </button>
            <button 
              onClick={() => navigate('/id-cards')}
              className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-center transition-colors border border-indigo-200 hover:shadow-md"
            >
              <Award className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-indigo-600">Generate ID</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;