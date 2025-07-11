import React from 'react';
import PropTypes from 'prop-types';

/**
 * NewsImage component for displaying the image of a news article
 * 
 * @param {Object} props - Component props
 * @param {string} props.imagePath - Path to the image
 * @param {string} props.defaultImage - Default image URL
 * @param {string} props.title - News title for alt text
 * @returns {JSX.Element} - Rendered component
 */
const NewsImage = ({ imagePath, defaultImage, title }) => {
  return (
    <div className="news-image">
      <img src={imagePath || defaultImage} alt={title} />
    </div>
  );
};

NewsImage.propTypes = {
  imagePath: PropTypes.string,
  defaultImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default NewsImage;