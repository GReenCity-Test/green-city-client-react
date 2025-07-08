// API Configuration
// Get server address from settings or use default
import { API_SETTINGS } from './settings';

// Server address for API calls
const SERVER_ADDRESS = API_SETTINGS.serverAddress;

const API_URLS = {
  // Main API URL for GreenCityMVP21
  MVP: '/mvp',

  // User API URL for GreenCityUser21
  USER: '/user',

  // Default API URL (for backward compatibility)
  DEFAULT: '/user'
};

// Get the appropriate API URL based on the service type
export const getApiUrl = (serviceType = 'DEFAULT') => {
  return API_URLS[serviceType] || API_URLS.DEFAULT;
};

// Export individual URLs for direct access
export const MVP_API_URL = API_URLS.MVP;
export const USER_API_URL = API_URLS.USER;
export const DEFAULT_API_URL = API_URLS.DEFAULT;

export default API_URLS;
