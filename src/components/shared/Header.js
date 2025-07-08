import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../services/translation/TranslationService';
import LanguageSwitcher from './LanguageSwitcher';
import Notifications from './Notifications';
import AuthModal from '../auth/AuthModal';
import Search from './Search';
import { COMMON_IMAGES } from '../../constants/imagePaths';
import './Header.scss';

const Header = () => {
  const { currentUser, signOut, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalPage, setAuthModalPage] = useState('sign-in');
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const openAuthModal = (page) => {
    setAuthModalPage(page);
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={COMMON_IMAGES.LOGO} alt="Green City Logo" />
          </Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">{t('nav.home')}</Link></li>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><Link to="/news">{t('nav.news')}</Link></li>
            <li><Link to="/map">{t('nav.map')}</Link></li>
            <li><Link to="/events">{t('nav.events')}</Link></li>
            <li>
              <Link to={isAuthenticated() && currentUser?.id ? `/profile/${currentUser.id}` : "/auth/sign-in"}>
                {t('nav.mySpace')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <LanguageSwitcher />
          <Notifications />
          <Search />
          {isAuthenticated() ? (
            <div className="user-profile">
              <button className="profile-btn" onClick={toggleDropdown}>
                <div className="profile-photo">
                  {currentUser?.profilePicturePath ? (
                    <img src={currentUser.profilePicturePath} alt="Profile" className="profile-image" />
                  ) : (
                    <div className="default-avatar">
                      {currentUser?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <span className="profile-name">{currentUser?.name || t('nav.profile', 'Profile')}</span>
              </button>
              {showDropdown && (
                <div className="profile-dropdown">
                  <Link to={`/profile/${currentUser?.id}`} onClick={() => setShowDropdown(false)}>{t('nav.mySpace')}</Link>
                  <Link to="/ubs-user/orders" onClick={() => setShowDropdown(false)}>{t('nav.myCabinet')}</Link>
                  <button onClick={handleSignOut}>{t('nav.signOut')}</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="sign-in-btn" onClick={() => openAuthModal('sign-in')}>{t('auth.signIn')}</button>
              <button className="sign-up-btn" onClick={() => openAuthModal('sign-up')}>{t('auth.signUp')}</button>
            </>
          )}

          {/* Auth Modal */}
          {showAuthModal && (
            <AuthModal
              initialPage={authModalPage}
              onClose={handleCloseAuthModal}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
