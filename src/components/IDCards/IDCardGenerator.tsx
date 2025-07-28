import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { Student, Teacher } from '../../types';
import { GraduationCap, Download, Printer, Shield, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const IDCardGenerator = () => {
  const { students, teachers } = useSchool();
  const { user } = useAuth();
  const [selectedPerson, setSelectedPerson] = useState<Student | Teacher | null>(null);
  const [selectedType, setSelectedType] = useState<'student' | 'teacher'>('student');
  const [showBack, setShowBack] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!idCardRef.current || !selectedPerson) return;

    const canvas = await html2canvas(idCardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 53.98]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
    
    const name = 'firstName' in selectedPerson 
      ? `${selectedPerson.firstName}_${selectedPerson.lastName}` 
      : selectedPerson.firstName;
    
    pdf.save(`${name}_ID_Card.pdf`);
  };

  const printCard = async () => {
    if (!idCardRef.current) return;

    const canvas = await html2canvas(idCardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ID Card</title>
            <style>
              body { margin: 0; padding: 20px; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; padding: 0; }
                img { width: 85.6mm; height: 53.98mm; }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" alt="ID Card" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getAvailableData = () => {
    if (user?.role === 'student') {
      const student = students.find(s => s.id === user.profileId);
      return student ? [{ type: 'student', data: student }] : [];
    } else if (user?.role === 'teacher') {
      const teacher = teachers.find(t => t.id === user.profileId);
      return teacher ? [{ type: 'teacher', data: teacher }] : [];
    } else {
      return [
        ...students.map(s => ({ type: 'student' as const, data: s })),
        ...teachers.map(t => ({ type: 'teacher' as const, data: t }))
      ];
    }
  };

  const availableData = getAvailableData();

  const renderFrontCard = () => {
    if (!selectedPerson) return null;

    const isStudent = 'rollNumber' in selectedPerson;
    const person = selectedPerson as Student | Teacher;

    return (
      <div className="w-96 h-60 bg-white rounded-lg shadow-2xl overflow-hidden relative">
        {/* Green Wave Background */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 400 240" className="w-full h-full">
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
            <path d="M0,0 L400,0 L400,80 Q300,120 200,80 Q100,40 0,80 Z" fill="url(#greenGradient)" />
            <path d="M0,160 Q100,200 200,160 Q300,120 400,160 L400,240 L0,240 Z" fill="url(#greenGradient)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 h-full flex">
          {/* Left Side - Photo */}
          <div className="w-24 mr-4">
            <div className="w-20 h-24 bg-blue-500 border-2 border-white rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {person.firstName.charAt(0)}{person.lastName.charAt(0)}
            </div>
            {isStudent && (
              <div className="mt-1 text-center">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                  STUDENT
                </span>
              </div>
            )}
            {!isStudent && (
              <div className="mt-1 text-center">
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                  TEACHER
                </span>
              </div>
            )}
          </div>

          {/* Right Side - Information */}
          <div className="flex-1">
            {/* Header */}
            <div className="text-center mb-3">
              <h1 className="text-sm font-bold text-green-800 leading-tight">
                INAYAT PUBLIC SCHOOL
              </h1>
              <p className="text-xs text-green-700">KUMBER, MAIDAN</p>
            </div>

            {/* Name */}
            <div className="mb-2">
              <h2 className="text-lg font-bold text-green-800 text-center">
                {person.firstName.toUpperCase()} {person.lastName.toUpperCase()}
              </h2>
            </div>

            {/* Details */}
            <div className="space-y-1 text-xs">
              {isStudent ? (
                <>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">FATHER NAME:</span>
                    <span className="text-gray-900">{(person as Student).fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">ROLL NUMBER:</span>
                    <span className="text-gray-900">{(person as Student).rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">CLASS:</span>
                    <span className="text-gray-900">{(person as Student).class}-{(person as Student).section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">SESSION:</span>
                    <span className="text-gray-900">2024-25</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">SUBJECT:</span>
                    <span className="text-gray-900">{(person as Teacher).subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">DEPARTMENT:</span>
                    <span className="text-gray-900">{(person as Teacher).department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">EXPERIENCE:</span>
                    <span className="text-gray-900">{(person as Teacher).experience} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">JOINING:</span>
                    <span className="text-gray-900">{new Date((person as Teacher).dateOfJoining).getFullYear()}</span>
                  </div>
                </>
              )}
            </div>

            {/* QR Code Area */}
            <div className="absolute bottom-2 right-2">
              <div className="w-12 h-12 bg-black border border-gray-300 flex items-center justify-center">
                <div className="w-10 h-10 bg-white flex items-center justify-center text-xs font-bold">
                  QR
                </div>
              </div>
            </div>

            {/* Validity */}
            <div className="absolute bottom-2 left-20">
              <div className="text-xs">
                <span className="text-red-600 font-bold">Valid up to</span>
                <br />
                <span className="text-red-600 font-bold">31/12/2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Government Logo Area */}
        <div className="absolute top-2 right-2">
          <div className="w-12 h-12 bg-white rounded-full border-2 border-green-600 flex items-center justify-center">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
    );
  };

  const renderBackCard = () => {
    if (!selectedPerson) return null;

    const isStudent = 'rollNumber' in selectedPerson;
    const person = selectedPerson as Student | Teacher;

    return (
      <div className="w-96 h-60 bg-white rounded-lg shadow-2xl overflow-hidden relative">
        {/* Green Wave Background */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 400 240" className="w-full h-full">
            <defs>
              <linearGradient id="greenGradientBack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
            <path d="M0,0 L400,0 L400,80 Q300,120 200,80 Q100,40 0,80 Z" fill="url(#greenGradientBack)" />
            <path d="M0,160 Q100,200 200,160 Q300,120 400,160 L400,240 L0,240 Z" fill="url(#greenGradientBack)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 h-full">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-bold text-green-800">
              GOVT OF KHYBER PAKHTUNKHWA
            </h1>
          </div>

          {/* Information */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-bold text-gray-800">EMAIL:</span>
              <span className="text-gray-900">{person.email}</span>
            </div>
            
            {isStudent ? (
              <>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">BLOOD GROUP:</span>
                  <span className="text-gray-900">{(person as Student).bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">ADMISSION DATE:</span>
                  <span className="text-gray-900">{new Date((person as Student).admissionDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">MOBILE NUMBER:</span>
                  <span className="text-gray-900">{person.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">EMERGENCY:</span>
                  <span className="text-gray-900">{(person as Student).emergencyContact}</span>
                </div>
                <div className="mt-3">
                  <span className="font-bold text-gray-800">ADDRESS:</span>
                  <p className="text-gray-900 text-xs mt-1">{(person as Student).address}</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">QUALIFICATION:</span>
                  <span className="text-gray-900">{(person as Teacher).qualification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">JOINING DATE:</span>
                  <span className="text-gray-900">{new Date((person as Teacher).dateOfJoining).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">MOBILE NUMBER:</span>
                  <span className="text-gray-900">{person.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">DEPARTMENT:</span>
                  <span className="text-gray-900">{(person as Teacher).department}</span>
                </div>
              </>
            )}
          </div>

          {/* QR Code */}
          <div className="absolute bottom-4 right-4">
            <div className="w-16 h-16 bg-black border border-gray-300 flex items-center justify-center">
              <div className="w-14 h-14 bg-white flex items-center justify-center text-xs font-bold">
                QR CODE
              </div>
            </div>
          </div>

          {/* Government Seal */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="w-16 h-16 border-2 border-green-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">ID Card Generator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selection Panel */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {user?.role === 'admin' ? 'Select Person' : 'Your ID Card'}
          </h2>
          
          {user?.role === 'admin' && (
            <div className="mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedType('student')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedType === 'student'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Students
                </button>
                <button
                  onClick={() => setSelectedType('teacher')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedType === 'teacher'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Teachers
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {availableData
              .filter(item => user?.role === 'admin' ? item.type === selectedType : true)
              .map((item) => {
                const person = item.data;
                const isStudent = 'rollNumber' in person;
                return (
                  <div
                    key={person.id}
                    onClick={() => setSelectedPerson(person)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPerson?.id === person.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 ${isStudent ? 'bg-green-500' : 'bg-blue-500'} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {person.firstName} {person.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {isStudent 
                            ? `${(person as Student).rollNumber} • Class ${(person as Student).class}-${(person as Student).section}`
                            : `${(person as Teacher).subject} Teacher • ${(person as Teacher).department}`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ID Card Preview */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">ID Card Preview</h2>
            {selectedPerson && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBack(!showBack)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  {showBack ? 'Front' : 'Back'}
                </button>
                <button
                  onClick={printCard}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button
                  onClick={generatePDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </button>
              </div>
            )}
          </div>

          {selectedPerson ? (
            <div className="flex justify-center">
              <div ref={idCardRef}>
                {showBack ? renderBackCard() : renderFrontCard()}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-60 text-gray-500">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a person to preview their ID card</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDCardGenerator;