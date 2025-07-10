import React from 'react';
import PropTypes from 'prop-types';

/**
 * News preview component
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - News title
 * @param {Array} props.selectedTags - Selected tags
 * @param {string} props.imagePreview - Image preview URL
 * @param {string} props.text - News content (HTML)
 * @param {string} props.source - News source URL
 * @param {string} props.authorName - Author name
 * @param {string} props.formattedDate - Formatted date
 * @param {boolean} props.isFormValid - Whether the form is valid
 * @param {Function} props.onBackToEditing - Handler for back to editing button
 * @param {Function} props.onPublish - Handler for publish button
 * @param {Function} props.t - Translation function
 * @returns {JSX.Element} - Rendered component
 */
const NewsPreview = ({
  title,
  selectedTags,
  imagePreview,
  text,
  source,
  authorName,
  formattedDate,
  isFormValid,
  onBackToEditing,
  onPublish,
  t
}) => {
  return (
    <div className="news-preview">
      <div className="preview-header">
        <div className="back-to-edit">
          <img src="/assets/img/icon/arrow.svg" alt="Back arrow" className="back-arrow" />
          <button 
            className="back-link" 
            onClick={onBackToEditing}
            type="button"
          >
            {t('news.create.backToEditButton') || 'Back to editing'}
          </button>
        </div>
        <h2>{t('news.create.previewTitle') || 'Create news'}</h2>
        <button 
          className="publish-button" 
          onClick={onPublish} 
          disabled={!isFormValid}
          style={{ 
            backgroundColor: isFormValid ? '#4caf50' : '#cccccc',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            color: isFormValid ? 'white' : '#666666'
          }}
        >
          {t('news.create.publishButton') || 'Publish'}
        </button>
      </div>

      <div className="preview-content">
        <div className="preview-tags">
          {selectedTags.map((tag) => (
            <span key={tag} className="preview-tag">{tag}</span>
          ))}
        </div>

        <h1>{title}</h1>

        <div className="preview-meta">
          <p>Date: {formattedDate} &nbsp;&nbsp;&nbsp; Author: {authorName || 'Loading author information...'}</p>
        </div>

        <div className="preview-image">
          {imagePreview ? (
            <img src={imagePreview} alt={t('news.create.previewAlt') || 'News preview'} />
          ) : (
            <div className="placeholder-image">
              <div className="placeholder-content">
                <span>ECO NEWS</span>
              </div>
            </div>
          )}
        </div>

        <div className="preview-social">
          <div className="social-icons">
            <button className="social-icon twitter" title={t('news.create.shareTwitter') || 'Share on Twitter'}>
              <span>𝕏</span>
            </button>
            <button className="social-icon linkedin" title={t('news.create.shareLinkedIn') || 'Share on LinkedIn'}>
              <span>in</span>
            </button>
            <button className="social-icon facebook" title={t('news.create.shareFacebook') || 'Share on Facebook'}>
              <span>f</span>
            </button>
          </div>
        </div>

        <div className="preview-text" dangerouslySetInnerHTML={{ __html: text }}></div>

        {source && <div className="preview-source">
          <p>{t('news.create.sourcePreview') || 'Source'}: {source}</p>
        </div>}
      </div>
    </div>
  );
};

NewsPreview.propTypes = {
  title: PropTypes.string.isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  imagePreview: PropTypes.string,
  text: PropTypes.string.isRequired,
  source: PropTypes.string,
  authorName: PropTypes.string,
  formattedDate: PropTypes.string.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onBackToEditing: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default NewsPreview;
