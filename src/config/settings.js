// Application Settings

// Mail sender settings
export const MAIL_SETTINGS = {
  host: 'smtp.gmail.com',
  port: 587,
  auth: true,
  starttls: true,
  senderAddress: process.env.REACT_APP_EMAIL_ADDRESS || '${EMAIL_ADDRESS}',
  clientAddress: 'http://localhost:3000',
  econewsAddress: 'http://localhost:3000/welcome'
};

// Authentication settings
export const AUTH_SETTINGS = {
  // Token expiration times in minutes
  accessTokenValidTimeInMinutes: 120,
  refreshTokenValidTimeInMinutes: 600,
  tokenKey: '123123123123123123123123123123123123',
  verifyEmailTimeHour: 24,

  // OAuth settings
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '584765975049-0teu14mkdunh9r7mpunqpu7am448lr7c.apps.googleusercontent.com',
  googleClientIdManager: process.env.REACT_APP_GOOGLE_CLIENT_ID_MANAGER || '${GOOGLE_CLIENT_ID_MANAGER}'
};

// API URLs
export const API_SETTINGS = {
  serverAddress: process.env.REACT_APP_USER_API_URL?.replace('/api', '') || 'http://localhost:8060'
};

// Export all settings as a single object
const SETTINGS = {
  MAIL: MAIL_SETTINGS,
  AUTH: AUTH_SETTINGS,
  API: API_SETTINGS
};

export default SETTINGS;
