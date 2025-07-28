import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolProvider } from './context/SchoolContext';
import LoginPage from './components/Auth/LoginPage';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import ParentDashboard from './components/Dashboard/ParentDashboard';
import StudentList from './components/Students/StudentList';
import IDCardGenerator from './components/IDCards/IDCardGenerator';
import FeeCollection from './components/Fees/FeeCollection';
import AttendanceSystem from './components/Attendance/AttendanceSystem';
import UserManagement from './components/Users/UserManagement';
import MarksSheet from './components/Marks/MarksSheet';
import SchoolSettings from './components/Settings/SchoolSettings';

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={getDashboardComponent()} />
          {(user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'parent') && (
            <Route path="students" element={<StudentList />} />
          )}
          {(user?.role === 'master_admin' || user?.role === 'admin') && (
            <Route path="users" element={<UserManagement />} />
          )}
          {(user?.role === 'master_admin' || user?.role === 'admin') && (
            <Route path="teachers" element={<div className="p-8 text-center text-gray-600">Teachers section coming soon...</div>} />
          )}
          {(user?.role === 'master_admin' || user?.role === 'admin' || user?.role === 'student' || user?.role === 'parent') && (
            <Route path="fees" element={<FeeCollection />} />
          )}
          {(user?.role === 'master_admin' || user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'student' || user?.role === 'parent') && (
            <Route path="attendance" element={<AttendanceSystem />} />
          )}
          {(user?.role === 'master_admin' || user?.role === 'admin' || user?.role === 'teacher') && (
            <Route path="marks" element={<MarksSheet />} />
          )}
          {(user?.role === 'master_admin' || user?.role === 'admin' || user?.role === 'student') && (
            <Route path="id-cards" element={<IDCardGenerator />} />
          )}
          {(user?.role === 'master_admin' || user?.role === 'admin' || user?.role === 'teacher') && (
            <Route path="classes" element={<div className="p-8 text-center text-gray-600">Classes section coming soon...</div>} />
          )}
          {user?.role === 'master_admin' && (
            <Route path="settings" element={<SchoolSettings />} />
          )}
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SchoolProvider>
        <AppContent />
      </SchoolProvider>
    </AuthProvider>
  );
}

export default App;