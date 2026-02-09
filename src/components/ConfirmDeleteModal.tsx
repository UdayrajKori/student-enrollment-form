import React from 'react';
import '../styles/ConfirmModal.css';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  studentName,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-icon">⚠️</div>
        
        <h2 className="confirm-modal-title">Delete Student</h2>
        
        <p className="confirm-modal-message">
          Are you sure you want to delete <strong>{studentName}</strong>?
        </p>
        
        <p className="confirm-modal-warning">
          This action cannot be undone. All student data will be permanently deleted.
        </p>

        <div className="confirm-modal-actions">
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn-delete-confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
