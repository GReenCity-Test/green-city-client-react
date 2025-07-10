import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import { AUTH_IMAGES } from '../../constants/imagePaths';
import './AuthModal.scss';
import PropTypes from 'prop-types';

const AUTH_PAGES = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  RESTORE_PASSWORD: 'restore-password'
};

const authImages = {
  mainImage: AUTH_IMAGES.MAIN_IMAGE,
  cross: AUTH_IMAGES.CROSS,
  hiddenEye: AUTH_IMAGES.EYE_HIDE,
  openEye: AUTH_IMAGES.EYE_SHOW,
  google: AUTH_IMAGES.GOOGLE
};

const ubsAuthImages = {
  mainImage: AUTH_IMAGES.UBS_MAIN_IMAGE,
  cross: AUTH_IMAGES.CROSS,
  hiddenEye: AUTH_IMAGES.EYE_HIDE,
  openEye: AUTH_IMAGES.EYE_SHOW,
  google: AUTH_IMAGES.GOOGLE
};

/**
 * Modal component for authentication (sign in, sign up, forgot password)
 *
 * @param {Object} props - Component props
 * @param {string} props.initialPage - Initial page to show ('sign-in', 'sign-up', 'restore-password')
 * @param {boolean} props.isUbs - Whether this is for UBS (Urban Basket Service)
 * @param {Function} props.onClose - Function to call when modal is closed
 * @returns {JSX.Element}
 */
const AuthModal = ({ initialPage = AUTH_PAGES.SIGN_IN, isUbs = false, onClose }) => {
  const location = useLocation();
  const [authPage, setAuthPage] = useState(initialPage);

  // Determine if this is for UBS based on URL if not explicitly provided
  const isUbsPage = useMemo(() => isUbs || location.pathname.includes('ubs'), [isUbs, location.pathname]);

  // Select the appropriate images
  const images = useMemo(() => (isUbsPage ? ubsAuthImages : authImages), [isUbsPage]);

  // Accessibility: update title
  useEffect(() => {
    document.title = 'Login - Green City';
  }, []);

  // Memoized handler to avoid creating new functions on every render
  const handlePageChange = useCallback((page) => {
    setAuthPage(page);
  }, []);

  // Render component based on authPage
  const AuthComponent = useMemo(() => {
    switch (authPage) {
      case AUTH_PAGES.SIGN_IN:
        return <SignIn onPageChange={handlePageChange} isUbs={isUbsPage} onClose={onClose} />;
      case AUTH_PAGES.SIGN_UP:
        return <SignUp onPageChange={handlePageChange} isUbs={isUbsPage} />;
      case AUTH_PAGES.RESTORE_PASSWORD:
        return <ForgotPassword onPageChange={handlePageChange} isUbs={isUbsPage} />;
      default:
        return <SignIn onPageChange={handlePageChange} isUbs={isUbsPage} onClose={onClose} />;
    }
  }, [authPage, handlePageChange, isUbsPage, onClose]);

  return (
      <div className="auth-modal">
        <button
            type="button"
            className="auth-modal__overlay"
            onClick={onClose}
            aria-label="Close authentication modal"
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
        />
        <div className="auth-modal__content">
          <div className="auth-modal__wrapper">
            <div className="auth-modal__left-side">
              <img
                  className="auth-modal__main-picture"
                  src={images.mainImage}
                  alt=""
                  aria-hidden="true"
              />
            </div>
            <div className="auth-modal__right-side">
              <button
                  type="button"
                  className="auth-modal__close-button"
                  onClick={onClose}
                  aria-label="Close authentication form"
              >
                <img src={images.cross} alt="Close" />
              </button>
              <div className="auth-modal__form-container">
                {AuthComponent}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
AuthModal.propTypes = {
  initialPage: PropTypes.oneOf(['sign-in', 'sign-up', 'restore-password']),
  isUbs: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

AuthModal.defaultProps = {
  initialPage: 'sign-in',
  isUbs: false
};
export default AuthModal;
