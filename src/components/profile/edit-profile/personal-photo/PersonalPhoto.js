import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import UserService from '../../../../services/user/UserService';
import './PersonalPhoto.scss';

const PersonalPhoto = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser?.profilePicturePath) {
      setProfileImage(currentUser.profilePicturePath);
      setPreviewImage(currentUser.profilePicturePath);
    }
  }, [currentUser]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await UserService.uploadProfilePicture(currentUser.id, formData);
      setProfileImage(response.profilePicturePath);
      // Update the currentUser in AuthContext with the new profile picture path
      updateUserProfile({ profilePicturePath: response.profilePicturePath });
      setError(null);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Failed to upload profile picture. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async () => {
    if (!currentUser || !profileImage) return;

    try {
      setLoading(true);
      await UserService.removeProfilePicture(currentUser.id);
      setProfileImage(null);
      setPreviewImage(null);
      // Update the currentUser in AuthContext to remove the profile picture path
      updateUserProfile({ profilePicturePath: null });
      setError(null);
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setError('Failed to remove profile picture. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personal-photo">
      <div
        className={`photo-container ${loading ? 'loading' : ''}`}
        onClick={handleImageClick}
      >
        {previewImage ? (
          <img src={previewImage} alt="Profile" className="profile-image" />
        ) : (
          <div className="default-avatar">
            {currentUser?.name?.charAt(0) || '?'}
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <div className="hover-overlay">
          <span>Change photo</span>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/jpeg, image/png, image/gif"
        className="file-input"
      />

      {profileImage && (
        <button
          className="remove-photo-btn"
          onClick={removeImage}
          disabled={loading}
        >
          Remove photo
        </button>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PersonalPhoto;
