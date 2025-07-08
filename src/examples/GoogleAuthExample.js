import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

/**
 * Example component demonstrating how to use Google Sign-In with GET request
 * as specified in the issue description.
 */
const GoogleAuthExample = () => {
  // Handle successful Google sign-in
  const handleSuccess = (credentialResponse) => {
    // Get the ID token from the response
    const idToken = credentialResponse.credential;

    // Make a GET request to the googleSecurity endpoint with idToken as a URL parameter
    axios.get('/googleSecurity', {
      params: {
        idToken: idToken,
        lang: 'en' // Optional language parameter
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${idToken}`
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
  };

  // Handle Google sign-in error
  const handleError = (error) => {
    console.error("Google Sign-In failed:", error);
    // Handle sign-in error
  };

  return (
    <div className="google-auth-example">
      <h2>Google Sign-In Example</h2>
      <p>This example demonstrates how to use Google Sign-In with a GET request to the googleSecurity endpoint.</p>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
      />

      <div className="code-example">
        <h3>Code Example:</h3>
        <pre>
          {`
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

<GoogleLogin
  onSuccess={(credentialResponse) => {
    const idToken = credentialResponse.credential;

    axios.get('/googleSecurity', {
      params: {
        idToken: idToken,
        lang: 'en' // Optional language parameter
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': \`Bearer \${idToken}\`
      },
      withCredentials: false
    })
    .then(res => {
      console.log("✅ Success:", res.data);
    })
    .catch(err => {
      console.error("❌ Error:", err);
    });
  }}
  onError={() => {
    console.log("Google Sign-In failed");
  }}
/>
          `}
        </pre>
      </div>
    </div>
  );
};

export default GoogleAuthExample;
