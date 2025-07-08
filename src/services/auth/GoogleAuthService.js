import axios from 'axios';
import { USER_API_URL } from '../../config/api';
import { AUTH_SETTINGS } from '../../config/settings';

// Base API URL from central configuration
const API_BASE_URL = '';
const GOOGLE_SECURITY_LINK = `/googleSecurity`;
const GOOGLE_SECURITY_POST_LINK = `/googleSecurity`;
const GOOGLE_SECURITY_HEADER_LINK = `/googleSecurityHeader`;

/**
 * Service for Google authentication
 */
class GoogleAuthService {
  /**
   * Sign in with Google using POST request with token in body
   * @param {string} token - Google ID token
   * @param {string} language - User language preference
   * @returns {Promise} - Promise that resolves to user data
   */
  static async signIn(token, language = 'en') {
    try {
      // Use POST request with token in the body
      const response = await axios.post(GOOGLE_SECURITY_POST_LINK, {
        token: token,
        lang: language
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });

      // Ensure response data has the expected token properties
      const userData = { ...response.data };

      // Check if refreshToken is missing but there's an alternative property
      if (!userData.refreshToken) {
        // Check for common alternative property names
        if (userData.refresh_token) {
          userData.refreshToken = userData.refresh_token;
        } else if (userData.refreshtoken) {
          userData.refreshToken = userData.refreshtoken;
        } else if (userData.refresh) {
          userData.refreshToken = userData.refresh;
        } else {
          console.warn('No refresh token found in Google authentication response');
        }
      }

      return userData;
    } catch (error) {
      // Provide more detailed error logging for CORS and network issues
      if (error.message && error.message.includes('Network Error')) {
        console.error('Network error during Google sign-in with POST. This might be a CORS issue:', error);
        console.error('Server address:', API_BASE_URL);
        console.error('Google security link:', GOOGLE_SECURITY_POST_LINK);

        // Create a more user-friendly error
        const corsError = new Error('Failed to connect to the authentication server. This might be due to a CORS configuration issue.');
        corsError.originalError = error;
        throw corsError;
      } else {
        console.error('Error signing in with Google using POST:', error);
        throw error;
      }
    }
  }

  /**
   * Sign in with Google using Authorization header
   * @param {string} token - Google ID token
   * @param {string} language - User language preference
   * @returns {Promise} - Promise that resolves to user data
   */
  static async signInWithHeader(token, language = 'en') {
    try {
      // Use POST request with token in the Authorization header
      const response = await axios.post(GOOGLE_SECURITY_HEADER_LINK, {
        lang: language
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: false
      });

      // Ensure response data has the expected token properties
      const userData = { ...response.data };

      // Check if refreshToken is missing but there's an alternative property
      if (!userData.refreshToken) {
        // Check for common alternative property names
        if (userData.refresh_token) {
          userData.refreshToken = userData.refresh_token;
        } else if (userData.refreshtoken) {
          userData.refreshToken = userData.refreshtoken;
        } else if (userData.refresh) {
          userData.refreshToken = userData.refresh;
        } else {
          console.warn('No refresh token found in Google authentication response');
        }
      }

      return userData;
    } catch (error) {
      // Provide more detailed error logging for CORS and network issues
      if (error.message && error.message.includes('Network Error')) {
        console.error('Network error during Google sign-in with header. This might be a CORS issue:', error);
        console.error('Server address:', API_BASE_URL);
        console.error('Google security header link:', GOOGLE_SECURITY_HEADER_LINK);

        // Create a more user-friendly error
        const corsError = new Error('Failed to connect to the authentication server. This might be due to a CORS configuration issue.');
        corsError.originalError = error;
        throw corsError;
      } else {
        console.error('Error signing in with Google using header:', error);
        throw error;
      }
    }
  }

  /**
   * Sign in with Google using GET request with idToken as URL parameter
   * @param {string} idToken - Google ID token
   * @param {string} language - User language preference
   * @returns {Promise} - Promise that resolves to user data
   */
  static async signInWithGet(idToken, language = 'en') {
    try {
      console.log('Sending Google sign-in request with GET method');
      console.log('idToken:', idToken ? `${idToken.substring(0, 10)}...` : 'null');
      console.log('language:', language);

      // Use GET request with idToken as URL parameter
      const response = await axios.get(GOOGLE_SECURITY_LINK, {
        params: {
          idToken: idToken,
          lang: language
        },
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        withCredentials: false
      });

      // Ensure response data has the expected token properties
      const userData = { ...response.data };

      // Check if refreshToken is missing but there's an alternative property
      if (!userData.refreshToken) {
        // Check for common alternative property names
        if (userData.refresh_token) {
          userData.refreshToken = userData.refresh_token;
        } else if (userData.refreshtoken) {
          userData.refreshToken = userData.refreshtoken;
        } else if (userData.refresh) {
          userData.refreshToken = userData.refresh;
        } else {
          console.warn('No refresh token found in Google authentication response');
        }
      }

      return userData;
    } catch (error) {
      // Provide more detailed error logging for CORS and network issues
      if (error.message && error.message.includes('Network Error')) {
        console.error('Network error during Google sign-in with GET. This might be a CORS issue:', error);
        console.error('Server address:', API_BASE_URL);
        console.error('Google security link:', GOOGLE_SECURITY_LINK);

        // Create a more user-friendly error
        const corsError = new Error('Failed to connect to the authentication server. This might be due to a CORS configuration issue.');
        corsError.originalError = error;
        throw corsError;
      } else {
        console.error('Error signing in with Google using GET:', error);
        throw error;
      }
    }
  }

  /**
   * Get Google client ID
   * @param {boolean} isManager - Whether the user is a manager
   * @returns {string} - Google client ID
   */
  static getClientId(isManager = false) {
    return isManager
      ? AUTH_SETTINGS.googleClientIdManager
      : AUTH_SETTINGS.googleClientId;
  }
}

export default GoogleAuthService;
