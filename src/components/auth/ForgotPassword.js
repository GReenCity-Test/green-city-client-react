import React, { useState } from 'react';
import './Auth.scss';

/**
 * ForgotPassword component for password recovery
 *
 * @param {Object} props - Component props
 * @param {Function} props.onPageChange - Function to change the auth page
 * @param {boolean} props.isUbs - Whether this is for UBS (Urban Basket Service)
 * @returns {JSX.Element} - Rendered component
 */
const ForgotPassword = ({ onPageChange, isUbs = false }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // In a real app, this would call an API to send a password reset email
      // For now, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage('Password reset instructions have been sent to your email');
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
      console.error('Error sending password reset email:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Reset Password'}
        </button>
      </form>

      <div className="form-footer">
        <p>
          Remember your password?{' '}
          <a onClick={() => onPageChange('sign-in')}>Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
