import React, { useEffect } from 'react';
import './ErrorModal.scss';

/**
 * Modal component for displaying error messages
 * Automatically closes after 5 seconds
 *
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @returns {JSX.Element|null} - Rendered component or null if not open
 */
const ErrorModal = ({ message, isOpen, onClose }) => {
  // Close modal after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      // Clear timeout on unmount or when modal closes
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="error-modal-overlay" onClick={onClose}>
      <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="error-modal-close" onClick={onClose}>×</button>
        <div className="error-modal-header">
          <h3>Error</h3>
        </div>
        <div className="error-modal-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
