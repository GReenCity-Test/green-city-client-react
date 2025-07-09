import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NewsService from '../../services/news/NewsService';
import TagFilter from '../shared/TagFilter';
import { tagsListEcoNewsData } from '../../models/news/NewsConstants';
import { useTranslation } from '../../services/translation/TranslationService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateNews.scss';

/**
 * CreateNews component for creating and publishing news articles
 * @returns {JSX.Element} - Rendered component
 */
const CreateNews = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { t, currentLanguage } = useTranslation();
  const fileInputRef = useRef(null);

  // Format date to show month as text, day, year
  const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(currentLanguage === 'ua' ? 'uk-UA' : 'en-US', options);
  };

  // Form state
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tempImage, setTempImage] = useState(null);
  const [tempImagePreview, setTempImagePreview] = useState('');
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Text area refs for auto-resizing
  const titleTextAreaRef = useRef(null);

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align', 'indent',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth/sign-in', { state: { from: '/news/create-news' } });
    }
  }, [isAuthenticated, navigate]);

  // Debug currentUser changes
  useEffect(() => {
    console.log('CurrentUser changed:', currentUser);
    if (currentUser) {
      console.log('CurrentUser properties:', Object.keys(currentUser));
      console.log('firstName:', currentUser.firstName);
      console.log('lastName:', currentUser.lastName);

      // Check if user has name property instead of firstName/lastName
      if (currentUser.name) {
        console.log('name:', currentUser.name);
      }

      // Check if user info is nested in a user property
      if (currentUser.user) {
        console.log('user property exists:', Object.keys(currentUser.user));
      }
    }
  }, [currentUser]);

  // Auto-resize text areas
  useEffect(() => {
    if (titleTextAreaRef.current) {
      titleTextAreaRef.current.style.height = 'auto';
      titleTextAreaRef.current.style.height = `${Math.min(titleTextAreaRef.current.scrollHeight, 150)}px`;
    }
  }, [title]);

  // No need for text area auto-resize with Quill editor

  // Handle tag selection
  const handleTagSelect = (tags) => {
    // Limit to maximum 3 tags
    const limitedTags = tags.length > 3 ? tags.slice(0, 3) : tags;
    setSelectedTags(limitedTags);
    validateField('tags', limitedTags);
    // Call validateForm to update isFormValid
    validateForm();
  };

  // Validate image file
  const validateImageFile = (file) => {
    const errors = [];

    // Check file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      errors.push('Invalid image type');
    }

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('Image size exceeds limit');
    }

    return errors;
  };

  // Handle image upload from input
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validationErrors = validateImageFile(file);
      setImageErrors(validationErrors);

      if (validationErrors.length === 0) {
        setTempImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempImagePreview(reader.result);
          // Call validateForm to update isFormValid after image preview is set
          validateForm();
        };
        reader.readAsDataURL(file);
      } else {
        // Call validateForm even if there are validation errors
        validateForm();
      }
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validationErrors = validateImageFile(file);
      setImageErrors(validationErrors);

      if (validationErrors.length === 0) {
        setTempImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempImagePreview(reader.result);
          // Call validateForm to update isFormValid after image preview is set
          validateForm();
        };
        reader.readAsDataURL(file);
      } else {
        // Call validateForm even if there are validation errors
        validateForm();
      }
    }
  };

  // Submit temporary image
  const handleImageSubmit = () => {
    if (tempImage && imageErrors.length === 0) {
      setImage(tempImage);
      setImagePreview(tempImagePreview);
      setTempImage(null);
      setTempImagePreview('');
      // Call validateForm to update isFormValid after image is submitted
      validateForm();
    }
  };

  // Cancel temporary image
  const handleImageCancel = () => {
    setTempImage(null);
    setTempImagePreview('');
    setImageErrors([]);
    // Call validateForm to update isFormValid after image is canceled
    validateForm();
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
    setTempImage(null);
    setTempImagePreview('');
    setImageErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Call validateForm to update isFormValid after image is removed
    validateForm();
  };

  // Validate a single field
  const validateField = useCallback((field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else if (value.length > 170) {
          newErrors.title = 'Title must be less than 170 characters';
        } else {
          delete newErrors.title;
        }
        break;

      case 'tags':
        if (!value.length) {
          newErrors.tags = 'At least one tag must be selected';
        } else {
          delete newErrors.tags;
        }
        break;

      case 'text':
        // For text field, value is already plain text (HTML tags stripped in the onChange handler)
        if (!value.trim()) {
          newErrors.text = 'Main text is required';
        } else if (value.trim().length < 20) {
          newErrors.text = 'Main text must be at least 20 characters';
        } else if (value.length > 63206) {
          newErrors.text = 'Main text must be less than 63,206 characters';
        } else {
          delete newErrors.text;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors]);

  // Helper function to get author name from currentUser object
  const getAuthorName = useCallback(() => {
    if (!currentUser) return null;

    // Check for firstName and lastName properties
    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }

    // Check for name property
    if (currentUser.name) {
      return currentUser.name;
    }

    // Check if user info is nested in a user property
    if (currentUser.user) {
      const user = currentUser.user;
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      if (user.name) {
        return user.name;
      }
    }

    // Check for username or email as fallback
    if (currentUser.username) {
      return currentUser.username;
    }

    if (currentUser.email) {
      return currentUser.email.split('@')[0]; // Use part before @ as name
    }

    return null;
  }, [currentUser]);

  // Validate all fields
  const validateForm = useCallback(() => {
    let isValid = true;

    isValid = validateField('title', title) && isValid;
    isValid = validateField('tags', selectedTags) && isValid;
    isValid = validateField('text', text) && isValid;

    // Check if there's a temporary image that hasn't been submitted yet
    if (tempImage && !image) {
      isValid = false;
    }

    // Check if author information is available
    // Log currentUser for debugging
    console.log('Current user in validateForm:', currentUser);
    const authorName = getAuthorName();
    if (!authorName) {
      console.log('Author information is not available or incomplete');
      isValid = false;
    }

    setIsFormValid(isValid);
    return isValid;
  }, [title, selectedTags, text, tempImage, image, validateField, currentUser, getAuthorName]);

  // Validate form whenever relevant fields change or when component mounts
  useEffect(() => {
    validateForm();
  }, [validateForm, currentUser]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there's a temporary image but it hasn't been submitted yet, show an error
    if (tempImage && !image) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setImageErrors(['Please submit or cancel the image before publishing']);
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      // Get author name
      const authorName = getAuthorName();
      if (!authorName) {
        throw new Error('Author information is not available');
      }

      // Split author name into first and last name if possible
      let firstName = authorName;
      let lastName = '';

      if (authorName.includes(' ')) {
        const nameParts = authorName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      const newsData = {
        title,
        text,
        tags: selectedTags.map(tag => ({ name: tag })),
        source: source || null,
        image: image || null,
        author: {
          firstName,
          lastName
        }
      };

      await NewsService.createNews(newsData);
      navigate('/news');
    } catch (error) {
      console.error('Error creating news:', error);
      setErrors({ submit: 'Failed to create news. Please try again.' });
    }
  };

  // Handle preview toggle
  const handlePreview = () => {
    if (!validateForm()) {
      return;
    }

    setIsPreview(!isPreview);
  };

  // Handle cancel
  const handleCancel = () => {
    // Show confirmation dialog if form has content
    if (title.trim() || text.trim() || selectedTags.length > 0 || image || source.trim()) {
      setShowCancelDialog(true);
    } else {
      // If form is empty, navigate without confirmation
      navigate('/news');
    }
  };

  // Confirm cancel and navigate away
  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate('/news');
  };

  // Close cancel dialog
  const closeDialog = () => {
    setShowCancelDialog(false);
  };

  // Preview component
  const NewsPreview = () => (
    <div className="news-preview">
      <h2>{t('news.create.previewTitle') || 'Preview'}</h2>

      <div className="preview-content">
        <h1>{title}</h1>

        <div className="preview-tags">
          {selectedTags.map((tag, index) => (
            <span key={index} className="preview-tag">{tag}</span>
          ))}
        </div>

        {imagePreview && (
          <div className="preview-image">
            <img src={imagePreview} alt={t('news.create.previewAlt') || 'News preview'} />
          </div>
        )}

        <div className="preview-text" dangerouslySetInnerHTML={{ __html: text }}></div>

        <div className="preview-meta">
          {/* Debug currentUser */}
          {console.log('Current user in preview:', currentUser)}
          <p>Date: {formatDate(new Date())} &nbsp;&nbsp;&nbsp; Author: {getAuthorName() || 'Loading author information...'}</p>
          {source && <p>{t('news.create.sourcePreview') || 'Source'}: {source}</p>}
        </div>
      </div>

      <div className="preview-actions">
        <button className="btn-secondary" onClick={handlePreview}>
          {t('news.create.backToEditButton') || 'Back to Edit'}
        </button>
        <button 
          className="btn-primary" 
          onClick={handleSubmit} 
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
    </div>
  );

  // If in preview mode, show the preview
  if (isPreview) {
    return <NewsPreview />;
  }


  // Cancel confirmation dialog
  const CancelDialog = () => (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{t('news.create.cancelTitle') || 'Cancel News Creation'}</h3>
        <p>All created content will be lost.</p>
        <p>Do you still want to cancel news creating?</p>
        <div className="dialog-actions">
          <button 
            className="btn-secondary" 
            onClick={closeDialog}
            type="button"
          >
            {t('news.create.cancelNo') || 'Continue editing'}
          </button>
          <button 
            className="btn-primary" 
            onClick={confirmCancel}
            type="button"
          >
            {t('news.create.cancelYes') || 'Yes, cancel'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="create-news-page">
      {showCancelDialog && <CancelDialog />}

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
                    validateField('title', e.target.value);
                    // Call validateForm to update isFormValid after title is changed
                    validateForm();
                  }}
                  placeholder={t('news.create.titlePlaceholder') || 'Enter title'}
                  className={`auto-resize ${errors.title ? 'error' : ''}`}
                  maxLength={170}
                />
                {errors.title && <div className="error-message">{t(`news.create.errors.${errors.title}`) || errors.title}</div>}
              </div>

              {/* Tags */}
              <div className="form-group">
                <label>{t('news.create.tagLabel') || 'Tag'} <span className="required">*</span></label>
                <div className="tag-instructions">{t('news.create.tagInstructions')}</div>
                <div className="tag-instructions">{t('news.create.tagLimit')}</div>
                <div className={`tag-selection ${errors.tags ? 'error' : ''}`}>
                  <TagFilter
                    tags={tagsListEcoNewsData}
                    onTagSelect={handleTagSelect}
                    selectedTags={selectedTags}
                    storageKey={null} // Don't save to localStorage
                  />
                </div>
              </div>
              {errors.tags && <div className="error-message">{t(`news.create.errors.${errors.tags}`) || errors.tags}</div>}
            </div>

            <div className="form-column-right">
              {/* Image Upload */}
              <div className="form-group image-upload-section">
                <label htmlFor="image">{t('news.create.imageLabel') || 'Picture (optional)'}</label>

                {!image && !tempImage ? (
                  <>
                    <div 
                      className={`drop-area ${isDragging ? 'dragging' : ''}`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="image"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/png,image/jpeg,image/jpg"
                        className="file-input"
                      />
                      <div className="drop-message">
                        {t('news.create.dropImageText').split('browse')[0] || 'Drop your image here or '}
                        <label htmlFor="image" className="browse-link">
                          browse
                        </label>
                      </div>

                      {/* Display validation errors */}
                      {imageErrors.length > 0 && (
                        <div className="image-errors">
                          {imageErrors.map((error, index) => (
                            <div key={index} className="error-message">
                              {t(`news.create.errors.${error}`) || error}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* File type and size hint */}
                    <div className="image-hint">
                      {t('news.create.imageHint') || 'Upload only PNG or JPG. File size must be less than 10MB'}
                    </div>
                  </>
                ) : null}

                {/* Temporary image preview with Submit/Cancel buttons */}
                {tempImage && !image && (
                  <div className="temp-image-container">
                    <div className="image-preview-container">
                      <img src={tempImagePreview} alt={t('news.create.previewAlt') || 'Preview'} className="image-preview" />
                    </div>

                    {/* File type and size hint */}
                    <div className="image-hint">
                      {t('news.create.imageHint') || 'Upload only PNG or JPG. File size must be less than 10MB'}
                    </div>

                    <div className="image-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleImageCancel}
                      >
                        {t('news.create.imageCancelButton') || 'Cancel'}
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleImageSubmit}
                      >
                        {t('news.create.imageSubmitButton') || 'Submit'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Final image preview with remove button */}
                {image && (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt={t('news.create.previewAlt') || 'Preview'} className="image-preview" />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={handleRemoveImage}
                      aria-label={t('news.create.removeImage') || 'Remove image'}
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* File type and size hint below the image */}
                {image && (
                  <div className="image-hint">
                    {t('news.create.imageHint') || 'Upload only PNG or JPG. File size must be less than 10MB'}
                  </div>
                )}
              </div>
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
                // Get plain text for validation (strip HTML tags)
                const textContent = content.replace(/<[^>]*>/g, '');
                validateField('text', textContent.trim());
                // Call validateForm to update isFormValid after text is changed
                validateForm();
              }}
              placeholder={t('news.create.textPlaceholder') || 'Enter a detailed description of your news or event. Include relevant information that would be helpful for readers.'}
              className={`rich-text-editor ${errors.text ? 'error' : ''}`}
              modules={modules}
              formats={formats}
              theme="snow"
            />
            {errors.text && <div className="error-message">{t(`news.create.errors.${errors.text}`) || errors.text}</div>}
          </div>

          {/* Date and Author information */}
          <div className="auto-filled-field" style={{ marginBottom: '20px' }}>
            {/* Debug currentUser */}
            {console.log('Current user in main form:', currentUser)}
            <p>Date: {formatDate(new Date())} &nbsp;&nbsp;&nbsp; Author: {getAuthorName() || 'Loading author information...'}</p>
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
    </div>
  );
};

export default CreateNews;
