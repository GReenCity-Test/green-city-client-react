import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../../auth/AuthModal';
import { useTranslation } from '../../../services/translation/TranslationService';
import './StatRow.scss';

const StatRow = ({ stat, index }) => {
  const navigate = useNavigate();
  const locationImage = 'assets/img/icon/location-icon.png';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t } = useTranslation();

  // Mock user ID for now - would come from authentication context in a real app
  const userId = localStorage.getItem('userId');

  const startHabit = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      // Show auth modal
      setShowAuthModal(true);
    }
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  // Determine if image should be on left or right based on index
  const isOdd = index % 2 === 1;

  return (
    <div className="stat-row">
      {isOdd ? (
        // Image on left for odd indexes
        <>
          <div className="stat-row-image">
            <div className="image-wrapper" style={{ marginLeft: isOdd ? 0 : 'auto' }}>
              <img src={stat.iconPath} alt="stat-icon" aria-hidden="true" />
            </div>
          </div>
          <div className="stat-row-content">
            <div className="content-wrapper" style={{ marginRight: isOdd ? 0 : 'auto' }}>
              <h3>
                {stat.action} <span>{stat.count}</span> {stat.caption}
              </h3>
              <p>{stat.question}</p>
              <button className="primary-global-button btn" onClick={startHabit}>
                {t('homepage.general.button-start-habit')}
              </button>
              <div className="location-row">
                <img src={locationImage} alt="location-image" aria-hidden="true" />
                <a className="tertiary-global-button btn-link" href="/places">
                  {stat.locationText}
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Image on right for even indexes
        <>
          <div className="stat-row-content">
            <div className="content-wrapper" style={{ marginLeft: !isOdd ? 0 : 'auto' }}>
              <h3>
                {stat.action} <span>{stat.count}</span> {stat.caption}
              </h3>
              <p>{stat.question}</p>
              <button className="primary-global-button btn" onClick={startHabit}>
                {t('homepage.general.button-start-habit')}
              </button>
              <div className="location-row">
                <img src={locationImage} alt="location-image" aria-hidden="true" />
                <a className="tertiary-global-button btn-link" href="/places">
                  {stat.locationText}
                </a>
              </div>
            </div>
          </div>
          <div className="stat-row-image">
            <div className="image-wrapper" style={{ marginRight: !isOdd ? 0 : 'auto' }}>
              <img src={stat.iconPath} alt="stat-icon" aria-hidden="true" />
            </div>
          </div>
        </>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          initialPage="sign-in"
          onClose={handleCloseAuthModal}
        />
      )}
    </div>
  );
};

export default StatRow;
