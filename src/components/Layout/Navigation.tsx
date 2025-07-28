import React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { 
  Home, 
  Users, 
  GraduationCap, 
  CreditCard, 
  Calendar, 
  FileText,
  Settings,
  UserCheck,
  Shield,
  LogOut,
  ChevronDown,
  User,
  BookOpen
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { schoolSettings } = useSchool();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getNavItems = () => {
    const baseItems = [
      { path: '/', icon: Home, label: 'Dashboard' }
    ];

    if (user?.role === 'master_admin') {
      return [
        ...baseItems,
        { path: '/settings', icon: Settings, label: 'School Settings' },
        { path: '/users', icon: Shield, label: 'User Management' },
        { path: '/students', icon: Users, label: 'Students' },
        { path: '/teachers', icon: GraduationCap, label: 'Teachers' },
        { path: '/fees', icon: CreditCard, label: 'Fees' },
        { path: '/attendance', icon: UserCheck, label: 'Attendance' },
        { path: '/marks', icon: BookOpen, label: 'Marks Sheet' },
        { path: '/id-cards', icon: FileText, label: 'ID Cards' },
        { path: '/classes', icon: Calendar, label: 'Classes' }
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/users', icon: Shield, label: 'User Management' },
        { path: '/students', icon: Users, label: 'Students' },
        { path: '/teachers', icon: GraduationCap, label: 'Teachers' },
        { path: '/fees', icon: CreditCard, label: 'Fees' },
        { path: '/attendance', icon: UserCheck, label: 'Attendance' },
        { path: '/marks', icon: BookOpen, label: 'Marks Sheet' },
        { path: '/id-cards', icon: FileText, label: 'ID Cards' },
        { path: '/classes', icon: Calendar, label: 'Classes' }
      ];
    } else if (user?.role === 'teacher') {
      return [
        ...baseItems,
        { path: '/students', icon: Users, label: 'My Students' },
        { path: '/attendance', icon: UserCheck, label: 'Attendance' },
        { path: '/marks', icon: BookOpen, label: 'Marks Sheet' },
        { path: '/classes', icon: Calendar, label: 'My Classes' }
      ];
    } else if (user?.role === 'student') {
      return [
        ...baseItems,
        { path: '/fees', icon: CreditCard, label: 'My Fees' },
        { path: '/attendance', icon: UserCheck, label: 'My Attendance' },
        { path: '/id-cards', icon: FileText, label: 'My ID Card' }
      ];
    } else if (user?.role === 'parent') {
      return [
        ...baseItems,
        { path: '/students', icon: Users, label: 'My Children' },
        { path: '/fees', icon: CreditCard, label: 'Fee Status' },
        { path: '/attendance', icon: UserCheck, label: 'Attendance' }
      ];
    }
    return baseItems;
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'master_admin': return 'text-red-400';
      case 'admin': return 'text-yellow-400';
      case 'teacher': return 'text-blue-400';
      case 'student': return 'text-green-400';
      case 'parent': return 'text-purple-400';
      default: return 'text-yellow-400';
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'master_admin': return 'Master Admin';
      case 'admin': return 'Administrator';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      case 'parent': return 'Parent';
      default: return 'User';
    }
  };

  return (
    <nav className="bg-gradient-to-b from-green-800 to-green-900 text-white w-64 min-h-screen p-4 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <Shield className={`h-8 w-8 ${getRoleColor()}`} />
        <div>
          <h1 className="text-lg font-bold">{schoolSettings.schoolName}</h1>
          <p className="text-xs text-green-200">{schoolSettings.schoolNameUrdu}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="relative mb-6">
        <div 
          className="bg-green-700 rounded-lg p-3 cursor-pointer hover:bg-green-600 transition-colors"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-green-800 font-semibold">
              {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-green-200">{getRoleLabel()}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-green-200 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="py-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                <User className="h-4 w-4" />
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-green-700 text-white shadow-md' 
                    : 'text-green-100 hover:bg-green-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;