import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import UserService from '../../../services/user/UserService';
import PersonalPhoto from './personal-photo/PersonalPhoto';
import SocialNetworks from './social-networks/SocialNetworks';
import './EditProfile.scss';

const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    cityCoordinates: null,
    credo: '',
    socialNetworks: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: ''
    },
    privacySettings: {
      showLocation: 'PUBLIC',
      showEcoPlace: 'PUBLIC',
      showShoppingList: 'PUBLIC'
    },
    emailPreferences: {
      receiveNews: {
        enabled: false,
        periodicity: 'DAILY'
      },
      receiveUpdates: {
        enabled: false,
        periodicity: 'WEEKLY'
      },
      receiveReminders: {
        enabled: false,
        periodicity: 'MONTHLY'
      }
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formChanged, setFormChanged] = useState(false);

  // Validation
  const namePattern = /^[a-zA-Z0-9_.-]{1,30}$/;
  const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
  const [nameValid, setNameValid] = useState(true);
  const [credoValid, setCredoValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [socialNetworksValid, setSocialNetworksValid] = useState({
    facebook: true,
    instagram: true,
    linkedin: true,
    twitter: true
  });
  const [formErrors, setFormErrors] = useState({});

  // Options for dropdowns
  const privacyOptions = [
    { value: 'PUBLIC', translationKey: 'Public' },
    { value: 'FRIENDS', translationKey: 'Friends only' },
    { value: 'PRIVATE', translationKey: 'Private' }
  ];

  const periodicityOptions = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];

  const privacySettingsList = [
    { label: 'Show my location', formControlName: 'showLocation' },
    { label: 'Show eco places I added', formControlName: 'showEcoPlace' },
    { label: 'Show my shopping list', formControlName: 'showShoppingList' }
  ];

  const emailPreferencesList = [
    { controlName: 'receiveNews', periodicityControl: 'receiveNewsPeriodicity', translationKey: 'news' },
    { controlName: 'receiveUpdates', periodicityControl: 'receiveUpdatesPeriodicity', translationKey: 'updates' },
    { controlName: 'receiveReminders', periodicityControl: 'receiveRemindersPeriodicity', translationKey: 'reminders' }
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/sign-in');
      return;
    }

    loadUserProfile();
  }, [currentUser, navigate]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userId = currentUser.id;
      const profileData = await UserService.getUserProfile(userId);

      // Map the API response to our form structure
      setFormData({
        name: profileData.name || '',
        city: profileData.city || '',
        cityCoordinates: profileData.cityCoordinates || null,
        credo: profileData.credo || '',
        socialNetworks: {
          facebook: profileData.socialNetworks?.facebook || '',
          instagram: profileData.socialNetworks?.instagram || '',
          linkedin: profileData.socialNetworks?.linkedin || '',
          twitter: profileData.socialNetworks?.twitter || ''
        },
        privacySettings: {
          showLocation: profileData.privacySettings?.showLocation || 'PUBLIC',
          showEcoPlace: profileData.privacySettings?.showEcoPlace || 'PUBLIC',
          showShoppingList: profileData.privacySettings?.showShoppingList || 'PUBLIC'
        },
        emailPreferences: {
          receiveNews: {
            enabled: profileData.emailPreferences?.receiveNews?.enabled || false,
            periodicity: profileData.emailPreferences?.receiveNews?.periodicity || 'DAILY'
          },
          receiveUpdates: {
            enabled: profileData.emailPreferences?.receiveUpdates?.enabled || false,
            periodicity: profileData.emailPreferences?.receiveUpdates?.periodicity || 'WEEKLY'
          },
          receiveReminders: {
            enabled: profileData.emailPreferences?.receiveReminders?.enabled || false,
            periodicity: profileData.emailPreferences?.receiveReminders?.periodicity || 'MONTHLY'
          }
        }
      });

      setError(null);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setFormChanged(true);

    // Clear previous error for this field
    setFormErrors(prev => ({ ...prev, [name]: null }));

    // Validate name field
    if (name === 'name') {
      const isValid = namePattern.test(value);
      setNameValid(isValid);
      if (!isValid) {
        setFormErrors(prev => ({
          ...prev,
          name: 'Name should contain only letters, numbers, and symbols (._-) and be 1-30 characters long'
        }));
      }
    }

    // Validate credo field
    if (name === 'credo') {
      const isValid = value.length <= 170;
      setCredoValid(isValid);
      if (!isValid) {
        setFormErrors(prev => ({
          ...prev,
          credo: 'Title should be less than 170 characters'
        }));
      }
    }

    // Validate city field
    if (name === 'city') {
      const isValid = value.trim().length >= 2 && value.trim().length <= 50;
      setCityValid(isValid);
      if (!isValid) {
        setFormErrors(prev => ({
          ...prev,
          city: 'City name should be between 2 and 50 characters'
        }));
      }
    }
  };

  const handleSocialNetworkChange = (network, value) => {
    setFormData({
      ...formData,
      socialNetworks: {
        ...formData.socialNetworks,
        [network]: value
      }
    });
    setFormChanged(true);

    // Clear previous error for this network
    setFormErrors(prev => ({ ...prev, [network]: null }));

    // Only validate if there's a value (empty is valid)
    if (value.trim()) {
      const isValid = urlPattern.test(value);
      setSocialNetworksValid(prev => ({
        ...prev,
        [network]: isValid
      }));

      if (!isValid) {
        setFormErrors(prev => ({
          ...prev,
          [network]: `Please enter a valid ${network} URL`
        }));
      }
    } else {
      // Empty value is valid
      setSocialNetworksValid(prev => ({
        ...prev,
        [network]: true
      }));
    }
  };

  const handlePrivacySettingChange = (setting, value) => {
    setFormData({
      ...formData,
      privacySettings: {
        ...formData.privacySettings,
        [setting]: value
      }
    });
    setFormChanged(true);
  };

  const handleEmailPreferenceChange = (preference, field, value) => {
    setFormData({
      ...formData,
      emailPreferences: {
        ...formData.emailPreferences,
        [preference]: {
          ...formData.emailPreferences[preference],
          [field]: value
        }
      }
    });
    setFormChanged(true);
  };

  const handleCitySelected = (coordinates) => {
    setFormData({
      ...formData,
      cityCoordinates: coordinates
    });
    setFormChanged(true);
  };

  const checkChanges = () => {
    return formChanged;
  };

  const handleCancel = () => {
    if (checkChanges()) {
      // TODO: Implement confirmation dialog
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        navigate(`/profile/${currentUser.id}`);
      }
    } else {
      navigate(`/profile/${currentUser.id}`);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Validate name
    if (!nameValid) {
      isValid = false;
      errors.name = 'Name should contain only letters, numbers, and symbols (._-) and be 1-30 characters long';
    }

    // Validate credo
    if (!credoValid) {
      isValid = false;
      errors.credo = 'Title should be less than 170 characters';
    }

    // Validate city
    if (!cityValid) {
      isValid = false;
      errors.city = 'City name should be between 2 and 50 characters';
    }

    // Validate social networks
    Object.entries(socialNetworksValid).forEach(([network, isValid]) => {
      if (!isValid) {
        isValid = false;
        errors[network] = `Please enter a valid ${network} URL`;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-text');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setLoading(true);
      const userId = currentUser.id;

      // Prepare data for API
      const profileData = {
        name: formData.name,
        city: formData.city,
        cityCoordinates: formData.cityCoordinates,
        credo: formData.credo,
        socialNetworks: formData.socialNetworks,
        privacySettings: formData.privacySettings,
        emailPreferences: formData.emailPreferences
      };

      await UserService.updateUserProfile(userId, profileData);

      // Show success message
      alert('Profile updated successfully!');

      // Navigate back to profile
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="edit-profile-page">
        <div className="container">
          <div className="loading-spinner">
            <p>Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-0">
      <div className="edit-profile-container">
        <div className="edit-profile-wrap">
          <h2>Edit Profile</h2>

          <PersonalPhoto />

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="wrapper">
              <p>Personal Information</p>

              <div className="input-block">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className={!nameValid ? 'invalid' : ''}
                />
                {formErrors.name && <span className="error-text">{formErrors.name}</span>}
              </div>

              <div className="input-block">
                <label htmlFor="city">City</label>
                {/* TODO: Implement Google Places Autocomplete */}
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className={!cityValid ? 'invalid' : ''}
                />
                {formErrors.city && <span className="error-text">{formErrors.city}</span>}
              </div>

              <div className="input-block">
                <label htmlFor="credo">Title</label>
                <textarea
                  name="credo"
                  id="credo"
                  value={formData.credo}
                  onChange={handleInputChange}
                  placeholder="Enter your personal credo"
                  maxLength="171"
                  className={!credoValid ? 'invalid' : ''}
                ></textarea>
                {formErrors.credo && <span className="error-text">{formErrors.credo}</span>}
                <small className="char-count">{formData.credo.length}/170 characters</small>
              </div>
            </div>

            <div className="wrapper">
              <p>Social Networks</p>
              <SocialNetworks
                socialNetworks={formData.socialNetworks}
                onChange={handleSocialNetworkChange}
                errors={formErrors}
              />
            </div>

            <div className="privacy-wrapper">
              <p className="title">Privacy Settings</p>
              <ul>
                {privacySettingsList.map((setting, index) => (
                  <li key={index}>
                    <div className="text-wrapper">
                      {setting.label}
                    </div>
                    <div className="input-blocks">
                      <div className="input-wrapper">
                        <select
                          className="state-select"
                          value={formData.privacySettings[setting.formControlName]}
                          onChange={(e) => handlePrivacySettingChange(setting.formControlName, e.target.value)}
                        >
                          {privacyOptions.map((option, idx) => (
                            <option key={idx} value={option.value}>
                              {option.translationKey}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="email-preferences">
              <p className="title">Email Preferences</p>
              <ul>
                {emailPreferencesList.map((pref, index) => (
                  <li key={index}>
                    <div className="email-preference-item">
                      <label className="label-wrapper">
                        <input
                          type="checkbox"
                          checked={formData.emailPreferences[pref.controlName].enabled}
                          onChange={(e) => handleEmailPreferenceChange(pref.controlName, 'enabled', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Receive {pref.translationKey}
                      </label>
                      <div className="input-blocks">
                        <div className="input-wrapper">
                          <select
                            className="state-select"
                            value={formData.emailPreferences[pref.controlName].periodicity}
                            onChange={(e) => handleEmailPreferenceChange(pref.controlName, 'periodicity', e.target.value)}
                          >
                            {periodicityOptions.map((option, idx) => (
                              <option key={idx} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="buttons">
              <button className="secondary-global-button" type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="primary-global-button"
                type="submit"
                disabled={
                  !formChanged ||
                  !nameValid ||
                  !credoValid ||
                  !cityValid ||
                  Object.values(socialNetworksValid).some(valid => !valid)
                }
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
