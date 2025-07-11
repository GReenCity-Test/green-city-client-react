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

      // Ensure user ID is stored in localStorage
      if (userData) {
        if (!userData.userId && userData.id) {
          // If userId is not in the response but id is, use id as userId
          localStorage.setItem('userId', userData.id.toString());
          console.log('Stored user ID from id field:', userData.id);
        } else if (userData.userId) {
          // Verify userId is stored correctly
          console.log('User ID from response:', userData.userId);
        } else {
          // If no user ID in response, try to get it from getCurrentUser
          console.warn('No user ID in sign-in response, attempting to fetch from getCurrentUser');
          try {
            const currentUserData = await AuthService.getCurrentUser();
            if (currentUserData && currentUserData.id) {
              localStorage.setItem('userId', currentUserData.id.toString());
              console.log('Stored user ID from getCurrentUser:', currentUserData.id);
              // Update userData with the id from currentUserData
              userData.id = currentUserData.id;
            } else {
              console.error('Failed to get user ID from getCurrentUser');
            }
          } catch (fetchError) {
            console.error('Error fetching current user after sign-in:', fetchError);
          }
        }
      }

      setCurrentUser(userData);
      AuthService.setTokens(userData); // Ensure tokens are properly set in localStorage
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

      // Ensure user ID is stored in localStorage
      if (userData) {
        if (!userData.userId && userData.id) {
          // If userId is not in the response but id is, use id as userId
          localStorage.setItem('userId', userData.id.toString());
          console.log('Google Auth: Stored user ID from id field:', userData.id);
        } else if (userData.userId) {
          // Verify userId is stored correctly
          console.log('Google Auth: User ID from response:', userData.userId);
        } else {
          // If no user ID in response, try to get it from getCurrentUser
          console.warn('Google Auth: No user ID in sign-in response, attempting to fetch from getCurrentUser');
          try {
            const currentUserData = await AuthService.getCurrentUser();
            if (currentUserData && currentUserData.id) {
              localStorage.setItem('userId', currentUserData.id.toString());
              console.log('Google Auth: Stored user ID from getCurrentUser:', currentUserData.id);
              // Update userData with the id from currentUserData
              userData.id = currentUserData.id;
            } else {
              console.error('Google Auth: Failed to get user ID from getCurrentUser');
            }
          } catch (fetchError) {
            console.error('Google Auth: Error fetching current user after sign-in:', fetchError);
          }
        }
      }

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

      // Ensure user ID is stored in localStorage
      if (userData) {
        if (!userData.userId && userData.id) {
          // If userId is not in the response but id is, use id as userId
          localStorage.setItem('userId', userData.id.toString());
          console.log('Google Auth Header: Stored user ID from id field:', userData.id);
        } else if (userData.userId) {
          // Verify userId is stored correctly
          console.log('Google Auth Header: User ID from response:', userData.userId);
        } else {
          // If no user ID in response, try to get it from getCurrentUser
          console.warn('Google Auth Header: No user ID in sign-in response, attempting to fetch from getCurrentUser');
          try {
            const currentUserData = await AuthService.getCurrentUser();
            if (currentUserData && currentUserData.id) {
              localStorage.setItem('userId', currentUserData.id.toString());
              console.log('Google Auth Header: Stored user ID from getCurrentUser:', currentUserData.id);
              // Update userData with the id from currentUserData
              userData.id = currentUserData.id;
            } else {
              console.error('Google Auth Header: Failed to get user ID from getCurrentUser');
            }
          } catch (fetchError) {
            console.error('Google Auth Header: Error fetching current user after sign-in:', fetchError);
          }
        }
      }

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

      // Ensure user ID is stored in localStorage
      if (userData) {
        if (!userData.userId && userData.id) {
          // If userId is not in the response but id is, use id as userId
          localStorage.setItem('userId', userData.id.toString());
          console.log('Google Auth GET: Stored user ID from id field:', userData.id);
        } else if (userData.userId) {
          // Verify userId is stored correctly
          console.log('Google Auth GET: User ID from response:', userData.userId);
        } else {
          // If no user ID in response, try to get it from getCurrentUser
          console.warn('Google Auth GET: No user ID in sign-in response, attempting to fetch from getCurrentUser');
          try {
            const currentUserData = await AuthService.getCurrentUser();
            if (currentUserData && currentUserData.id) {
              localStorage.setItem('userId', currentUserData.id.toString());
              console.log('Google Auth GET: Stored user ID from getCurrentUser:', currentUserData.id);
              // Update userData with the id from currentUserData
              userData.id = currentUserData.id;
            } else {
              console.error('Google Auth GET: Failed to get user ID from getCurrentUser');
            }
          } catch (fetchError) {
            console.error('Google Auth GET: Error fetching current user after sign-in:', fetchError);
          }
        }
      }

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
