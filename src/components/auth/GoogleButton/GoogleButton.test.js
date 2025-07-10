import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GoogleButton from './GoogleButton';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../../services/translation/TranslationService';
import { GoogleLogin } from '@react-oauth/google';


jest.mock('../../../contexts/AuthContext');
jest.mock('../../../services/translation/TranslationService');
jest.mock('@react-oauth/google', () => ({
  GoogleLogin: jest.fn(({ onSuccess, onError }) => (
    <button 
      data-testid="google-login-button"
      onClick={() => onSuccess({ credential: 'mock-token' })}
      onError={() => onError({ error: 'mock-error' })}
    >
      Google Sign In
    </button>
  ))
}));

describe('GoogleButton Component', () => {

  const mockUserData = { id: '123', name: 'Test User', email: 'test@example.com' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      signInWithGoogle: jest.fn().mockResolvedValue(mockUserData),
      signInWithGoogleHeader: jest.fn().mockResolvedValue(mockUserData),
      signInWithGoogleGet: jest.fn().mockResolvedValue(mockUserData)
    });

    useTranslation.mockReturnValue({
      currentLanguage: 'en',
      t: jest.fn(key => key)
    });
  });
  
  it('renders correctly', () => {
    render(<GoogleButton onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Check that the GoogleLogin component is rendered
    expect(screen.getByTestId('google-login-button')).toBeInTheDocument();
    expect(screen.getByText('Google Sign In')).toBeInTheDocument();
    
    // Check that GoogleLogin was called with the correct props
    expect(GoogleLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
        useOneTap: false,
        locale: 'en',
        type: 'standard',
        theme: 'filled_blue',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%'
      }),
      expect.anything()
    );
  });
  
  it('handles successful authentication with default method', async () => {
    render(<GoogleButton onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Simulate successful Google sign-in
    fireEvent.click(screen.getByTestId('google-login-button'));
    
    // Wait for the async operations to complete
    await waitFor(() => {
      // Check that signInWithGoogle was called with the correct token
      expect(useAuth().signInWithGoogle).toHaveBeenCalledWith('mock-token', 'en');
      
      // Check that onSuccess callback was called with the user data
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUserData);
    });
  });
  
  it('handles successful authentication with header method', async () => {
    render(<GoogleButton onSuccess={mockOnSuccess} onError={mockOnError} useHeaderAuth={true} />);
    
    // Simulate successful Google sign-in
    fireEvent.click(screen.getByTestId('google-login-button'));
    
    // Wait for the async operations to complete
    await waitFor(() => {
      // Check that signInWithGoogleHeader was called with the correct token
      expect(useAuth().signInWithGoogleHeader).toHaveBeenCalledWith('mock-token', 'en');
      
      // Check that onSuccess callback was called with the user data
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUserData);
    });
  });
  
  it('handles successful authentication with GET method', async () => {
    render(<GoogleButton onSuccess={mockOnSuccess} onError={mockOnError} useGetAuth={true} />);
    
    // Simulate successful Google sign-in
    fireEvent.click(screen.getByTestId('google-login-button'));
    
    // Wait for the async operations to complete
    await waitFor(() => {
      // Check that signInWithGoogleGet was called with the correct token
      expect(useAuth().signInWithGoogleGet).toHaveBeenCalledWith('mock-token', 'en');
      
      // Check that onSuccess callback was called with the user data
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUserData);
    });
  });
  
  it('handles authentication error', async () => {
    // Mock signInWithGoogle to throw an error
    useAuth.mockReturnValue({
      signInWithGoogle: jest.fn().mockRejectedValue(new Error('Authentication failed'))
    });
    
    render(<GoogleButton onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Simulate successful Google sign-in (but our mock will throw an error)
    fireEvent.click(screen.getByTestId('google-login-button'));
    
    // Wait for the async operations to complete
    await waitFor(() => {
      // Check that onError callback was called with the error
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
      
      // Check that onSuccess callback was not called
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
  
  it('uses Ukrainian locale when language is set to ua', () => {
    // Mock useTranslation to return 'ua' as the current language
    useTranslation.mockReturnValue({
      currentLanguage: 'ua',
      t: jest.fn(key => key)
    });
    
    render(<GoogleButton onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Check that GoogleLogin was called with the correct locale
    expect(GoogleLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: 'uk'
      }),
      expect.anything()
    );
  });
  
  it('handles Google sign-in error', async () => {
    // Create a mock implementation of GoogleLogin that triggers the onError callback
    GoogleLogin.mockImplementationOnce(({ onError }) => (
      <button 
        data-testid="google-login-button"
        onClick={() => onError({ error: 'Google sign-in failed' })}
      >
        Google Sign In
      </button>
    ));
    
    render(<GoogleButton onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Simulate Google sign-in error
    fireEvent.click(screen.getByTestId('google-login-button'));
    
    // Check that onError callback was called
    expect(mockOnError).toHaveBeenCalled();
    
    // Check that auth methods were not called
    expect(useAuth().signInWithGoogle).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});