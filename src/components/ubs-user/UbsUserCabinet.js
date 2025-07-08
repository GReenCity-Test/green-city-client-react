import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UbsUserSidebar from './shared/UbsUserSidebar';
import './UbsUserCabinet.scss';

// Placeholder components - to be replaced with actual implementations
const UbsUserOrders = () => <div>Orders Component</div>;
const UbsUserBonuses = () => <div>Bonuses Component</div>;
const UbsUserProfile = () => <div>Profile Component</div>;
const UbsUserMessages = () => <div>Messages Component</div>;

/**
 * UBS User Cabinet component
 * This is the main component for the UBS User Cabinet section of the application.
 * It includes a sidebar for navigation and routes for the different sections.
 */
const UbsUserCabinet = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to sign in if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/auth/sign-in" state={{ from: '/ubs-user' }} />;
  }

  return (
    <div className="ubs-user-cabinet">
      <UbsUserSidebar />
      <div className="ubs-user-content">
        <Routes>
          <Route path="/" element={<Navigate to="orders" />} />
          <Route path="orders" element={<UbsUserOrders />} />
          <Route path="bonuses" element={<UbsUserBonuses />} />
          <Route path="profile" element={<UbsUserProfile />} />
          <Route path="messages" element={<UbsUserMessages />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </div>
    </div>
  );
};

export default UbsUserCabinet;
