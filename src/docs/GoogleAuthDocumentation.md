# Google Authentication Documentation

## Overview

This document explains how to use Google Authentication in the Green City Client React application. There are three methods available for authenticating with Google:

1. **POST with token in body** (default)
2. **POST with token in Authorization header**
3. **GET with idToken as URL parameter**

## Using the GoogleButton Component

The `GoogleButton` component provides a simple way to implement Google Sign-In in your application. It supports all three authentication methods through props.

### Basic Usage

```jsx
import GoogleButton from '../components/auth/GoogleButton';

// Default usage (POST with token in body)
<GoogleButton 
  onSuccess={handleSuccess} 
  onError={handleError} 
/>

// Using header-based authentication
<GoogleButton 
  onSuccess={handleSuccess} 
  onError={handleError} 
  useHeaderAuth={true} 
/>

// Using GET-based authentication with idToken as URL parameter
<GoogleButton 
  onSuccess={handleSuccess} 
  onError={handleError} 
  useGetAuth={true} 
/>
```

## Direct Implementation with @react-oauth/google

If you prefer to implement Google Sign-In directly without using the `GoogleButton` component, you can use the `GoogleLogin` component from `@react-oauth/google` and make the API calls yourself.

### Example: POST with token in body

```jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

<GoogleLogin
  onSuccess={(credentialResponse) => {
    const token = credentialResponse.credential;

    axios.post('/googleSecurity', {
      token: token,
      lang: 'en' // Optional language parameter
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: false
    })
    .then(res => {
      console.log("✅ Success:", res.data);
      // Handle successful authentication
    })
    .catch(err => {
      console.error("❌ Error:", err);
      // Handle authentication error
    });
  }}
  onError={() => {
    console.log("Google Sign-In failed");
  }}
/>
```

## Using the AuthContext

If you need more control over the authentication process, you can use the `useAuth` hook to access the authentication methods directly.

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { signInWithGoogle, signInWithGoogleHeader, signInWithGoogleGet } = useAuth();

  // Example: Sign in with Google using POST method (default)
  const handleGoogleSignIn = async (token) => {
    try {
      const userData = await signInWithGoogle(token, 'en');
      console.log('User data:', userData);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    // Your component JSX
  );
};
```

## API Reference

### GoogleAuthService

The `GoogleAuthService` class provides methods for authenticating with Google.

#### Methods

- **signIn(token, language = 'en')**: Authenticates with Google using a POST request with the token in the request body.
- **signInWithHeader(token, language = 'en')**: Authenticates with Google using a POST request with the token in the Authorization header.
- **signInWithGet(idToken, language = 'en')**: Authenticates with Google using a GET request with idToken as a URL parameter.

### AuthContext

The `AuthContext` provides authentication methods and state to your components.

#### Methods

- **signInWithGoogle(token, language = 'en')**: Authenticates with Google using a POST request with the token in the request body.
- **signInWithGoogleHeader(token, language = 'en')**: Authenticates with Google using a POST request with the token in the Authorization header.
- **signInWithGoogleGet(idToken, language = 'en')**: Authenticates with Google using a GET request with idToken as a URL parameter.

## Server API Endpoints

The server provides the following endpoints for Google authentication:

- **POST /googleSecurity**: Authenticates with Google using a POST request with the token in the request body (default).
- **POST /googleSecurityHeader**: Authenticates with Google using a POST request with the token in the Authorization header.
- **GET /googleSecurity?idToken=...**: Authenticates with Google using a GET request with idToken as a URL parameter.
