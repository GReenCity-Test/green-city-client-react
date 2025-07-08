import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../../services/translation/TranslationService';
import './LanguageSwitcher.scss';

/**
 * LanguageSwitcher component for switching between available languages
 *
 * @returns {JSX.Element} - Rendered component
 */
const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Available languages with their display names
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'ua', name: 'UA' }
  ];

  // Current language object
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle language selection
  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event, langCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageSelect(langCode);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-switcher-toggle"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="Language switcher"
      >
        <span>{currentLang.name}</span>
        <span className={`arrow ${isOpen ? 'up' : 'down'}`}></span>
      </button>

      {isOpen && (
        <ul className="language-dropdown">
          {languages.map(lang => (
            <li key={lang.code}>
              <button
                className={`language-option ${lang.code === currentLanguage ? 'active' : ''}`}
                onClick={() => handleLanguageSelect(lang.code)}
                onKeyDown={(e) => handleKeyDown(e, lang.code)}
                aria-label={`Switch to ${lang.name}`}
              >
                {lang.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
