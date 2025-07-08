import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import UserService from '../../../services/user/UserService';
import './ProfileCards.scss';

/**
 * Component for displaying facts of the day on the profile page
 */
const ProfileCards = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [factOfTheDay, setFactOfTheDay] = useState('');
  const [habitFactOfTheDay, setHabitFactOfTheDay] = useState('');
  const [error, setError] = useState(null);

  // Constants for local storage keys
  const factKey = 'factOfTheDay';
  const habitFactKey = 'habitFactOfTheDay';
  const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    loadFactsFromLocalStorage();
    checkAndUpdateFacts();

    // Set up a timer to check for updates once per day
    const intervalId = setInterval(() => {
      checkAndUpdateFacts();
    }, ONE_DAY_IN_MILLIS);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [i18n.language]);

  /**
   * Load facts from local storage
   */
  const loadFactsFromLocalStorage = () => {
    setFactOfTheDay(getFactContentByLanguage(factKey));
    setHabitFactOfTheDay(getFactContentByLanguage(habitFactKey));
  };

  /**
   * Get fact content by language from local storage
   * @param {string} factKey - Key for the fact in local storage
   * @returns {string} Fact content in the current language
   */
  const getFactContentByLanguage = (factKey) => {
    try {
      const factString = localStorage.getItem(factKey);
      if (!factString) return '';

      const fact = JSON.parse(factString);
      const translation = fact.factOfTheDayTranslations.find(
        (t) => t.languageCode === i18n.language
      );
      return translation?.content || '';
    } catch (error) {
      console.error(`Error getting fact from local storage with key ${factKey}:`, error);
      return '';
    }
  };

  /**
   * Check if facts need to be updated and update them if necessary
   */
  const checkAndUpdateFacts = async () => {
    try {
      if (!currentUser) return;

      const profileStats = await UserService.getProfileStatistics(currentUser.id);
      const lastFetchTime = localStorage.getItem('lastFetchTime');
      const currentTime = Date.now();

      if (isMoreThanOneDayPassed(lastFetchTime, currentTime)) {
        clearFacts();
        updateFacts(currentTime, profileStats?.amountHabitsInProgress > 0);
      }

      if (profileStats?.amountHabitsInProgress > 0) {
        if (!habitFactOfTheDay) {
          fetchAndSaveFactOfTheDay(currentTime, habitFactKey, '/by-tags');
        }
      } else {
        clearFacts(true);
      }
    } catch (error) {
      console.error('Error checking and updating facts:', error);
      setError('Failed to load facts. Please try again later.');
    }
  };

  /**
   * Fetch and save a fact of the day
   * @param {number} currentTime - Current time in milliseconds
   * @param {string} key - Key for storing the fact in local storage
   * @param {string} url - Additional URL path for the API call
   */
  const fetchAndSaveFactOfTheDay = async (currentTime, key, url) => {
    try {
      const fact = await UserService.getRandomFactOfTheDay(url);
      if (fact) {
        saveFactToLocalStorage(fact, currentTime, key);
        updateFactContent(key);
      }
    } catch (error) {
      console.error(`Error fetching fact of the day with key ${key}:`, error);
    }
  };

  /**
   * Save a fact to local storage
   * @param {Object} fact - Fact of the day
   * @param {number} currentTime - Current time in milliseconds
   * @param {string} key - Key for storing the fact in local storage
   */
  const saveFactToLocalStorage = (fact, currentTime, key) => {
    try {
      localStorage.setItem(key, JSON.stringify(fact));
      localStorage.setItem('lastFetchTime', currentTime.toString());
    } catch (error) {
      console.error(`Error saving fact to local storage with key ${key}:`, error);
    }
  };

  /**
   * Update fact content from local storage
   * @param {string} key - Key for the fact in local storage
   */
  const updateFactContent = (key) => {
    const factContent = getFactContentByLanguage(key);
    if (key === factKey) {
      setFactOfTheDay(factContent);
    } else if (key === habitFactKey) {
      setHabitFactOfTheDay(factContent);
    }
  };

  /**
   * Update facts
   * @param {number} currentTime - Current time in milliseconds
   * @param {boolean} hasHabits - Whether the user has habits in progress
   */
  const updateFacts = (currentTime, hasHabits) => {
    fetchAndSaveFactOfTheDay(currentTime, factKey, '');

    if (hasHabits) {
      fetchAndSaveFactOfTheDay(currentTime, habitFactKey, '/by-tags');
    }
  };

  /**
   * Check if more than one day has passed since the last fetch
   * @param {string} lastFetchTime - Last fetch time in milliseconds
   * @param {number} currentTime - Current time in milliseconds
   * @returns {boolean} Whether more than one day has passed
   */
  const isMoreThanOneDayPassed = (lastFetchTime, currentTime) => {
    return !lastFetchTime || currentTime - Number(lastFetchTime) > ONE_DAY_IN_MILLIS;
  };

  /**
   * Clear facts from local storage
   * @param {boolean} isHabit - Whether to clear only habit facts
   */
  const clearFacts = (isHabit = false) => {
    setHabitFactOfTheDay('');
    localStorage.removeItem(habitFactKey);

    if (!isHabit) {
      setFactOfTheDay('');
      localStorage.removeItem(factKey);
    }
  };

  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div className="right-cards">
      {factOfTheDay && (
        <div className="card">
          <p className="cart-title">{t('profile.fact-of-the-day')}</p>
          <p className="card-description">{factOfTheDay}</p>
          <div className="shape-img">
            <img src="/assets/img/wave_shape.png" alt="wave-background" />
          </div>
        </div>
      )}

      {habitFactOfTheDay && (
        <div className="card habit-card">
          <p className="cart-title">{t('profile.fact-of-the-day')}</p>
          <p className="card-description">{habitFactOfTheDay}</p>
          <div className="shape-img">
            <img src="/assets/img/wave_shape.png" alt="wave-background" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCards;
