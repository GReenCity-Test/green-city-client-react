import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EcoEvents from './eco-events/EcoEvents';
import Subscribe from './subscribe/Subscribe';
import StatRows from './stat-rows/StatRows';
import UserService from '../../services/user/UserService';
import { useTokenCheck } from '../../services/auth/TokenService';
import { useTranslation } from '../../services/translation/TranslationService';
import AuthModal from '../../components/auth/AuthModal';
import { HOME_IMAGES } from '../../constants/imagePaths';
import './HomePage.scss';

const HomePage = () => {
  const [usersAmount, setUsersAmount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Token check function
  const checkToken = useTokenCheck(() => {
    // On successful token verification, show auth modal
    setShowAuthModal(true);
  });

  useEffect(() => {
    // Get user ID from local storage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }

    // Fetch activated users count
    const fetchUsersAmount = async () => {
      try {
        const count = await UserService.countActivatedUsers();
        setUsersAmount(count);
      } catch (error) {
        console.error('Failed to fetch users amount:', error);
        setUsersAmount(0);
      }
    };

    fetchUsersAmount();
    checkToken();
  }, [checkToken]);

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

  return (
    <main id="main-content" role="main">
      <div id="header-anchor" className="homepage">
        <img id="path-2" src={HOME_IMAGES.PATH_2} alt="bg-texture-2" aria-hidden="true" />
        <img id="path-4" src={HOME_IMAGES.PATH_4} alt="bg-texture-4" aria-hidden="true" />
        <img id="path-5" src={HOME_IMAGES.PATH_5} alt="bg-texture-5" aria-hidden="true" />
        <header id="header">
          <div id="header-left">
            <div id="main-content">
              <h1>{t('homepage.header.caption')}</h1>
              <p>{t('homepage.header.content')}</p>
              <button className="primary-global-button btn" onClick={startHabit}>
                {t('homepage.general.button-start-habit')}
              </button>
            </div>
          </div>
          <div id="header-right">
            <img src={HOME_IMAGES.GUY} id="guy-image" alt="guy-texture" aria-hidden="true" />
          </div>
        </header>
        <section id="stats">
          <h2 className="section-caption">
            {t('homepage.stats.caption-before')} {usersAmount} {t('homepage.stats.caption-after')}
          </h2>
          <StatRows />
        </section>
        <section id="events">
          <h2 className="section-caption">{t('homepage.eco-news.title')}</h2>
          <EcoEvents />
        </section>
        <section id="subscription">
          <Subscribe />
        </section>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          initialPage="sign-in"
          onClose={handleCloseAuthModal}
        />
      )}
    </main>
  );
};

export default HomePage;
