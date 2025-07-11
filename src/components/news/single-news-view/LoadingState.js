import React from 'react';

/**
 * LoadingState component for displaying a loading spinner or message
 * 
 * @returns {JSX.Element} - Rendered component
 */
const LoadingState = () => {
  return (
    <div className="single-news-view">
      <div className="container">
        <div className="loading-spinner">
          <p>Loading news article...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;