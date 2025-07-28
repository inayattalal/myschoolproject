import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Search, Plus, Edit, Trash2, Download, Calculator, Award } from 'lucide-react';
import { Mark, MarkSheet } from '../../types';
import AddMarkModal from './AddMarkModal';
import SweetAlert from '../Common/SweetAlert';
import { useSweetAlert } from '../../hooks/useSweetAlert';

const MarksSheet = () => {
  const { students, subjects, marks, markSheets, addMark, updateMark, addMarkSheet } = useSchool();
  const { user } = useAuth();
  const { alertState, hideAlert, showSuccess } = useSweetAlert();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);
  const [viewMode, setViewMode] = useState<'marks' | 'sheets'>('marks');

  const classes = [...new Set(students.map(student => student.class))];

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  const getGrade = (obtained: number, total: number) => {
    const percentage = (obtained / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const filteredMarks = marks.filter(mark => {
    const student = students.find(s => s.id === mark.studentId);
    const subject = subjects.find(s => s.id === mark.subjectId);
    
    const matchesSearch = student && (
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesClass = selectedClass === '' || student?.class === selectedClass;
    const matchesExam = selectedExamType === '' || mark.examType === selectedExamType;
    
    return matchesSearch && matchesClass && matchesExam;
  });

  const generateMarkSheet = (studentId: string, examType: 'midterm' | 'final' | 'annual') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const studentMarks = marks.filter(m => m.studentId === studentId && m.examType === examType);
    const totalMarks = studentMarks.reduce((sum, mark) => sum + mark.totalMarks, 0);
    const obtainedMarks = studentMarks.reduce((sum, mark) => sum + mark.marksObtained, 0);
    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    const markSheet: MarkSheet = {
      id: Date.now().toString(),
      studentId,
      class: student.class,
      section: student.section,
      examType,
      academicYear: '2024-25',
      marks: studentMarks,
      totalMarks,
      obtainedMarks,
      percentage,
      grade: getGrade(obtainedMarks, totalMarks),
      createdDate: new Date().toISOString()
    };

    addMarkSheet(markSheet);
    showSuccess('Mark Sheet Generated', 'Mark sheet has been generated successfully!');
  };

  const getClassStats = () => {
    const classMarks = filteredMarks.filter(mark => {
      const student = students.find(s => s.id === mark.studentId);
      return selectedClass === '' || student?.class === selectedClass;
    });

    const totalStudents = new Set(classMarks.map(mark => mark.studentId)).size;
    const averageMarks = classMarks.length > 0 
      ? classMarks.reduce((sum, mark) => sum + (mark.marksObtained / mark.totalMarks) * 100, 0) / classMarks.length
      : 0;

    return { totalStudents, averageMarks: Math.round(averageMarks) };
  };

  const stats = getClassStats();

  return (
    <>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marks Management - نمبرات کا انتظام</h1>
          <p className="text-sm text-gray-600 mt-1">Manage student marks and generate mark sheets</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'marks' ? 'sheets' : 'marks')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {viewMode === 'marks' ? <BookOpen className="h-4 w-4" /> : <Calculator className="h-4 w-4" />}
            {viewMode === 'marks' ? 'View Mark Sheets' : 'View Marks'}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Marks
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Marks</p>
              <p className="text-2xl font-bold text-blue-600">{filteredMarks.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalStudents}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Class Average</p>
              <p className="text-2xl font-bold text-orange-600">{stats.averageMarks}%</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mark Sheets</p>
              <p className="text-2xl font-bold text-indigo-600">{markSheets.length}</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg">
              <Download className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Exams</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
            <option value="practical">Practical</option>
          </select>
        </div>
      </div>

      {/* Marks Table */}
      {viewMode === 'marks' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMarks.map((mark) => {
                  const student = students.find(s => s.id === mark.studentId);
                  const subject = subjects.find(s => s.id === mark.subjectId);
                  const percentage = (mark.marksObtained / mark.totalMarks) * 100;
                  
                  return (
                    <tr key={mark.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getStudentName(mark.studentId)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student?.rollNumber} • Class {student?.class}-{student?.section}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getSubjectName(mark.subjectId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {mark.examType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {mark.marksObtained}/{mark.totalMarks}
                        </div>
                        <div className="text-sm text-gray-500">
                          {percentage.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          percentage >= 80 ? 'bg-green-100 text-green-800' :
                          percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          percentage >= 40 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getGrade(mark.marksObtained, mark.totalMarks)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditingMark(mark)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => generateMarkSheet(mark.studentId, mark.examType)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mark Sheets View */}
      {viewMode === 'sheets' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Mark Sheets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {markSheets.map((sheet) => {
              const student = students.find(s => s.id === sheet.studentId);
              return (
                <div key={sheet.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student?.firstName.charAt(0)}{student?.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getStudentName(sheet.studentId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Class {sheet.class}-{sheet.section} • {sheet.examType}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Marks:</span>
                      <span className="text-sm font-medium">{sheet.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Obtained:</span>
                      <span className="text-sm font-medium">{sheet.obtainedMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Percentage:</span>
                      <span className="text-sm font-medium">{sheet.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Grade:</span>
                      <span className={`text-sm font-medium ${
                        sheet.percentage >= 80 ? 'text-green-600' :
                        sheet.percentage >= 60 ? 'text-yellow-600' :
                        sheet.percentage >= 40 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {sheet.grade}
                      </span>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm transition-colors">
                    Download PDF
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AddMarkModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {editingMark && (
        <AddMarkModal 
          isOpen={true}
          onClose={() => setEditingMark(null)}
          editingMark={editingMark}
        />
      )}
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

export default MarksSheet;