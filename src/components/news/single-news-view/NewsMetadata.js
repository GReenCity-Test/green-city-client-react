import React from 'react';
import PropTypes from 'prop-types';

/**
 * NewsMetadata component for displaying author, date, and tags of a news article
 * 
 * @param {Object} props - Component props
 * @param {string} props.author - Author name
 * @param {string} props.date - Formatted date
 * @param {Array} props.tags - Array of tags
 * @returns {JSX.Element} - Rendered component
 */
const NewsMetadata = ({ author, date, tags }) => {
  return (
    <>
      <div className="news-meta">
        <span className="news-author">
          {author}
        </span>
        <span className="news-date">{date}</span>
      </div>

      {tags && tags.length > 0 && (
        <div className="news-tags">
          {tags.map((tag) => (
            <span key={tag} className="news-tag">{tag}</span>
          ))}
        </div>
      )}
    </>
  );
};

NewsMetadata.propTypes = {
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string)
};

NewsMetadata.defaultProps = {
  tags: []
};

export default NewsMetadata;