import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import SweetAlert from '../Common/SweetAlert';
import { useSweetAlert } from '../../hooks/useSweetAlert';

const LoginPage = () => {
  const { login } = useAuth();
  const { alertState, hideAlert, showError } = useSweetAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        showError('Login Failed', 'Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err) {
      showError('Login Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Master Admin', email: 'master@school.edu', password: 'master123' },
    { role: 'Admin', email: 'admin@school.edu', password: 'admin123' },
    { role: 'Teacher', email: 'jane.wilson@school.edu', password: 'teacher123' },
    { role: 'Student', email: 'john.doe@email.com', password: 'student123' },
    { role: 'Parent', email: 'robert.doe@email.com', password: 'parent123' }
  ];

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inayat Public School</h1>
              <p className="text-sm text-gray-600">عنایت پبلک سکول</p>
            </div>
          </div>
          <p className="text-gray-600">School Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Login to Your Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Demo Accounts</h3>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => quickLogin(account.email, account.password)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="text-xs font-medium text-gray-900">{account.role}</div>
                <div className="text-xs text-gray-600 truncate">{account.email}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Click on any demo account to auto-fill credentials</p>
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
    </div>
  );
};

export default LoginPage;