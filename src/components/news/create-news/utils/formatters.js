/**
 * Utility functions for formatting data in the CreateNews component
 */

/**
 * Format date to show month as text, day, year
 * @param {Date} date - The date to format
 * @param {string} language - The language code ('ua' or other)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, language) => {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString(language === 'ua' ? 'uk-UA' : 'en-US', options);
};