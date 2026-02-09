import React, { useEffect, useState } from 'react';
import { getAllStudents, deleteStudent } from '../services/studentListApi';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import '../styles/StudentList.css';

interface StudentListItem {
  pid: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  dateOfBirth: string;
  enrollmentNumber?: string;
  faculty?: string;
  program?: string;
  photoPath?: string;
}

interface StudentListProps {
  onRegisterClick: () => void;
  onEditClick: (pid: string) => void;
  onViewDetails: (pid: string) => void;
  onRefresh: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  onRegisterClick,
  onEditClick,
  onViewDetails,
  onRefresh,
}) => {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ pid: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Starting fetchStudents...');
      const data = await getAllStudents();
      console.log('Received data:', data);
      setStudents(data);
      if (data.length === 0) {
        console.warn('No students returned from API');
      }
    } catch (err) {
      console.error('Error in fetchStudents:', err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (pid: string, studentName: string) => {
    setDeleteTarget({ pid, name: studentName });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteStudent(deleteTarget.pid);
      if (success) {
        alert('Student deleted successfully');
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
        fetchStudents();
        onRefresh();
      } else {
        alert('Failed to delete student');
      }
    } catch (err) {
      alert('Error deleting student');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="student-list-container">
        <div className="loading">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="list-header">
        <h1>Student Enrollment Form</h1>
        <button className="register-btn" onClick={onRegisterClick}>
          + Register New Student
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {students.length === 0 ? (
        <div className="no-students">
          <p>No students found. Click "Register New Student" to add one.</p>
        </div>
      ) : (
        <div className="students-grid">
          {students.map((student) => {
            // Construct image URL - handle different PhotoPath formats
            let imageUrl: string | null = null;
            
            if (student.photoPath && student.photoPath.trim()) {
              // If photoPath contains http, use as-is
              if (student.photoPath.startsWith('http')) {
                imageUrl = student.photoPath;
              } else {
                // photoPath already contains the folder structure (e.g., "Students/Photos/guid.jpg")
                imageUrl = `https://localhost:7257/Uploads/${student.photoPath}`;
              }
              console.log(`${student.firstName}: photoPath="${student.photoPath}" → imageUrl="${imageUrl}"`);
            } else {
              console.log(`${student.firstName}: No photoPath`);
            }
            
            return (
            <div key={student.pid} className="student-card">
              <div className="card-image">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={`${student.firstName} ${student.lastName}`}
                    className="student-photo"
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl);
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="photo-placeholder">📷</div>';
                      }
                    }}
                  />
                ) : (
                  <div className="photo-placeholder">📷</div>
                )}
              </div>
              <div className="card-content">
                <h3 className="student-name">
                  {student.firstName} {student.lastName}
                </h3>
                <div className="card-subtitle">
                  {student.faculty && student.program ? (
                    `${student.faculty} • ${student.program}`
                  ) : (
                    student.faculty || student.program || 'Student'
                  )}
                </div>
                <div className="student-info">
                  <p>
                    <span className="label">Email:</span> {student.email}
                  </p>
                  <p>
                    <span className="label">Contact:</span> {student.contactNumber}
                  </p>
                  <p>
                    <span className="label">DOB:</span>{' '}
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-details"
                  onClick={() => onViewDetails(student.pid)}
                  title="View full details"
                >
                  👁️
                </button>
                <button
                  className="btn btn-edit"
                  onClick={() => onEditClick(student.pid)}
                  title="Edit student information"
                >
                  ✏️
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(student.pid, `${student.firstName} ${student.lastName}`)}
                  title="Delete this student"
                >
                  🗑️
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        studentName={deleteTarget?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
