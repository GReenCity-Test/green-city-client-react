import React from 'react';
import PropTypes from 'prop-types';

/**
 * NewsSource component for displaying the source of a news article
 * 
 * @param {Object} props - Component props
 * @param {string} props.source - Source URL or text
 * @returns {JSX.Element} - Rendered component
 */
const NewsSource = ({ source }) => {
  return (
    <div className="news-source">
      <h3>Source:</h3>
      <p>{source}</p>
    </div>
  );
};

NewsSource.propTypes = {
  source: PropTypes.string.isRequired
};

export default NewsSource;