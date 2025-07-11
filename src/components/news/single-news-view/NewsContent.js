import React from 'react';
import PropTypes from 'prop-types';
import NewsMetadata from './NewsMetadata';
import NewsImage from './NewsImage';
import NewsSource from './NewsSource';

/**
 * NewsContent component for displaying the content of a news article
 * 
 * @param {Object} props - Component props
 * @param {Object} props.news - News data
 * @param {Function} props.formatDate - Function to format date
 * @param {string} props.defaultImage - Default image URL
 * @returns {JSX.Element} - Rendered component
 */
const NewsContent = ({ news, formatDate, defaultImage }) => {
  return (
    <div className="news-content">
      <h1 className="news-title">{news.title}</h1>
      
      <NewsMetadata 
        author={news.author?.name || 'Unknown Author'} 
        date={formatDate(news.creationDate)}
        tags={news.tags || []}
      />

      <NewsImage 
        imagePath={news.imagePath} 
        defaultImage={defaultImage} 
        title={news.title} 
      />

      <div className="news-text" dangerouslySetInnerHTML={{ __html: news.content }} />

      {news.source && <NewsSource source={news.source} />}
    </div>
  );
};

NewsContent.propTypes = {
  news: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    creationDate: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    imagePath: PropTypes.string,
    content: PropTypes.string.isRequired,
    source: PropTypes.string
  }).isRequired,
  formatDate: PropTypes.func.isRequired,
  defaultImage: PropTypes.string.isRequired
};

export default NewsContent;