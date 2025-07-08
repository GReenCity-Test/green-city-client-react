import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth/AuthService';
import GoogleAuthService from '../services/auth/GoogleAuthService';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const userData = await AuthService.getCurrentUser();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setError('Failed to authenticate user. Please log in again.');
        AuthService.signOut();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await AuthService.signIn(email, password);
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await AuthService.signUp(userData);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    AuthService.signOut();
    setCurrentUser(null);
  };

  // Google sign in function (token in request body)
  const signInWithGoogle = async (token, language = 'en') => {
    try {
      setLoading(true);
      setError(null);
      const userData = await GoogleAuthService.signIn(token, language);
      setCurrentUser(userData);
      AuthService.setTokens(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in with Google using POST. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google sign in function with token in header
  const signInWithGoogleHeader = async (token, language = 'en') => {
    try {
      setLoading(true);
      setError(null);
      const userData = await GoogleAuthService.signInWithHeader(token, language);
      setCurrentUser(userData);
      AuthService.setTokens(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in with Google using header. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google sign in function with GET request and idToken as URL parameter
  const signInWithGoogleGet = async (idToken, language = 'en') => {
    try {
      setLoading(true);
      setError(null);
      const userData = await GoogleAuthService.signInWithGet(idToken, language);
      setCurrentUser(userData);
      AuthService.setTokens(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in with Google using GET. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value object to be provided to consumers
  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGoogleHeader,
    signInWithGoogleGet,
    isAuthenticated: () => AuthService.isAuthenticated(),
    getUserId: () => AuthService.getUserId(),
    getGoogleClientId: (isManager = false) => GoogleAuthService.getClientId(isManager),
    updateUserProfile: (profileData) => {
      if (currentUser) {
        setCurrentUser({ ...currentUser, ...profileData });
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
