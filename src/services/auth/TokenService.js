import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { USER_API_URL } from '../../config/api';

// Base API URL using proxy configuration
const API_BASE_URL = '/user';
const AUTH_LINK = `${API_BASE_URL}/ownSecurity`;

/**
 * Service for token-related operations
 */
class TokenService {
  /**
   * Verify email token
   *
   * @param {string} token - Verification token
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Promise that resolves to true if token is valid
   */
  static async verifyEmailToken(token, userId) {
    try {
      const response = await axios.get(`${AUTH_LINK}/verifyEmail?token=${token}&user_id=${userId}`);
      return response.status === 200;
    } catch (error) {
      console.error('Error verifying email token:', error);
      return false;
    }
  }

  /**
   * Get Google security information
   *
   * @param {string} idToken - Google ID token
   * @param {string} language - User language preference
   * @returns {Promise<Object>} Promise that resolves to Google security information
   */
  static async getGoogleSecurity(idToken, language = 'en') {
    try {
      console.log('Getting Google security information');
      console.log('idToken:', idToken ? `${idToken.substring(0, 10)}...` : 'null');
      console.log('language:', language);

      const response = await axios.get(`/googleSecurity`, {
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
      return response.data;
    } catch (error) {
      console.error('Error getting Google security information:', error);
      throw error;
    }
  }
}

/**
 * Custom hook to check for token in URL query parameters
 *
 * @param {Function} onSuccess - Callback function to execute on successful token verification
 * @returns {Function} Function to check token
 */
export const useTokenCheck = (onSuccess) => {
  const location = useLocation();
  const navigate = useNavigate();

  return async () => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('user_id');

    if (token && userId) {
      const isValid = await TokenService.verifyEmailToken(token, userId);
      if (isValid) {
        // Remove query parameters from URL
        navigate(location.pathname, { replace: true });

        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }

        return true;
      }
    }

    return false;
  };
};

export default TokenService;
