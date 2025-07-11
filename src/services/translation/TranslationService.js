import { useState, useEffect } from 'react';
import { getPublicAssetPath } from '../../constants/imagePaths';

// Default language
const DEFAULT_LANGUAGE = 'en';

// Available languages
const AVAILABLE_LANGUAGES = ['en', 'ua'];

// Storage key for language preference
const LANGUAGE_STORAGE_KEY = 'language';

/**
 * Simple translation service for the application
 * In a real app, this would be more sophisticated and use a library like i18next
 */
class TranslationService {
  // In-memory cache of translations
  static translations = {
    en: {},
    ua: {}
  };

  /**
   * Load translations for a specific language
   *
   * @param {string} lang - Language code
   * @returns {Promise<Object>} - Promise that resolves to the translations
   */
  static async loadTranslations(lang) {
    // If translations are already loaded, return them
    if (Object.keys(this.translations[lang]).length > 0) {
      return this.translations[lang];
    }

    // Maximum number of retry attempts
    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
        console.log(`Attempting to load translations for ${lang} (attempt ${retryCount + 1}/${maxRetries})`);

        // Use the getPublicAssetPath helper to ensure correct path
        const assetPath = getPublicAssetPath(`i18n/${lang}.json`);
        console.log(`Fetching translations from: ${assetPath}`);

        const response = await fetch(assetPath, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
          // Removed credentials: 'same-origin' to ensure i18n files are fetched without authentication
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const translations = await response.json();
        console.log(`Successfully loaded translations for ${lang}`);

        // Cache the translations
        this.translations[lang] = translations;
        return translations;
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${retryCount + 1}/${maxRetries} failed to load translations for ${lang}:`, error);
        retryCount++;

        // Wait before retrying (exponential backoff)
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 500; // 1s, 2s, 4s
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error(`All attempts to load translations for ${lang} failed:`, lastError);

    // Try to load fallback translations from a hardcoded source
    try {
      console.log(`Attempting to load fallback translations for ${lang}`);

      // For English, we can provide some basic fallback translations
      if (lang === 'en') {
        const fallbackTranslations = {
          'app.name': 'Green City',
          'app.slogan': 'Make your habit eco friendly',
          'nav.home': 'Home',
          'nav.about': 'About',
          'nav.news': 'Eco News',
          'nav.map': 'Places',
          'nav.events': 'Events',
          'nav.mySpace': 'My Space',
          'nav.signIn': 'Sign In',
          'nav.signUp': 'Sign Up',
          'search.placeholder': 'Search...',
          'search.tabs.all': 'All',
          'search.tabs.news': 'News',
          'search.tabs.events': 'Events',
          'search.tabs.tips': 'Tips',
          'search.tabs.places': 'Places',
          'search.tabs.users': 'Users',
          'search.results.ecoNews': 'News',
          'search.results.events': 'Events',
          'search.results.tips': 'Tips',
          'search.results.places': 'Places',
          'search.results.users': 'Users',
          'search.searching': 'Searching...',
          'search.prompt': 'Enter at least 3 characters to search',
          'search.no-results': 'No results found',
          'events.title': 'Events',
          'events.tabs.all': 'All Events',
          'events.tabs.absence': 'Absence Events'
        };

        this.translations[lang] = fallbackTranslations;
        console.log('Using fallback translations for English');
        return fallbackTranslations;
      }

      // For Ukrainian, we can provide some basic fallback translations
      if (lang === 'ua') {
        const fallbackTranslations = {
          'app.name': 'Green City',
          'app.slogan': 'Зроби свою звичку екологічною',
          'nav.home': 'Головна',
          'nav.about': 'Про нас',
          'nav.news': 'Еко новини',
          'nav.map': 'Місця',
          'nav.events': 'Події',
          'nav.mySpace': 'Мій простір',
          'nav.signIn': 'Увійти',
          'nav.signUp': 'Зареєструватися',
          'search.placeholder': 'Пошук...',
          'search.tabs.all': 'Все',
          'search.tabs.news': 'Новини',
          'search.tabs.events': 'Події',
          'search.tabs.tips': 'Поради',
          'search.tabs.places': 'Місця',
          'search.tabs.users': 'Користувачі',
          'search.results.ecoNews': 'Новини',
          'search.results.events': 'Події',
          'search.results.tips': 'Поради',
          'search.results.places': 'Місця',
          'search.results.users': 'Користувачі',
          'search.searching': 'Пошук...',
          'search.prompt': 'Введіть щонайменше 3 символи для пошуку',
          'search.no-results': 'Результатів не знайдено',
          'events.title': 'Події',
          'events.tabs.all': 'Всі події',
          'events.tabs.absence': 'Події відсутності'
        };

        this.translations[lang] = fallbackTranslations;
        console.log('Using fallback translations for Ukrainian');
        return fallbackTranslations;
      }
    } catch (fallbackError) {
      console.error('Failed to load fallback translations:', fallbackError);
    }

    // If all else fails, return an empty object
    console.warn(`Returning empty translations object for ${lang}`);
    return {};
  }

  /**
   * Get the current language from local storage or use default
   *
   * @returns {string} - Current language code
   */
  static getCurrentLanguage() {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
  }

  /**
   * Set the current language
   *
   * @param {string} lang - Language code
   */
  static setCurrentLanguage(lang) {
    if (AVAILABLE_LANGUAGES.includes(lang)) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      // Dispatch an event so components can react to language change
      window.dispatchEvent(new Event('languageChange'));
    } else {
      console.error(`Language ${lang} is not supported`);
    }
  }

  /**
   * Get available languages
   *
   * @returns {string[]} - Array of available language codes
   */
  static getAvailableLanguages() {
    return AVAILABLE_LANGUAGES;
  }

  /**
   * Translate a key
   *
   * @param {string} key - Translation key
   * @param {Object} params - Parameters for interpolation
   * @param {string} lang - Language code (optional, uses current language if not provided)
   * @returns {string} - Translated text or key if translation not found
   */
  static translate(key, params = {}, lang = this.getCurrentLanguage()) {
    const translations = this.translations[lang] || {};
    let text = translations[key] || key;

    // Simple parameter interpolation
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      });
    }

    return text;
  }
}

/**
 * React hook for using translations in components
 *
 * @returns {Object} - Object with translation functions and current language
 */
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState(TranslationService.getCurrentLanguage());
  const [translations, setTranslations] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslations = await TranslationService.loadTranslations(currentLanguage);
      setTranslations(newTranslations);
      setIsLoaded(true);
    };

    loadTranslations();

    // Listen for language changes
    const handleLanguageChange = () => {
      setCurrentLanguage(TranslationService.getCurrentLanguage());
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, [currentLanguage]);

  // Translation function
  const t = (key, params = {}) => {
    if (!isLoaded) {
      return key; // Return key if translations aren't loaded yet
    }

    let text = translations[key] || key;

    // Simple parameter interpolation
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      });
    }

    return text;
  };

  // Change language function
  const changeLanguage = (lang) => {
    TranslationService.setCurrentLanguage(lang);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    isLoaded
  };
};

export default TranslationService;
