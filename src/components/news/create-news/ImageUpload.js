import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Image upload component with drag-and-drop functionality
 * 
 * @param {Object} props - Component props
 * @param {File|null} props.image - Current image file
 * @param {string} props.imagePreview - Current image preview URL
 * @param {File|null} props.tempImage - Temporary image file before submission
 * @param {string} props.tempImagePreview - Temporary image preview URL
 * @param {Array} props.imageErrors - Array of image validation errors
 * @param {Function} props.onImageChange - Handler for image change
 * @param {Function} props.onImageSubmit - Handler for image submission
 * @param {Function} props.onImageCancel - Handler for image cancellation
 * @param {Function} props.onImageRemove - Handler for image removal
 * @param {Function} props.t - Translation function
 * @returns {JSX.Element} - Rendered component
 */
const ImageUpload = ({
  image,
  imagePreview,
  tempImage,
  tempImagePreview,
  imageErrors,
  onImageChange,
  onImageSubmit,
  onImageCancel,
  onImageRemove,
  t
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

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
      processFile(file);
    }
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e) => {
    // Trigger file input click on an Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Process the selected file
  const processFile = (file) => {
    // Validate the file but only pass the file to the parent component's handler
    // The parent component will handle validation separately
    onImageChange(file);
  };

  return (
    <div className="form-group image-upload-section">
      <label htmlFor="image" id="image-label">{t('news.create.imageLabel') || 'Picture'}</label>

      {!image && !tempImage ? (
        <>
          <button 
            type="button"
            className={`drop-area ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
            aria-label={t('news.create.dropAreaLabel') || 'Image drop area'}
          >
            <input
              type="file"
              id="image"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/png,image/jpeg,image/jpg"
              className="file-input"
              aria-labelledby="image-label"
              aria-describedby="image-hint"
            />
            <div className="drop-message">
              {t('news.create.dropImageText').split('browse')[0] || 'Drop your image here or '}
              <button 
                type="button" 
                className="browse-link" 
                onClick={() => fileInputRef.current.click()}
                aria-label={t('news.create.browseFiles') || 'Browse files'}
              >
                browse
              </button>
            </div>

            {/* Display validation errors */}
            {imageErrors.length > 0 && (
              <div className="image-errors">
                {imageErrors.map((error) => (
                  <div key={`error-${error}`} className="error-message">
                    {t(`news.create.errors.${error}`) || error}
                  </div>
                ))}
              </div>
            )}
          </button>

          {/* File type and size hint */}
          <div className="image-hint" id="image-hint">
            {t('news.create.imageHint') || 'Upload only PNG or JPG. File size must be less than 10MB'}
          </div>
        </>
      ) : null}

      {/* Temporary image preview with Submit/Cancel buttons */}
      {tempImage && !image && (
        <section className="temp-image-container" aria-label={t('news.create.tempImagePreview') || 'Temporary image preview'}>
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
              onClick={onImageCancel}
            >
              {t('news.create.imageCancelButton') || 'Cancel'}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={onImageSubmit}
            >
              {t('news.create.imageSubmitButton') || 'Submit'}
            </button>
          </div>
        </section>
      )}

      {/* Final image preview with the remove button */}
      {image && (
        <section className="image-preview-container" aria-label={t('news.create.finalImagePreview') || 'Final image preview'}>
          <img src={imagePreview} alt={t('news.create.previewAlt') || 'Preview'} className="image-preview" />
          <button
            type="button"
            className="remove-image-button"
            onClick={onImageRemove}
            aria-label={t('news.create.removeImage') || 'Remove image'}
          >
            ×
          </button>
        </section>
      )}

      {/* File type and size hint below the image */}
      {image && (
        <div className="image-hint">
          {t('news.create.imageHint') || 'Upload only PNG or JPG. File size must be less than 10MB'}
        </div>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  image: PropTypes.instanceOf(File),
  imagePreview: PropTypes.string,
  tempImage: PropTypes.instanceOf(File),
  tempImagePreview: PropTypes.string,
  imageErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onImageChange: PropTypes.func.isRequired,
  onImageSubmit: PropTypes.func.isRequired,
  onImageCancel: PropTypes.func.isRequired,
  onImageRemove: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default ImageUpload;
