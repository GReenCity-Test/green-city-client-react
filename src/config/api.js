export const MVP_API_URL = process.env.REACT_APP_MVP_API_URL || '';
export const USER_API_URL = process.env.REACT_APP_USER_API_URL || '';
export const DEFAULT_API_URL = USER_API_URL || '';

export const getApiUrl = (serviceType = 'DEFAULT') => {
  switch (serviceType) {
    case 'MVP':
      return MVP_API_URL;
    case 'USER':
      return USER_API_URL;
    default:
      return DEFAULT_API_URL;
  }
};
