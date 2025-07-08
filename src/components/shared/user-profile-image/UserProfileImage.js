import React from 'react';
import PropTypes from 'prop-types';
import './UserProfileImage.scss';

/**
 * Component for displaying a user's profile image with optional online status indicator
 */
const UserProfileImage = ({ imgPath, firstName, className, additionalImgClass, isOnline }) => {
  /**
   * Get the first letter of the user's name for the default avatar
   * @returns {string} First letter of the user's name
   */
  const getFirstLetter = () => {
    return firstName ? firstName.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className={`user-profile-image ${className || ''}`}>
      {imgPath ? (
        <img
          src={imgPath}
          alt={firstName || 'User'}
          className={`profile-image ${additionalImgClass || ''}`}
        />
      ) : (
        <div className={`default-avatar ${additionalImgClass || ''}`}>
          {getFirstLetter()}
        </div>
      )}

      {isOnline !== undefined && (
        <div className={`online-status ${isOnline ? 'online' : 'offline'}`}></div>
      )}
    </div>
  );
};

UserProfileImage.propTypes = {
  imgPath: PropTypes.string,
  firstName: PropTypes.string,
  className: PropTypes.string,
  additionalImgClass: PropTypes.string,
  isOnline: PropTypes.bool
};

export default UserProfileImage;
