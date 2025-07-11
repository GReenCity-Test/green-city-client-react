import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorState component for displaying an error message
 * 
 * @param {Object} props - Component props
 * @param {string} props.error - Error message
 * @param {Function} props.onBackClick - Handler for back button click
 * @returns {JSX.Element} - Rendered component
 */
const ErrorState = ({ error, onBackClick }) => {
  return (
    <div className="single-news-view">
      <div className="container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="back-button" onClick={onBackClick}>
            Back to news
          </button>
        </div>
      </div>
    </div>
  );
};

ErrorState.propTypes = {
  error: PropTypes.string.isRequired,
  onBackClick: PropTypes.func.isRequired
};

export default ErrorState;