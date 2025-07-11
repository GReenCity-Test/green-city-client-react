import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../services/translation/TranslationService';
import { AUTH_IMAGES } from '../../constants/imagePaths';
import GoogleButton from './GoogleButton';
import ToastNotification from '../shared/ToastNotification';
import createSignUpSchema from '../../schemas/signUpSchema';
import { signUpPropTypes, signUpDefaultProps } from './SignUp.propTypes';
import './Auth.scss';

const SignUp = ({ onPageChange }) => {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Create form validation schema with localized messages
  const signUpSchema = createSignUpSchema(t);

  // Initialize react-hook-form
  const { 
    register, 
    handleSubmit: validateAndSubmit, 
    formState: { errors, isDirty, isValid },
    reset
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Handle successful Google sign-in
  const handleGoogleSuccess = (userData) => {
    navigate('/');
  };

  // Handle Google sign-in error
  const handleGoogleError = (error) => {
    setGeneralError(error.message || t('auth.googleSignInError', 'Failed to sign in with Google. Please try again.'));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setGeneralError('');

      // Create user data object for API
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password
      };

      await signUp(userData);
      setToastMessage(t('auth.registrationSuccess', 'Congratulations! You have successfully registered on the site. Please confirm your email address in the email box.'));
      setShowToast(true);
      reset();

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
    return errors[fieldName] ? 'input-error' : isDirty ? 'input-success' : '';
  };

  // Get label class based on validation state
  const getLabelClass = (fieldName) => {
    return errors[fieldName] ? 'label-error' : '';
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

        <form onSubmit={validateAndSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name" className={getLabelClass('name')}>{t('auth.name', 'Name')}</label>
            <input
              type="text"
              id="name"
              placeholder={t('auth.namePlaceholder', 'Enter your name')}
              className={getInputClass('name')}
              aria-describedby="name-error"
              {...register('name')}
            />
            {errors.name && (
              <div className="field-error-message" id="name-error" role="alert">
                {errors.name.message}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email" className={getLabelClass('email')}>{t('auth.email', 'Email')}</label>
            <input
              type="email"
              id="email"
              placeholder={t('auth.emailPlaceholder', 'example@email.com')}
              className={getInputClass('email')}
              aria-describedby="email-error"
              {...register('email')}
            />
            {errors.email && (
              <div className="field-error-message" id="email-error" role="alert">
                {errors.email.message}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password" className={getLabelClass('password')}>{t('auth.password', 'Password')}</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                className={getInputClass('password')}
                aria-describedby="password-error"
                {...register('password')}
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
            {errors.password && (
              <div className="field-error-message" id="password-error" role="alert">
                {errors.password.message}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className={getLabelClass('confirmPassword')}>{t('auth.confirmPassword', 'Confirm Password')}</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm your password')}
                className={getInputClass('confirmPassword')}
                aria-describedby="confirm-password-error"
                {...register('confirmPassword')}
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
            {errors.confirmPassword && (
              <div className="field-error-message" id="confirm-password-error" role="alert">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !isValid}
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
                    useGetAuth={false}
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

SignUp.propTypes = signUpPropTypes;
SignUp.defaultProps = signUpDefaultProps;

export default SignUp;
