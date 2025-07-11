import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * NewsHeader component for displaying the header of a news article
 * with back and edit buttons
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onBackClick - Handler for back button click
 * @param {boolean} props.isAuthor - Whether the current user is the author
 * @param {boolean} props.isAdmin - Whether the current user is an admin
 * @param {string|number} props.newsId - ID of the news article
 * @returns {JSX.Element} - Rendered component
 */
const NewsHeader = ({ onBackClick, isAuthor, isAdmin, newsId }) => {
  const navigate = useNavigate();

  // Handle edit button click
  const handleEditClick = () => {
    navigate(`/news/edit/${newsId}`);
  };

  return (
    <div className="news-header">
      <button className="back-button" onClick={onBackClick}>
        Back to news
      </button>
      
      {/* Show edit button only if user is the author or an admin */}
      {(isAuthor || isAdmin) && (
        <button 
          className="edit-button"
          onClick={handleEditClick}
        >
          Edit
        </button>
      )}
    </div>
  );
};

NewsHeader.propTypes = {
  onBackClick: PropTypes.func.isRequired,
  isAuthor: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  newsId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default NewsHeader;