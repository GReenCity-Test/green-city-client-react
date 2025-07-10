import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../../services/translation/TranslationService';
import NewsService from '../../../services/news/NewsService';
import { tagsListEcoNewsData } from '../../../models/news/NewsConstants';
import CreateNewsForm from './CreateNewsForm';
import NewsPreview from './NewsPreview';
import CancelDialog from './CancelDialog';
import { validateImageFile, validateField, getFieldError } from './utils/validation';
import { formatDate } from './utils/formatters';
import { getAuthorName, splitAuthorName } from './utils/authorUtils';
import './CreateNews.scss';

/**
 * CreateNews component for creating and publishing news articles
 * @returns {JSX.Element} - Rendered component
 */
const CreateNews = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { t, currentLanguage } = useTranslation();

  // Form state
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tempImage, setTempImage] = useState(null);
  const [tempImagePreview, setTempImagePreview] = useState('');
  const [text, setText] = useState('');
  const [source, setSource] = useState('');

  // Validation state
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Check if the user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth/sign-in', { state: { from: '/news/create-news' } });
    }
  }, [isAuthenticated, navigate]);

  // Monitor currentUser changes
  useEffect(() => {
    if (!currentUser && isAuthenticated()) {
      // If authenticated but no user data, we might need to fetch user data
      // This depends on how your auth system works
    }
  }, [currentUser, isAuthenticated]);

  // Validate a single field and update the error state
  const validateFieldAndUpdateErrors = useCallback((field, value) => {
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      const errorMessage = getFieldError(field, value);

      if (errorMessage) {
        newErrors[field] = errorMessage;
      } else {
        delete newErrors[field];
      }

      return newErrors;
    });

    // Return whether the field is valid
    return validateField(field, value);
  }, []);

  // Check if required fields are valid
  const validateRequiredFields = useCallback(() => {
    const titleValid = validateFieldAndUpdateErrors('title', title);
    const tagsValid = validateFieldAndUpdateErrors('tags', selectedTags);

    // Strip HTML tags for text validation
    const plainText = text.replace(/<[^>]*>/g, '').trim();
    const textValid = validateFieldAndUpdateErrors('text', plainText);

    return titleValid && tagsValid && textValid;
  }, [title, selectedTags, text, validateFieldAndUpdateErrors]);

  // Check if the image state is valid
  const isImageStateValid = useCallback(() => {
    // If there's a temporary image that hasn't been submitted yet, it's invalid
    return !(tempImage && !image);
  }, [tempImage, image]);

  // Check if author information is available
  const isAuthorValid = useCallback(() => {
    const authorName = getAuthorName(currentUser);
    return !!authorName;
  }, [currentUser]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const fieldsValid = validateRequiredFields();
    const imageValid = isImageStateValid();
    const authorValid = isAuthorValid();

    const isValid = fieldsValid && imageValid && authorValid;
    setIsFormValid(isValid);
    return isValid;
  }, [validateRequiredFields, isImageStateValid, isAuthorValid]);

  // Validate form whenever relevant fields change or when the component mounts
  useEffect(() => {
    validateForm();
  }, [validateForm, currentUser]);

  // Process image file after reading
  const processImageFile = (file, reader) => {
    // Set the temporary image
    setTempImage(file);

    // Set the preview as a string
    setTempImagePreview(reader.result.toString());

    // Call validateForm to update isFormValid after the image preview is set
    validateForm();
  };

  // Handle image read error
  const handleImageReadError = () => {
    setImageErrors(['Error reading file. Please try again.']);
    validateForm();
  };

  // Handle image upload from input
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationErrors = validateImageFile(file);
    setImageErrors(validationErrors);

    if (validationErrors.length === 0) {
      // Create a new FileReader for each file to prevent memory leaks
      const reader = new FileReader();
      reader.onloadend = () => processImageFile(file, reader);
      reader.onerror = handleImageReadError;
      reader.readAsDataURL(file);
    } else {
      // Call validateForm even if there are validation errors
      validateForm();
    }
  };

  // Clear temporary image state
  const clearTempImageState = () => {
    setTempImage(null);
    setTempImagePreview('');
  };

  // Clear all image errors
  const clearImageErrors = () => {
    setImageErrors([]);
  };

  // Update form validation after image state changes
  const updateFormAfterImageChange = () => {
    validateForm();
  };

  // Submit a temporary image
  const handleImageSubmit = () => {
    if (tempImage && imageErrors.length === 0) {
      // Set the main image from the temporary image
      setImage(tempImage);
      setImagePreview(tempImagePreview);

      // Clear temporary image state
      clearTempImageState();

      // Update form validation
      updateFormAfterImageChange();
    }
  };

  // Cancel temporary image
  const handleImageCancel = () => {
    clearTempImageState();
    clearImageErrors();
    updateFormAfterImageChange();
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    // Clear both main and temporary image states
    setImage(null);
    setImagePreview('');
    clearTempImageState();
    clearImageErrors();
    updateFormAfterImageChange();
  };

  // Check for temporary image error
  const checkTempImageError = () => {
    if (tempImage && !image) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setImageErrors(['Please submit or cancel the image before publishing']);
      return true;
    }
    return false;
  };

  // Handle validation errors by scrolling to the first error
  const handleValidationErrors = () => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = document.getElementById(errorFields[0]);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
    }
  };

  // Prepare news data for submission
  const prepareNewsData = () => {
    const authorName = getAuthorName(currentUser);
    if (!authorName) {
      setErrors(prev => ({ ...prev, submit: 'Author information is not available. Please try logging in again.' }));
      return null;
    }

    // Split the author name into first and last name
    const { firstName, lastName } = splitAuthorName(authorName);

    // Convert tags to the expected format
    const formattedTags = selectedTags.map(tag => ({ name: typeof tag === 'object' ? tag.name : String(tag) }));

    return {
      title,
      text,
      tags: formattedTags,
      source: source || null,
      image: image || null,
      author: {
        firstName,
        lastName
      }
    };
  };

  // Handle API error responses
  const handleApiError = (error) => {
    console.error('Error creating news:', error);
    let errorMessage = 'Failed to create news. Please try again.';

    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401 || error.response.status === 403) {
        errorMessage = 'You are not authorized to create news. Please log in again.';
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid data provided. Please check your inputs and try again.';
      } else if (error.response.status === 413) {
        errorMessage = 'The image file is too large. Please use a smaller image.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your internet connection.';
    }

    setErrors(prev => ({ ...prev, submit: errorMessage }));

    // Scroll to the error message
    const submitError = document.querySelector('.submit-error');
    if (submitError) {
      submitError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for temporary image error
    if (checkTempImageError()) {
      return;
    }

    // Validate the form
    if (!validateForm()) {
      handleValidationErrors();
      return;
    }

    // Prepare news data
    const newsData = prepareNewsData();
    if (!newsData) {
      return;
    }

    try {
      await NewsService.createNews(newsData);
      navigate('/news');
    } catch (error) {
      handleApiError(error);
    }
  };

  // Switch from preview to edit mode
  const switchToEditMode = () => {
    setIsPreview(false);
  };

  // Attempt to switch to preview mode after validation
  const attemptSwitchToPreviewMode = () => {
    if (validateForm()) {
      setIsPreview(true);
      return true;
    }
    return false;
  };

  // Handle preview toggle
  const handlePreview = () => {
    // If we're in preview mode, always return to edit mode
    if (isPreview) {
      switchToEditMode();
      return;
    }

    // When going from edit to preview mode, validate the form
    attemptSwitchToPreviewMode();
  };

  // Handle back to editing button click
  const handleBackToEditing = (e) => {
    // Prevent any default behavior or event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Use the existing function to switch to edit mode
    switchToEditMode();
  };

  // Dialog state management
  const showDialog = () => setShowCancelDialog(true);
  const hideDialog = () => setShowCancelDialog(false);

  // Handle cancel button click
  const handleCancel = () => {
    // Show confirmation dialog
    showDialog();
  };

  // Handle the "Continue editing" button click
  const handleContinueEditing = () => {
    hideDialog();
  };

  // Handle "Yes, cancel" button click
  const handleYesCancel = () => {
    hideDialog();
    navigate('/news');
  };

  // Get a formatted date
  const formattedDate = formatDate(new Date(), currentLanguage);

  // Get author name
  const authorName = getAuthorName(currentUser);

  // If in preview mode, show the preview
  if (isPreview) {
    // Convert selectedTags to an array of strings for NewsPreview
    const stringTags = selectedTags.map(tag => typeof tag === 'object' ? tag.name : String(tag));

    return (
      <NewsPreview
        title={title}
        selectedTags={stringTags}
        imagePreview={imagePreview}
        text={text}
        source={source}
        authorName={authorName}
        formattedDate={formattedDate}
        isFormValid={isFormValid}
        onBackToEditing={handleBackToEditing}
        onPublish={handleSubmit}
        t={t}
      />
    );
  }

  // Convert selectedTags to an array of strings for CreateNewsForm
  const stringTags = selectedTags.map(tag => typeof tag === 'object' ? tag.name : String(tag));

  return (
    <div className="create-news-page">
      <CancelDialog
        show={showCancelDialog}
        onContinueEditing={handleContinueEditing}
        onConfirmCancel={handleYesCancel}
        t={t}
      />

      <CreateNewsForm
        title={title}
        setTitle={setTitle}
        selectedTags={stringTags}
        setSelectedTags={setSelectedTags}
        image={image}
        imagePreview={imagePreview}
        tempImage={tempImage}
        tempImagePreview={tempImagePreview}
        text={text}
        setText={setText}
        source={source}
        setSource={setSource}
        errors={errors}
        imageErrors={imageErrors}
        touchedFields={touchedFields}
        setTouchedFields={setTouchedFields}
        isFormValid={isFormValid}
        validateField={validateFieldAndUpdateErrors}
        validateForm={validateForm}
        handleSubmit={handleSubmit}
        handlePreview={handlePreview}
        handleCancel={handleCancel}
        handleImageUpload={handleImageUpload}
        handleImageSubmit={handleImageSubmit}
        handleImageCancel={handleImageCancel}
        handleRemoveImage={handleRemoveImage}
        authorName={authorName}
        formattedDate={formattedDate}
        tagsList={tagsListEcoNewsData}
        t={t}
      />
    </div>
  );
};


export default CreateNews;
