import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import UserService from '../../services/user/UserService';

// Mock the services
jest.mock('../../services/user/UserService', () => ({
  countActivatedUsers: jest.fn()
}));

jest.mock('../../services/auth/TokenService', () => ({
  useTokenCheck: () => jest.fn()
}));

// Mock the child components to simplify testing
jest.mock('./eco-events/EcoEvents', () => () => <div data-testid="eco-events">EcoEvents</div>);
jest.mock('./subscribe/Subscribe', () => () => <div data-testid="subscribe">Subscribe</div>);
jest.mock('./stat-rows/StatRows', () => () => <div data-testid="stat-rows">StatRows</div>);
jest.mock('../auth/AuthModal', () => ({ onClose }) => (
  <div data-testid="auth-modal">
    <button onClick={onClose}>Close</button>
  </div>
));

describe('HomePage Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });
  });

  it('renders without crashing', () => {
    // Mock the user service to return a count
    UserService.countActivatedUsers.mockResolvedValue(1234);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Check that the component renders
    expect(screen.getByText('Green City')).toBeInTheDocument();
    expect(screen.getByText('Make your habit eco friendly')).toBeInTheDocument();
    expect(screen.getByText('Start habit')).toBeInTheDocument();
  });

  it('displays the correct user count', async () => {
    // Mock the user service to return a specific count
    const mockCount = 5678;
    UserService.countActivatedUsers.mockResolvedValue(mockCount);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for the async call to complete and check the user count
    await waitFor(() => {
      expect(screen.getByText(`${mockCount} users have already joined`)).toBeInTheDocument();
    });

    // Verify that the service was called
    expect(UserService.countActivatedUsers).toHaveBeenCalledTimes(1);
  });

  it('renders child components', () => {
    // Mock the user service
    UserService.countActivatedUsers.mockResolvedValue(1000);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Check that child components are rendered
    expect(screen.getByTestId('eco-events')).toBeInTheDocument();
    expect(screen.getByTestId('subscribe')).toBeInTheDocument();
    expect(screen.getByTestId('stat-rows')).toBeInTheDocument();
  });

  it('does not show auth modal by default', () => {
    // Mock the user service
    UserService.countActivatedUsers.mockResolvedValue(1000);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Check that auth modal is not rendered by default
    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
  });

  // Additional tests would be added for:
  // - Testing the startHabit function with and without a userId
  // - Testing the auth modal opening and closing
  // - Testing the token checking functionality
});
