import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { Settings, School, Shield, MapPin, Phone, Mail, User, Calendar, Save, Upload } from 'lucide-react';
import SweetAlert from '../Common/SweetAlert';
import { useSweetAlert } from '../../hooks/useSweetAlert';

const SchoolSettings = () => {
  const { schoolSettings, updateSchoolSettings } = useSchool();
  const { user } = useAuth();
  const { alertState, hideAlert, showSuccess } = useSweetAlert();
  const [formData, setFormData] = useState({
    schoolName: schoolSettings.schoolName,
    schoolNameUrdu: schoolSettings.schoolNameUrdu,
    logo: schoolSettings.logo,
    address: schoolSettings.address,
    phone: schoolSettings.phone,
    email: schoolSettings.email,
    website: schoolSettings.website || '',
    principalName: schoolSettings.principalName,
    establishedYear: schoolSettings.establishedYear
  });
  const [isEditing, setIsEditing] = useState(false);

  // Only master admin can access this page
  if (user?.role !== 'master_admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only Master Administrators can access school settings.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings({
      ...formData,
      updatedBy: `${user.firstName} ${user.lastName}`
    });
    setIsEditing(false);
    showSuccess('Settings Updated', 'School settings have been updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      schoolName: schoolSettings.schoolName,
      schoolNameUrdu: schoolSettings.schoolNameUrdu,
      logo: schoolSettings.logo,
      address: schoolSettings.address,
      phone: schoolSettings.phone,
      email: schoolSettings.email,
      website: schoolSettings.website || '',
      principalName: schoolSettings.principalName,
      establishedYear: schoolSettings.establishedYear
    });
    setIsEditing(false);
  };

  const logoOptions = [
    { value: 'shield', label: 'Shield', icon: Shield },
    { value: 'school', label: 'School Building', icon: School },
    { value: 'graduation-cap', label: 'Graduation Cap', icon: School }
  ];

  return (
    <>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Settings - اسکول کی ترتیبات</h1>
          <p className="text-sm text-gray-600 mt-1">Manage school information and branding (Master Admin Only)</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Edit Settings
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Current Settings Preview */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current School Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{schoolSettings.schoolName}</h3>
                <p className="text-sm text-gray-600">{schoolSettings.schoolNameUrdu}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{schoolSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{schoolSettings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{schoolSettings.email}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>Principal: {schoolSettings.principalName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Established: {schoolSettings.establishedYear}</span>
            </div>
            <div className="text-xs text-gray-400 mt-4">
              Last updated: {new Date(schoolSettings.updatedAt).toLocaleString()}
              <br />
              Updated by: {schoolSettings.updatedBy}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit School Settings</h2>
          
          {/* School Identity */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">School Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name (English) *
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name (Urdu) *
                  </label>
                  <input
                    type="text"
                    name="schoolNameUrdu"
                    value={formData.schoolNameUrdu}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Logo *
                  </label>
                  <select
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {logoOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Established Year *
                  </label>
                  <input
                    type="text"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Principal Name *
                  </label>
                  <input
                    type="text"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Warning Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Settings className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Master Admin Access</h3>
            <p className="text-sm text-yellow-700 mt-1">
              These settings control the school's identity and branding throughout the system. 
              Changes will be reflected in navigation, ID cards, reports, and all official documents. 
              Only Master Administrators have permission to modify these settings.
            </p>
          </div>
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
    </>
  );
};

export default SchoolSettings;