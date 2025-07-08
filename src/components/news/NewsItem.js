import React from 'react';
import { Link } from 'react-router-dom';
import './NewsItem.scss';

/**
 * NewsItem component for displaying a news article in either gallery or list view
 *
 * @param {Object} props - Component props
 * @param {Object} props.news - News article data
 * @param {boolean} [props.isGalleryView=true] - Whether to display in gallery view
 * @returns {JSX.Element} - Rendered component
 */
const NewsItem = ({ news, isGalleryView = true }) => {
  const defaultImage = 'assets/img/main-event-placeholder.png';

  /**
   * Format a date string to a readable format
   * @param {string} dateString - Date string to format
   * @returns {string} - Formatted date string
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  /**
   * Truncate content to a specific length
   * @param {string} content - Content to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} - Truncated content
   */
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  /**
   * Render tags for the news article
   * @returns {JSX.Element} - Rendered tags
   */
  const renderTags = () => {
    if (!news.tags || news.tags.length === 0) return null;

    return (
      <div className="news-tags">
        {news.tags.map((tag, index) => (
          <span key={index} className="news-tag">{tag}</span>
        ))}
      </div>
    );
  };

  // Determine the appropriate content to display based on view mode
  const contentToDisplay = news.shortInfo || news.content;
  const maxLength = isGalleryView ? 100 : 200;

  return (
    <div className={`news-item ${isGalleryView ? 'gallery-view' : 'list-view'}`}>
      <Link to={`/news/${news.id}`} className="news-link">
        <div className="news-image">
          <img src={news.imagePath || defaultImage} alt={news.title} />
        </div>

        <div className="news-content">
          {renderTags()}

          <h3 className="news-title">{news.title}</h3>

          <p className="news-excerpt">{truncateContent(contentToDisplay, maxLength)}</p>

          <div className="news-meta">
            <span className="news-author">
              {news.author?.name || 'Unknown Author'}
            </span>
            <span className="news-date">{formatDate(news.creationDate)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsItem;
