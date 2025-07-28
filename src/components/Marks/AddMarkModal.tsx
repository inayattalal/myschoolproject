import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Mark } from '../../types';

interface AddMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMark?: Mark | null;
}

const AddMarkModal: React.FC<AddMarkModalProps> = ({ isOpen, onClose, editingMark }) => {
  const { students, subjects, addMark, updateMark } = useSchool();
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    examType: 'midterm' as 'midterm' | 'final' | 'quiz' | 'assignment' | 'practical',
    marksObtained: '',
    totalMarks: '',
    examDate: '',
    remarks: ''
  });

  useEffect(() => {
    if (editingMark) {
      setFormData({
        studentId: editingMark.studentId,
        subjectId: editingMark.subjectId,
        examType: editingMark.examType,
        marksObtained: editingMark.marksObtained.toString(),
        totalMarks: editingMark.totalMarks.toString(),
        examDate: editingMark.examDate,
        remarks: editingMark.remarks || ''
      });
    } else {
      setFormData({
        studentId: '',
        subjectId: '',
        examType: 'midterm',
        marksObtained: '',
        totalMarks: '100',
        examDate: new Date().toISOString().split('T')[0],
        remarks: ''
      });
    }
  }, [editingMark]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const marksObtained = parseInt(formData.marksObtained);
    const totalMarks = parseInt(formData.totalMarks);

    if (marksObtained > totalMarks) {
      alert('Marks obtained cannot be greater than total marks');
      return;
    }

    const markData: Mark = {
      id: editingMark ? editingMark.id : Date.now().toString(),
      studentId: formData.studentId,
      subjectId: formData.subjectId,
      examType: formData.examType,
      marksObtained,
      totalMarks,
      examDate: formData.examDate,
      remarks: formData.remarks,
      grade: getGrade(marksObtained, totalMarks)
    };

    if (editingMark) {
      updateMark(editingMark.id, markData);
    } else {
      addMark(markData);
    }
    
    // Reset form
    setFormData({
      studentId: '',
      subjectId: '',
      examType: 'midterm',
      marksObtained: '',
      totalMarks: '100',
      examDate: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    
    onClose();
  };

  if (!isOpen) return null;

  const selectedSubject = subjects.find(s => s.id === formData.subjectId);
  const marksObtained = parseInt(formData.marksObtained) || 0;
  const totalMarks = parseInt(formData.totalMarks) || 100;
  const percentage = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;
  const grade = getGrade(marksObtained, totalMarks);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingMark ? 'Edit Marks' : 'Add New Marks'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student and Subject Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student *
                </label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.rollNumber}) - Class {student.class}-{student.section}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Type *
                </label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="midterm">Midterm Exam</option>
                  <option value="final">Final Exam</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="practical">Practical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date *
                </label>
                <input
                  type="date"
                  name="examDate"
                  value={formData.examDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Marks Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Marks Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Marks *
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {selectedSubject && (
                  <p className="text-xs text-gray-500 mt-1">
                    Subject default: {selectedSubject.totalMarks} marks
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marks Obtained *
                </label>
                <input
                  type="number"
                  name="marksObtained"
                  value={formData.marksObtained}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max={formData.totalMarks}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {selectedSubject && (
                  <p className="text-xs text-gray-500 mt-1">
                    Passing marks: {selectedSubject.passingMarks}
                  </p>
                )}
              </div>
            </div>

            {/* Grade Preview */}
            {formData.marksObtained && formData.totalMarks && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Grade Preview</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Percentage</p>
                    <p className="text-lg font-bold text-blue-600">{percentage.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Grade</p>
                    <p className={`text-lg font-bold ${
                      percentage >= 80 ? 'text-green-600' :
                      percentage >= 60 ? 'text-yellow-600' :
                      percentage >= 40 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {grade}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className={`text-sm font-medium ${
                      selectedSubject && marksObtained >= selectedSubject.passingMarks 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedSubject && marksObtained >= selectedSubject.passingMarks ? 'Pass' : 'Fail'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Add any additional comments or remarks..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingMark ? 'Update Marks' : 'Add Marks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMarkModal;