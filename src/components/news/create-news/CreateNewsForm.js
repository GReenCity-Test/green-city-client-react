import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagFilter from '../../shared/TagFilter';
import ImageUpload from './ImageUpload';
import {EDITOR_MODULES, EDITOR_FORMATS, TEXT_CONSTRAINTS} from './constants';
/**
 * Form component for creating news
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - News title
 * @param {Function} props.setTitle - Title setter
 * @param {Array} props.selectedTags - Selected tags
 * @param {Function} props.setSelectedTags - Selected tags setter
 * @param {File|null} props.image - Current image file
 * @param {string} props.imagePreview - Current image preview URL
 * @param {File|null} props.tempImage - Temporary image file before submission
 * @param {string} props.tempImagePreview - Temporary image preview URL
 * @param {string} props.text - News content (HTML)
 * @param {Function} props.setText - Text setter
 * @param {string} props.source - News source URL
 * @param {Function} props.setSource - Source setter
 * @param {Object} props.errors - Form validation errors
 * @param {Array} props.imageErrors - Image validation errors
 * @param {Object} props.touchedFields - Fields that have been touched
 * @param {Function} props.setTouchedFields - Touched fields setter
 * @param {boolean} props.isFormValid - Whether the form is valid
 * @param {Function} props.validateField - Field validation function
 * @param {Function} props.validateForm - Form validation function
 * @param {Function} props.handleSubmit - Form submission handler
 * @param {Function} props.handlePreview - Preview button handler
 * @param {Function} props.handleCancel - Cancel button handler
 * @param {Function} props.handleImageUpload - Image upload handler
 * @param {Function} props.handleImageSubmit - Image submission handler
 * @param {Function} props.handleImageCancel - Image cancellation handler
 * @param {Function} props.handleRemoveImage - Image removal handler
 * @param {string} props.authorName - Author name
 * @param {string} props.formattedDate - Formatted date
 * @param {Array} props.tagsList - Available tags
 * @param {Function} props.t - Translation function
 * @returns {JSX.Element} - Rendered component
 */
