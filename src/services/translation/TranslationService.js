import { useState, useEffect } from 'react';

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

    try {
      // In a real app, this would fetch from a server or load from a file
      // For now, we'll use a simple mock implementation
      const response = await fetch(`/assets/i18n/${lang}.json`);
      const translations = await response.json();
      this.translations[lang] = translations;
      return translations;
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      // Return empty object as fallback
      return {};
    }
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
