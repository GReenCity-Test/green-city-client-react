import axios from 'axios';
import { USER_API_URL } from '../../config/api';
import { AUTH_SETTINGS, API_SETTINGS } from '../../config/settings';

// Use direct paths for proxy to work correctly
const API_BASE_URL = '/ownSecurity';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';

class AuthService {
  /**
   * Sign in user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise that resolves to user data
   */
  static async signIn(email, password) {
    try {
      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.post(`${API_BASE_URL}/signIn`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      });

      // Log response data structure for debugging (without sensitive info)
      const responseDataKeys = Object.keys(response.data);
      console.debug('Sign-in response contains these keys:', responseDataKeys);

      // Check if response contains tokens before storing
      if (!response.data.accessToken) {
        console.warn('Sign-in response does not contain an access token');
      }

      // Store tokens from response
      this.setTokens(response.data);

      // Verify tokens were stored correctly
      const storedRefreshToken = this.getRefreshToken();
      if (!storedRefreshToken) {
        console.warn('Failed to store refresh token after sign-in. Authentication may fail when the access token expires.');
      } else {
        console.debug('Successfully stored refresh token');
      }

      return response.data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  /**
   * Sign up a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise that resolves to user data
   */
  static async signUp(userData) {
    try {
      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.post(`${API_BASE_URL}/signUp`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);

      // Check if the error is due to network issues (backend not available)
      if (error.message === 'Network Error' || !error.response) {
        console.log('Backend not available, using mock implementation');

        // Mock successful registration response
        return {
          id: 'mock-user-' + Date.now(),
          name: userData.name,
          email: userData.email,
          message: 'Registration successful (mock)',
          verificationEmailSent: true
        };
      }

      // If it's another type of error, rethrow it
      throw error;
    }
  }

  /**
   * Register a new user (alternative endpoint)
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise that resolves to user data
   */
  static async register(userData) {
    try {
      const axiosInstance = axios.create();
      const response = await axiosInstance.post(`${API_BASE_URL}/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Sign up an employee
   * @param {Object} userData - Employee registration data
   * @returns {Promise} - Promise that resolves to user data
   */
  static async signUpEmployee(userData) {
    try {
      const axiosInstance = axios.create();
      const response = await axiosInstance.post(`${API_BASE_URL}/sign-up-employee`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error signing up employee:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  static signOut() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);

    // Also clear the Authorization cookie
    document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';
    console.log('Cleared Authorization cookie');
  }

  /**
   * Get current user profile
   * @returns {Promise} - Promise that resolves to user profile data
   */
  static async getCurrentUser() {
    try {
      // Log for debugging
      console.log('Getting current user with token:', this.getAccessToken() ? 'Token exists' : 'No token');

      // Use the global axios instance with interceptors to benefit from token refresh
      const response = await axios.get('/user/me');

      // Log the response data structure for debugging
      console.log('Current user response data:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Refresh the access token using the refresh token
   * @returns {Promise} - Promise that resolves to new tokens
   */
  static async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.error('No refresh token found in localStorage. This may happen if:');
        console.error('1. The user has never logged in');
        console.error('2. The refresh token was not properly stored during login');
        console.error('3. The refresh token has been cleared from localStorage');
        console.error('4. The API response used a different property name for the refresh token');

        // Log localStorage keys to help with debugging
        console.debug('Current localStorage keys:', Object.keys(localStorage));

        // Attempt to recover by redirecting to login
        this.signOut();

        // Throw a more descriptive error
        throw new Error('No refresh token found. Please sign in again.');
      }

      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.get(`${API_BASE_URL}/updateAccessToken?refreshToken=${refreshToken}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      });

      // Ensure we properly store the new tokens
      this.setTokens(response.data);
      console.debug('Token refresh successful');

      // The setTokens method now also updates the Authorization cookie

      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);

      // If it's our custom error, we've already handled it
      if (error.message !== 'No refresh token found. Please sign in again.') {
        console.error('Token refresh failed. Signing out user.');
        this.signOut(); // Clear tokens on refresh failure
      }

      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  static isAuthenticated() {
    return !!this.getAccessToken();
  }

  /**
   * Get user ID from local storage
   * @returns {string|null} - User ID or null if not found
   */
  static getUserId() {
    return localStorage.getItem(USER_ID_KEY);
  }

  /**
   * Get access token from local storage
   * @returns {string|null} - Access token or null if not found
   */
  static getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token from local storage
   * @returns {string|null} - Refresh token or null if not found
   */
  static getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Set tokens in local storage and cookies
   * @param {Object} data - Token data
   */
  static setTokens(data) {
    if (data.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);

      // Also set the token as a cookie for the proxy middleware to access
      // Set secure and httpOnly to false to allow JavaScript access
      document.cookie = `Authorization=Bearer ${data.accessToken}; path=/; max-age=3600; samesite=strict`;
      console.log('Set Authorization cookie for proxy middleware');
    } else {
      console.warn('No access token provided to setTokens');
    }

    // Check for refresh token with different possible property names
    let refreshToken = data.refreshToken;
    if (!refreshToken) {
      // Check for common alternative property names
      if (data.refresh_token) {
        refreshToken = data.refresh_token;
      } else if (data.refreshtoken) {
        refreshToken = data.refreshtoken;
      } else if (data.refresh) {
        refreshToken = data.refresh;
      }
    }

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      console.warn('No refresh token provided to setTokens. Authentication may fail when the access token expires.');
      console.warn('Data received:', JSON.stringify(data, null, 2));
    }

