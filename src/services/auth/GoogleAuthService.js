import axios from 'axios';
import { USER_API_URL } from '../../config/api';
import { AUTH_SETTINGS, API_SETTINGS } from '../../config/settings';

// Use direct paths for proxy to work correctly
const SERVER_ADDRESS = API_SETTINGS.serverAddress;
// Ensure we're using the proxy paths that are configured in setupProxy.js
// Use absolute URLs to ensure requests go directly to the backend server
const GOOGLE_SECURITY_LINK = 'http://localhost:8060/googleSecurity';
const GOOGLE_SECURITY_POST_LINK = 'http://localhost:8060/googleSecurity';
const GOOGLE_SECURITY_HEADER_LINK = 'http://localhost:8060/googleSecurityHeader';

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
      console.log('GoogleAuthService.signIn: Starting authentication with POST method');
      console.log('Using endpoint:', GOOGLE_SECURITY_POST_LINK);
      console.log('Token length:', token ? token.length : 0);
      console.log('Language:', language);
      // Create a custom axios instance for this request
      const axiosInstance = axios.create({
        // No baseURL needed as we're using absolute URLs
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Enable withCredentials to allow cookies to be sent
        withCredentials: true
      });

      // Use POST request with token in the body
      console.log('Sending POST request to:', GOOGLE_SECURITY_POST_LINK);
      const response = await axiosInstance.post(GOOGLE_SECURITY_POST_LINK, {
        idToken: token,
        lang: language
      });

      console.log('Received response with status:', response.status);
      console.log('Response headers:', JSON.stringify(response.headers, null, 2));

      // Ensure response data has the expected token properties
      const userData = { ...response.data };
      console.log('Response data keys:', Object.keys(userData));

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
        console.error('Server address:', SERVER_ADDRESS);
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
      console.log('GoogleAuthService.signInWithHeader: Starting authentication with header method');
      console.log('Using endpoint:', GOOGLE_SECURITY_HEADER_LINK);
      console.log('Token length:', token ? token.length : 0);
      console.log('Language:', language);
      // Create a custom axios instance for this request
      const axiosInstance = axios.create({
        // No baseURL needed as we're using absolute URLs
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Enable withCredentials to allow cookies to be sent
        withCredentials: true
      });

      // Use POST request with token in the Authorization header and body
      console.log('Sending POST request to:', GOOGLE_SECURITY_HEADER_LINK);
      const response = await axiosInstance.post(GOOGLE_SECURITY_HEADER_LINK, {
        idToken: token,
        lang: language
      });

      console.log('Received response with status:', response.status);
      console.log('Response headers:', JSON.stringify(response.headers, null, 2));

      // Ensure response data has the expected token properties
      const userData = { ...response.data };
      console.log('Response data keys:', Object.keys(userData));

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
        console.error('Server address:', SERVER_ADDRESS);
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
      console.log('GoogleAuthService.signInWithGet: Starting authentication with GET method');
      console.log('Using endpoint:', GOOGLE_SECURITY_LINK);
      console.log('Token length:', idToken ? idToken.length : 0);
      console.log('Token preview:', idToken ? `${idToken.substring(0, 10)}...` : 'null');
      console.log('Language:', language);

      // Create a custom axios instance for this request
      const axiosInstance = axios.create({
        // No baseURL needed as we're using absolute URLs
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        // Enable withCredentials to allow cookies to be sent
        withCredentials: true
      });

      // Use GET request with idToken as URL parameter
      console.log('Sending GET request to:', GOOGLE_SECURITY_LINK);
      console.log('With params:', { idToken: idToken ? `${idToken.substring(0, 10)}...` : 'null', lang: language });

      const response = await axiosInstance.get(GOOGLE_SECURITY_LINK, {
        params: {
          idToken: idToken,
          lang: language
        }
      });

      console.log('Received response with status:', response.status);
      console.log('Response headers:', JSON.stringify(response.headers, null, 2));

      // Ensure response data has the expected token properties
      const userData = { ...response.data };
      console.log('Response data keys:', Object.keys(userData));

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
        console.error('Server address:', SERVER_ADDRESS);
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
