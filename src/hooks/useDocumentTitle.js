import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to update the document title based on the current route
 * @param {string} pageTitle - Optional specific page title to use
 */
const useDocumentTitle = (pageTitle) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    // Get the app name from translations
    const appName = t('app.name');
    
    // If a specific page title is provided, use it
    if (pageTitle) {
      document.title = `${pageTitle} | ${appName}`;
      return;
    }
    
    // Otherwise, determine the title based on the current route
    let title = '';
    const path = location.pathname;
    
    if (path === '/') {
      title = t('nav.home');
    } else if (path.startsWith('/news')) {
      title = t('nav.news');
    } else if (path.startsWith('/events')) {
      title = t('nav.events');
    } else if (path.startsWith('/map')) {
      title = t('nav.map');
    } else if (path.startsWith('/about')) {
      title = t('nav.about');
    } else if (path.startsWith('/profile')) {
      title = t('nav.profile');
    } else if (path.startsWith('/ubs-user')) {
      title = t('nav.myCabinet');
    } else if (path.startsWith('/auth/sign-in')) {
      title = t('auth.signIn');
    } else if (path.startsWith('/auth/sign-up')) {
      title = t('auth.signUp');
    } else if (path.startsWith('/auth/forgot-password')) {
      title = t('auth.forgotPassword');
    } else {
      title = appName; // Default to app name if no match
    }
    
    // Set the document title
    document.title = `${title} | ${appName}`;
  }, [location, t, i18n.language, pageTitle]);
};

export default useDocumentTitle;