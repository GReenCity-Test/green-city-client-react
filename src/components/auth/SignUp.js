import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../services/translation/TranslationService';
import { AUTH_IMAGES } from '../../constants/imagePaths';
import GoogleButton from './GoogleButton';
import ToastNotification from '../shared/ToastNotification';
import './Auth.scss';

const SignUp = ({ onPageChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // This effect was previously used to check for success messages
  // Now we're using a toast notification directly in this component

  // Handle successful Google sign-in
  const handleGoogleSuccess = (userData) => {
    navigate('/');
  };

  // Handle Google sign-in error
  const handleGoogleError = (error) => {
    setGeneralError(error.message || t('auth.googleSignInError', 'Failed to sign in with Google. Please try again.'));
  };

  // Validate form fields
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value) {
          error = t('auth.nameRequired', 'Name is required');
        } else if (value.length < 2 || value.length > 30) {
          error = t('auth.nameLength', 'Name must be between 2 and 30 characters');
        }
        break;
      case 'email':
        if (!value) {
          error = t('auth.emailRequired', 'Email is required');
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = t('auth.emailInvalid', 'This is not a valid email');
        }
        break;
      case 'password':
        if (!value) {
          error = t('auth.passwordRequired', 'Password is required');
        } else if (value.length < 8) {
          error = t('auth.passwordMinLength', 'Password must be at least 8 characters long');
        } else if (value.length > 20) {
          error = t('auth.passwordMaxLength', 'Password must be less than 20 characters');
        } else if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/.test(value)) {
          error = t('auth.passwordInvalidSymbols', 'Password contains invalid symbols');
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = t('auth.confirmPasswordRequired', 'Please confirm your password');
        } else if (value !== formData.password) {
          error = t('auth.passwordsDoNotMatch', 'Passwords do not match');
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate field if it's been touched
    if (touched[name]) {
      setFormErrors({
        ...formErrors,
        [name]: validateField(name, value)
      });
    }

    // Special case for confirmPassword - validate it when password changes
    if (name === 'password' && touched.confirmPassword && formData.confirmPassword) {
      setFormErrors({
        ...formErrors,
        confirmPassword: formData.confirmPassword !== value ? 'Passwords do not match' : ''
      });
    }
  };

  // Handle field blur (mark as touched)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    setFormErrors({
      ...formErrors,
      [name]: validateField(name, value)
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const errors = Object.keys(formData).reduce((acc, key) => {
      acc[key] = validateField(key, formData[key]);
      return acc;
    }, {});
    setFormErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
      return;
    }

    try {
      setLoading(true);
      setGeneralError('');

      // Create user data object for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      await signUp(userData);
      setToastMessage(t('auth.registrationSuccess', 'Congratulations! You have successfully registered on the site. Please confirm your email address in the email box.'));
      setShowToast(true);

      // After showing the toast, navigate to sign-in page after a short delay
      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('auth.signUpError', 'Failed to sign up. Please try again.');
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get input class based on validation state
  const getInputClass = (fieldName) => {
    if (!touched[fieldName]) return '';
    return formErrors[fieldName] ? 'input-error' : 'input-success';
  };

  // Get label class based on validation state
  const getLabelClass = (fieldName) => {
    if (!touched[fieldName]) return '';
    return formErrors[fieldName] ? 'label-error' : '';
  };

  // Handle closing the toast notification
  const handleCloseToast = () => {
    setShowToast(false);
  };


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t('auth.signUp', 'Sign Up')}</h2>
        <p className="welcome-text">{t('auth.welcomeSignUp', 'Hello! Please enter your details to sign up.')}</p>
        {generalError && <div className="error-message general-error">{generalError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className={getLabelClass('name')}>{t('auth.name', 'Name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t('auth.namePlaceholder', 'Enter your name')}
              className={getInputClass('name')}
              aria-describedby="name-error"
            />
            {touched.name && formErrors.name && (
              <div className="field-error-message" id="name-error" role="alert">
                {formErrors.name}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email" className={getLabelClass('email')}>{t('auth.email', 'Email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t('auth.emailPlaceholder', 'example@email.com')}
              className={getInputClass('email')}
              aria-describedby="email-error"
            />
            {touched.email && formErrors.email && (
              <div className="field-error-message" id="email-error" role="alert">
                {formErrors.email}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password" className={getLabelClass('password')}>{t('auth.password', 'Password')}</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                className={getInputClass('password')}
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('password')}
                aria-label={showPassword ? t('auth.hidePassword', 'Hide password') : t('auth.showPassword', 'Show password')}
              >
                <img
                  src={showPassword ? AUTH_IMAGES.EYE_SHOW : AUTH_IMAGES.EYE_HIDE}
                  alt={showPassword ? t('auth.hidePassword', 'Hide password') : t('auth.showPassword', 'Show password')}
                />
              </button>
            </div>
            {touched.password && formErrors.password && (
              <div className="field-error-message" id="password-error" role="alert">
                {formErrors.password}
              </div>
            )}
            {touched.password && formData.password.length === 0 && (
              <p className="password-hint">{t('auth.passwordMinLength', 'Password must be at least 8 characters long')}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className={getLabelClass('confirmPassword')}>{t('auth.confirmPassword', 'Confirm Password')}</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm your password')}
                className={getInputClass('confirmPassword')}
                aria-describedby="confirm-password-error"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                aria-label={showConfirmPassword ? t('auth.hidePassword', 'Hide password') : t('auth.showPassword', 'Show password')}
              >
                <img
                  src={showConfirmPassword ? AUTH_IMAGES.EYE_SHOW : AUTH_IMAGES.EYE_HIDE}
                  alt={showConfirmPassword ? t('auth.hidePassword', 'Hide password') : t('auth.showPassword', 'Show password')}
                />
              </button>
            </div>
            {touched.confirmPassword && formErrors.confirmPassword && (
              <div className="field-error-message" id="confirm-password-error" role="alert">
                {formErrors.confirmPassword}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={loading || formErrors.name || formErrors.email || formErrors.password || formErrors.confirmPassword ||
                     !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
          >
            {loading ? t('auth.signingUp', 'Signing Up...') : t('auth.signUpButton', 'Sign Up')}
          </button>
        </form>

        {/* Separator */}
        <div className="auth-separator">{t('auth.or', 'or')}</div>

        {/* Google Sign-In Button */}
        <GoogleButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useGetAuth={true}
        />

        <div className="auth-links">
          <p>{t('auth.alreadyHaveAccount', 'Already have an account?')} {onPageChange ? (
            <button className="text-button" onClick={() => onPageChange('sign-in')}>{t('auth.signIn', 'Sign In')}</button>
          ) : (
            <Link to="/auth/sign-in">{t('auth.signIn', 'Sign In')}</Link>
          )}</p>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastNotification
        message={toastMessage}
        type="success"
        isOpen={showToast}
        onClose={handleCloseToast}
        duration={2500}
      />
    </div>
  );
};

SignUp.propTypes = {
  onPageChange: PropTypes.func
};

export default SignUp;
