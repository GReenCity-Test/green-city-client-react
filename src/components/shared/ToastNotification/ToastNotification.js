import React, { useEffect } from 'react';
import './ToastNotification.scss';

/**
 * Toast notification component for displaying temporary messages
 * Automatically closes after a specified duration
 *
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display
 * @param {string} props.type - Type of notification ('success', 'error', 'info')
 * @param {boolean} props.isOpen - Whether the notification is open
 * @param {Function} props.onClose - Function to call when the notification is closed
 * @param {number} [props.duration=5000] - Duration in milliseconds before auto-closing
 * @returns {JSX.Element|null} - Rendered component or null if not open
 */
const ToastNotification = ({ message, type = 'success', isOpen, onClose, duration = 5000 }) => {
  // Close notification after specified duration
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      // Clear timeout on unmount or when notification closes
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  // Don't render anything if the notification is not open
  if (!isOpen) return null;

  // Determine title based on type
  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'info':
        return 'Information';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="toast-notification-overlay" onClick={onClose}>
      <div 
        className={`toast-notification-content toast-${type}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="toast-notification-close" onClick={onClose}>×</button>
        <div className="toast-notification-header">
          <h3>{getTitle()}</h3>
        </div>
        <div className="toast-notification-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;