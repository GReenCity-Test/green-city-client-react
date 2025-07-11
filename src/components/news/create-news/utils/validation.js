/**
 * Validation utilities for the CreateNews form
 */

import {MAX_IMAGE_SIZE, TEXT_CONSTRAINTS, VALID_IMAGE_TYPES} from "../constants";

/**
 * Validate image file
 * @param {File} file - The image file to validate
 * @returns {Array} - Array of error messages, empty if valid
 */
export const validateImageFile = (file) => {
  const errors = [];

  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    errors.push('Invalid image type');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    errors.push('Image size exceeds limit');
  }

  return errors;
};

/**
 * Validate a single field
 * @param {string} field - Field name to validate
 * @param {any} value - Field value to validate
 * @returns {boolean} - Whether the field is valid
 */
export const validateField = (field, value) => {
  let isValid = true;

  switch (field) {
    case 'title':
      isValid = value.trim() && value.length <= TEXT_CONSTRAINTS.TITLE_MAX_LENGTH;
      break;
    case 'tags':
      isValid = value.length > 0 && value.length <= TEXT_CONSTRAINTS.MAX_TAGS;
      break;
    case 'text':
      isValid = value.trim() && value.trim().length >= TEXT_CONSTRAINTS.TEXT_MIN_LENGTH && value.length <= TEXT_CONSTRAINTS.TEXT_MAX_LENGTH;
      break;
    default:
      break;
  }

  return isValid;
};

/**
 * Get an error message for a field
 * @param {string} field - Field name
 * @param {any} value - Field value
 * @returns {string|null} - Error message or null if valid
 */
export const getFieldError = (field, value) => {
  switch (field) {
    case 'title':
      if (!value.trim()) {
        return 'Title is required';
      } else if (value.length > TEXT_CONSTRAINTS.TITLE_MAX_LENGTH) {
        return 'Title must be less than 170 characters';
      }
      break;
    case 'tags':
      if (!value.length) {
        return 'At least one tag must be selected';
      }
      break;
    case 'text':
      if (!value.trim()) {
        return 'Main text is required';
      } else if (value.trim().length < TEXT_CONSTRAINTS.TEXT_MIN_LENGTH) {
        return 'Main text must be at least 20 characters';
      } else if (value.length > TEXT_CONSTRAINTS.TEXT_MAX_LENGTH) {
        return 'Main text must be less than 63,206 characters';
      }
      break;
    default:
      break;
  }

  return null;
};