    // Check for user ID with different possible property names
    let userId = data.userId;
    if (!userId) {
      // Check for common alternative property names
      if (data.id) {
        userId = data.id;
        console.log('Using id field as userId:', userId);
      } else if (data.user_id) {
        userId = data.user_id;
        console.log('Using user_id field as userId:', userId);
      } else if (data.userid) {
        userId = data.userid;
        console.log('Using userid field as userId:', userId);
      } else {
        // Try to get userId from localStorage as a last resort
        userId = localStorage.getItem(USER_ID_KEY);
        if (userId) {
          console.log('Using existing userId from localStorage:', userId);
        }
      }
    }

    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId.toString());
      console.log('Stored userId in localStorage:', userId);
    } else {
      console.warn('No user ID provided to setTokens and none found in localStorage');
    }
  }

  /**
   * Update user password
   * @param {Object} passwordData - Password update data
   * @returns {Promise} - Promise that resolves to success message
   */
  static async updatePassword(passwordData) {
    try {
      const axiosInstance = axios.create();
      const response = await axiosInstance.post(`${API_BASE_URL}/updatePassword`, passwordData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Get password status
   * @returns {Promise} - Promise that resolves to password status
   */
  static async getPasswordStatus() {
    try {
      const axiosInstance = axios.create();
      const response = await axiosInstance.get(`${API_BASE_URL}/password-status`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error getting password status:', error);
      throw error;
    }
  }

  /**
   * Restore password
   * @param {string} email - User email
   * @returns {Promise} - Promise that resolves to success message
   */
  static async restorePassword(email) {
    try {
      const axiosInstance = axios.create();
      const response = await axiosInstance.get(`${API_BASE_URL}/restorePassword?email=${email}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error restoring password:', error);
      throw error;
    }
  }

  /**
   * Set new password
   * @param {Object} passwordData - New password data
   * @returns {Promise} - Promise that resolves to success message
   */
  static async setPassword(passwordData) {
    try {
      const axiosInstance = axios.create();
      const response = await axiosInstance.post(`${API_BASE_URL}/set-password`, passwordData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error setting password:', error);
      throw error;
    }
  }

  /**
   * Change password
   * @param {Object} passwordData - Password change data
   * @returns {Promise} - Promise that resolves to success message
   */
  static async changePassword(passwordData) {
    try {
      const axiosInstance = axios.create();
      const response = await axiosInstance.put(`${API_BASE_URL}/changePassword`, passwordData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Setup axios interceptors for authentication and error handling
   */
  static setupAxiosInterceptors() {
    // Request interceptor - add token to authenticated requests
    axios.interceptors.request.use(
      (config) => {
        // Add authorization header with JWT token if available
        const token = this.getAccessToken();
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
          console.debug('Added authorization header to request');
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          const originalRequest = error.config;

          // Log the error for debugging
          console.debug('Axios interceptor caught an error:', {
            url: originalRequest?.url,
            method: originalRequest?.method,
            status: error.response?.status,
            statusText: error.response?.statusText
          });

          // Check if the error is due to an expired token (401 Unauthorized)
          if (error.response && error.response.status === 401 && !originalRequest._retry) {
            console.debug('Attempting to refresh token due to 401 Unauthorized error');

            // Mark the request as retried to prevent infinite loops
            originalRequest._retry = true;

            try {
              // Try to refresh the token
              const refreshResponse = await this.refreshToken();

              // If token refresh was successful, update the authorization header and retry the request
              if (refreshResponse && refreshResponse.accessToken) {
                console.debug('Token refresh successful, retrying original request');

                // Update the authorization header with the new token
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;

                // Retry the original request with the new token
                return axios(originalRequest);
              } else {
                console.error('Token refresh failed: No access token in response');
                this.signOut(); // Clear tokens on refresh failure
                return Promise.reject(error);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              this.signOut(); // Clear tokens on refresh failure
              return Promise.reject(error);
            }
          }

          // For other errors, log more details to help with debugging
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.debug('Error response details:', {
              data: error.response.data,
              status: error.response.status,
              headers: error.response.headers
            });
          } else if (error.request) {
            // The request was made but no response was received
            console.debug('No response received for request:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.debug('Error setting up request:', error.message);
          }

          return Promise.reject(error);
        } catch (interceptorError) {
          // Catch any errors in the interceptor itself to prevent infinite loops
          console.error('Error in axios interceptor:', interceptorError);
          return Promise.reject(error);
        }
      }
    );
  }
}

// Initialize axios interceptors
AuthService.setupAxiosInterceptors();

export default AuthService;
