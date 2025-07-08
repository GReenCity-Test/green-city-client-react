/**
 * This file contains all image paths used in the application.
 * Centralizing image paths makes it easier to maintain and update them.
 *
 * Note: Some images referenced here might not exist in the repository yet.
 * These are placeholder paths that will need to be updated when the actual images are added.
 */

/**
 * Base paths for different asset locations
 * Using process.env.PUBLIC_URL ensures paths work correctly in all environments
 *
 * Note: For images in the src directory, it's recommended to use the import statement
 * directly in components rather than using these URL paths.
 * Example: import heartIcon from '../assets/img/heart.svg';
 */
export const BASE_PATHS = {
  // For images in the public directory
  PUBLIC: `${process.env.PUBLIC_URL}/assets/img/`,

  // For images in the src directory - this is kept for backward compatibility
  // but it's recommended to use import statements for these images
  SRC: '/src/assets/img/'
};

/**
 * Home page image paths
 */
export const HOME_IMAGES = {
  GUY: `${BASE_PATHS.PUBLIC}guy.png`,
  PATH_2: `${BASE_PATHS.PUBLIC}path-2.svg`,
  PATH_4: `${BASE_PATHS.PUBLIC}path-4_3.png`,
  PATH_5: `${BASE_PATHS.PUBLIC}path-5.png`
};

/**
 * About page image paths
 */
export const ABOUT_IMAGES = {
  ILLUSTRATION_MAN: `${BASE_PATHS.PUBLIC}Illustrationman.png`,
  VISION: `${BASE_PATHS.PUBLIC}Vision.png`,
  ILLUSTRATION_STORE: `${BASE_PATHS.PUBLIC}illustration-store.png`,
  ILLUSTRATION_MONEY: `${BASE_PATHS.PUBLIC}illustration-money.png`,
  ILLUSTRATION_RECYCLE: `${BASE_PATHS.PUBLIC}illustration-recycle.png`,
  ILLUSTRATION_PEOPLE: `${BASE_PATHS.PUBLIC}illustration-people.png`
};

/**
 * Auth related image paths
 */
export const AUTH_IMAGES = {
  EYE_SHOW: `${BASE_PATHS.PUBLIC}auth/eye-show.svg`,
  EYE_HIDE: `${BASE_PATHS.PUBLIC}auth/eye-hide.svg`,
  GOOGLE: `${BASE_PATHS.PUBLIC}auth/google.svg`,
  CROSS: `${BASE_PATHS.PUBLIC}auth/cross.svg`,
  MAIN_IMAGE: `${BASE_PATHS.PUBLIC}auth/auth-main-image.png`,
  UBS_MAIN_IMAGE: `${BASE_PATHS.PUBLIC}auth/ubs-auth-main-image.png`
};

/**
 * Profile related image paths
 */
export const PROFILE_IMAGES = {
  DEFAULT_AVATAR: `${BASE_PATHS.PUBLIC}default-avatar.png`,
  WAVE_SHAPE: `${BASE_PATHS.PUBLIC}wave_shape.png`
};

/**
 * Common image paths used across the application
 */
export const COMMON_IMAGES = {
  LOGO: `${BASE_PATHS.PUBLIC}logo.svg`,
  QR_CODE: `${BASE_PATHS.PUBLIC}qr-code.png`
};

/**
 * Helper function to get image path by category and key
 * @param {string} category - The category of the image (e.g., HOME_IMAGES, ABOUT_IMAGES)
 * @param {string} key - The key of the image within the category
 * @returns {string} The full path to the image
 */
export const getImagePath = (category, key) => {
  return category[key];
};

/**
 * Helper function to import an image from the src directory
 * This is the recommended way to use images from the src directory
 *
 * Usage example:
 * import { importSrcImage } from '../constants/imagePaths';
 * const HeartIcon = importSrcImage('heart.svg');
 *
 * @param {string} filename - The filename of the image in src/assets/img
 * @returns {string} The import statement for the image
 */
export const importSrcImage = (filename) => {
  try {
    // Dynamic import is used here, which might not work in all environments
    // For production code, it's better to use static imports at the top of your file
    return require(`../assets/img/${filename}`).default;
  } catch (error) {
    console.error(`Failed to import image: ${filename}`, error);
    return '';
  }
};
