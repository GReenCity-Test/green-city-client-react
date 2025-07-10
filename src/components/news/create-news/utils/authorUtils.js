/**
 * Utility functions for handling author information
 */

/**
 * Extract author name from currentUser object
 * @param {Object} currentUser - The current user object from auth context
 * @returns {string|null} - Author name or null if not available
 */
export const getAuthorName = (currentUser) => {
  if (!currentUser) return null;

  // Check for firstName and lastName properties
  if (currentUser.firstName && currentUser.lastName) {
    return `${currentUser.firstName} ${currentUser.lastName}`;
  }

  // Check for name property
  if (currentUser.name) {
    return currentUser.name;
  }

  // Check if user info is nested in a user property
  if (currentUser.user) {
    const user = currentUser.user;
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.name) {
      return user.name;
    }
  }

  // Check for username or email as fallback
  if (currentUser.username) {
    return currentUser.username;
  }

  if (currentUser.email) {
    return currentUser.email.split('@')[0]; // Use part before @ as name
  }

  return null;
};

/**
 * Split author name into first and last name
 * @param {string} authorName - Full author name
 * @returns {Object} - Object with firstName and lastName properties
 */
export const splitAuthorName = (authorName) => {
  let firstName = authorName;
  let lastName = '';

  if (authorName.includes(' ')) {
    const nameParts = authorName.split(' ');
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(' ');
  }

  return { firstName, lastName };
};