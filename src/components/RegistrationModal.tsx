import React from 'react';
import EnrollmentForm from './EnrollmentForm';
import '../styles/Modal.css';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPid?: string | null;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingPid,
}) => {
  if (!isOpen) return null;

  const handleFormSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">
          ✕
        </button>
        <div className="modal-body">
          <EnrollmentForm onSuccess={handleFormSuccess} editingPid={editingPid} />
        </div>
      </div>
    </div>
  );
};