const CreateNewsForm = ({
  title,
  setTitle,
  selectedTags,
  setSelectedTags,
  image,
  imagePreview,
  tempImage,
  tempImagePreview,
  text,
  setText,
  source,
  setSource,
  errors,
  imageErrors,
  touchedFields,
  setTouchedFields,
  isFormValid,
  validateField,
  validateForm,
  handleSubmit,
  handlePreview,
  handleCancel,
  handleImageUpload,
  handleImageSubmit,
  handleImageCancel,
  handleRemoveImage,
  authorName,
  formattedDate,
  tagsList,
  t
}) => {
  const titleTextAreaRef = useRef(null);

  // Auto-resize text areas
  useEffect(() => {
    if (titleTextAreaRef.current) {
      titleTextAreaRef.current.style.height = 'auto';
      titleTextAreaRef.current.style.height = `${Math.min(titleTextAreaRef.current.scrollHeight, 150)}px`;
    }
  }, [title]);

  // Handle tag selection
  const handleTagSelect = (tags) => {

    const limitedTags = tags.length > TEXT_CONSTRAINTS.MAX_TAGS ? tags.slice(0, 3) : tags;
    setSelectedTags(limitedTags);
    setTouchedFields(prev => ({ ...prev, tags: true }));
    validateField('tags', limitedTags);
    validateForm();
  };

  // Handle image change (from the ImageUpload component)
  const onImageChange = (file) => {
    handleImageUpload({ target: { files: [file] } });
  };

  return (
    <div className="container">
      <h1>{t('news.create.title') || 'Create News'}</h1>
      <p className="create-news-description">{t('news.create.description') || 'Please provide as many details as you can - place and time of the event, the goal of gathering, etc. You can come back and update news anytime after publishing.'}</p>

      <form className="create-news-form" onSubmit={handleSubmit}>
        <div className="form-layout">
          <div className="form-column-left">
            {/* Title */}
            <div className="form-group">
              <div className="label-with-count">
                <label htmlFor="title">{t('news.create.titleLabel') || 'Title'} <span className="required">*</span></label>
                <div className="character-count">{title.length}/170</div>
              </div>
              <textarea
                id="title"
                ref={titleTextAreaRef}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTouchedFields(prev => ({ ...prev, title: true }));
                  validateField('title', e.target.value);
                  // Call validateForm to update isFormValid after the title is changed
                  validateForm();
                }}
                placeholder={t('news.create.titlePlaceholder') || 'Enter title'}
                className={`auto-resize ${touchedFields.title && errors.title ? 'error' : ''}`}
                maxLength={170}
              />
              {touchedFields.title && errors.title && <div className="error-message">{t(`news.create.errors.${errors.title}`) || errors.title}</div>}
            </div>

            {/* Tags */}
            <div className="form-group">
              <label>{t('news.create.tagLabel') || 'Tag'} <span className="required">*</span></label>
              <div className="tag-instructions">{t('news.create.tagInstructions')}</div>
              <div className="tag-instructions">{t('news.create.tagLimit')}</div>
              <div className={`tag-selection ${touchedFields.tags && errors.tags ? 'error' : ''}`}>
                <TagFilter
                  tags={tagsList}
                  onTagSelect={handleTagSelect}
                  selectedTags={selectedTags}
                  storageKey="create-news-tags"
                />
              </div>
            </div>
            {touchedFields.tags && errors.tags && <div className="error-message">{t(`news.create.errors.${errors.tags}`) || errors.tags}</div>}
          </div>

          <div className="form-column-right">
            {/* Image Upload */}
            <ImageUpload
              image={image}
              imagePreview={imagePreview}
              tempImage={tempImage}
              tempImagePreview={tempImagePreview}
              imageErrors={imageErrors}
              onImageChange={onImageChange}
              onImageSubmit={handleImageSubmit}
              onImageCancel={handleImageCancel}
              onImageRemove={handleRemoveImage}
              t={t}
            />
          </div>
        </div>

        {/* Source */}
        <div className="form-group">
          <div className="label-with-count">
            <label htmlFor="source">{t('news.create.sourceLabel') || 'Source'}</label>
            <div className="source-hint">
              {t('news.create.sourceHint') || 'Please add the link of original article/news/post. Link must start with http(s)://'}
            </div>
          </div>
          <input
            type="text"
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder={t('news.create.sourcePlaceholder') || 'Enter source URL'}
            className="source-input"
          />
        </div>

        {/* Main Text */}
        <div className="form-group">
          <div className="label-with-count">
            <label htmlFor="text">{t('news.create.textLabel') || 'Main text'} <span className="required">*</span></label>
            <div className="text-length-hint">
              {t('news.create.textLengthHint') || 'Must be minimum 20 and maximum 63,206 symbols.'}
            </div>
          </div>
          <ReactQuill
            id="text"
            value={text}
            onChange={(content) => {
              setText(content);
              setTouchedFields(prev => ({ ...prev, text: true }));
              const textContent = content.replace(/<[^>]*>/g, '');
              validateField('text', textContent.trim());
              validateForm();
            }}
            placeholder={t('news.create.textPlaceholder') || 'Enter a detailed description of your news or event. Include relevant information that would be helpful for readers.'}
            className={`rich-text-editor ${touchedFields.text && errors.text ? 'error' : ''}`}
            modules={EDITOR_MODULES}
            formats={EDITOR_FORMATS}
            theme="snow"
          />
          {touchedFields.text && errors.text && <div className="error-message">{t(`news.create.errors.${errors.text}`) || errors.text}</div>}
        </div>

        {/* Date and Author information */}
        <div className="auto-filled-field" style={{ marginBottom: '20px' }}>
          <p>Date: {formattedDate} &nbsp;&nbsp;&nbsp; Author: {authorName || 'Loading author information...'}</p>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            {t('news.create.cancelButton') || 'Cancel'}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handlePreview} 
            disabled={!isFormValid}
            style={{ 
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              opacity: isFormValid ? 1 : 0.6
            }}
          >
            {t('news.create.previewButton') || 'Preview'}
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
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

        {errors.submit && <div className="error-message submit-error">{t('news.create.errors.submit') || errors.submit}</div>}
      </form>
    </div>
  );
};

CreateNewsForm.propTypes = {
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedTags: PropTypes.func.isRequired,
  image: PropTypes.object,
  imagePreview: PropTypes.string,
  tempImage: PropTypes.object,
  tempImagePreview: PropTypes.string,
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
  setSource: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  imageErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
  touchedFields: PropTypes.object.isRequired,
  setTouchedFields: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  validateField: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handlePreview: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
  handleImageSubmit: PropTypes.func.isRequired,
  handleImageCancel: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  authorName: PropTypes.string,
  formattedDate: PropTypes.string.isRequired,
  tagsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  t: PropTypes.func.isRequired
};

export default CreateNewsForm;
