import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../services/translation/TranslationService';
import { AUTH_IMAGES } from '../../constants/imagePaths';
import GoogleButton from './GoogleButton';
import './Auth.scss';

const SignIn = ({ onPageChange, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Handle successful Google sign-in
  const handleGoogleSuccess = (userData) => {
    if (onClose) {
      onClose();
    }
    navigate('/');
  };

  // Handle Google sign-in error
  const handleGoogleError = (error) => {
    setGeneralError(error.message || t('auth.googleSignInError', 'Failed to sign in with Google. Please try again.'));
  };

  // This effect was previously used to check for success messages from registration
  // Now we're using a toast notification in the SignUp component instead

  // Validate form fields
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      await signIn(formData.email, formData.password);
      if (onClose) {
        onClose();
      }
      navigate('/');
    } catch (error) {
      setGeneralError(error.response?.data?.message || t('auth.signInError', 'Failed to sign in. Please check your credentials.'));
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t('auth.signIn', 'Sign In')}</h2>
        {generalError && <div className="error-message general-error">{generalError}</div>}

        {/* Google Sign-In Button */}
        <GoogleButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useGetAuth={true}
        />

        {/* Separator */}
        <div className="auth-separator">{t('auth.or', 'or')}</div>

        <form onSubmit={handleSubmit}>
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
                onClick={togglePasswordVisibility}
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
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={loading || formErrors.email || formErrors.password || !formData.email || !formData.password}
          >
            {loading ? t('auth.signingIn', 'Signing In...') : t('auth.signInButton', 'Sign In')}
          </button>
        </form>
        <div className="auth-links">
          <p>{t('auth.dontHaveAccount', 'Don\'t have an account?')} {onPageChange ? (
            <button className="text-button" onClick={() => onPageChange('sign-up')}>{t('auth.signUp', 'Sign Up')}</button>
          ) : (
            <Link to="/auth/sign-up">{t('auth.signUp', 'Sign Up')}</Link>
          )}</p>
          <p>{onPageChange ? (
            <button className="text-button" onClick={() => onPageChange('restore-password')}>{t('auth.forgotPassword', 'Forgot Password?')}</button>
          ) : (
            <Link to="/auth/forgot-password">{t('auth.forgotPassword', 'Forgot Password?')}</Link>
          )}</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
