import React from 'react';
import PropTypes from 'prop-types';

/**
 * Confirmation dialog shown when canceling news creation
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the dialog
 * @param {Function} props.onContinueEditing - Handler for continuing editing
 * @param {Function} props.onConfirmCancel - Handler for confirming cancellation
 * @param {Function} props.t - Translation function
 * @returns {JSX.Element|null} - Rendered component or null if not shown
 */
const CancelDialog = ({ show, onContinueEditing, onConfirmCancel, t }) => {
  if (!show) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{t('news.create.cancelTitle') || 'Cancel News Creation'}</h3>
        <p>All created content will be lost.</p>
        <p>Do you still want to cancel news creating?</p>
        <div className="dialog-actions">
          <button 
            className="btn-secondary" 
            onClick={onContinueEditing}
            type="button"
          >
            {t('news.create.cancelNo') || 'Continue editing'}
          </button>
          <button 
            className="btn-primary" 
            onClick={onConfirmCancel}
            type="button"
          >
            {t('news.create.cancelYes') || 'Yes, cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

CancelDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onContinueEditing: PropTypes.func.isRequired,
  onConfirmCancel: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default CancelDialog;