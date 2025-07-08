import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import { AUTH_IMAGES } from '../../constants/imagePaths';
import './AuthModal.scss';

// Image paths using centralized constants
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
 * @returns {JSX.Element} - Rendered component
 */
const AuthModal = ({ initialPage = 'sign-in', isUbs = false, onClose }) => {
  const [authPage, setAuthPage] = useState(initialPage);
  const location = useLocation();

  // Determine if this is for UBS based on URL if not explicitly provided
  const isUbsPage = isUbs || location.pathname.includes('ubs');

  // Select the appropriate images
  const images = isUbsPage ? ubsAuthImages : authImages;

  // Announce for accessibility (would use a proper accessibility library in a real app)
  useEffect(() => {
    // This is a simplified version of the announce function in Angular
    document.title = 'Login - Green City';
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    setAuthPage(page);
  };

  // Render the appropriate component based on authPage
  const renderAuthComponent = () => {
    switch (authPage) {
      case 'sign-in':
        return <SignIn onPageChange={handlePageChange} isUbs={isUbsPage} onClose={onClose} />;
      case 'sign-up':
        return <SignUp onPageChange={handlePageChange} isUbs={isUbsPage} />;
      case 'restore-password':
        return <ForgotPassword onPageChange={handlePageChange} isUbs={isUbsPage} />;
      default:
        return <SignIn onPageChange={handlePageChange} isUbs={isUbsPage} />;
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal__overlay" onClick={onClose}></div>
      <div className="auth-modal__content">
        <div className="auth-modal__wrapper">
          <div className="auth-modal__left-side">
            <img
              className="auth-modal__main-picture"
              src={images.mainImage}
              alt="Authentication illustration"
              aria-hidden="true"
            />
          </div>
          <div className="auth-modal__right-side">
            <button
              className="auth-modal__close-button"
              onClick={onClose}
              aria-label="Close authentication form"
            >
              <img src={images.cross} alt="Close" />
            </button>
            <div className="auth-modal__form-container">
              {renderAuthComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
