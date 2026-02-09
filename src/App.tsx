import { useState } from 'react';
import { StudentList } from './components/StudentList';
import { StudentDetailsModal } from './components/StudentDetailsModal';
import EnrollmentForm from './components/EnrollmentForm';

function App() {
  const [currentPage, setCurrentPage] = useState<'list' | 'register' | 'edit'>('list');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudentPid, setSelectedStudentPid] = useState<string | null>(null);
  const [editingPid, setEditingPid] = useState<string | null>(null);

  const handleRegisterClick = () => {
    setEditingPid(null);
    setCurrentPage('register');
  };

  const handleEditClick = (pid: string) => {
    setEditingPid(pid);
    setCurrentPage('edit');
  };

  const handleViewDetails = (pid: string) => {
    setSelectedStudentPid(pid);
    setShowDetailsModal(true);
  };

  const handleFormSuccess = () => {
    setCurrentPage('list');
  };

  const handleFormCancel = () => {
    setCurrentPage('list');
    setEditingPid(null);
  };

  return (
    <>
      {currentPage === 'list' && (
        <StudentList
          onRegisterClick={handleRegisterClick}
          onEditClick={handleEditClick}
          onViewDetails={handleViewDetails}
          onRefresh={handleFormSuccess}
        />
      )}

      {(currentPage === 'register' || currentPage === 'edit') && (
        <EnrollmentForm
          onSuccess={handleFormSuccess}
          editingPid={editingPid}
          onCancel={handleFormCancel}
        />
      )}

      <StudentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedStudentPid(null);
        }}
        pid={selectedStudentPid}
      />
    </>
  );
}

export default App;
