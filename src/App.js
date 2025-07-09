import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AUTH_SETTINGS } from './config/settings';


import Layout from './components/shared/Layout';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import NewsPage from './components/news/NewsPage';
import CreateNews from './components/news/CreateNews';
import MapPage from './components/map/MapPage';
import ProfilePage from './components/profile/ProfilePage';
import EventsPage from './components/events/EventsPage';
import UbsUserCabinet from './components/ubs-user/UbsUserCabinet';

// Auth Context
import { AuthProvider } from './contexts/AuthContext';

// Placeholder components for routes not yet implemented
const NotFoundPage = () => <div className="container"><h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p></div>;
const ForgotPasswordPage = () => <div className="container"><h1>Forgot Password</h1><p>This page is under construction.</p></div>;

function App() {
  // Get the Google client ID from settings
  const clientId = AUTH_SETTINGS.googleClientId;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/create-news" element={<CreateNews />} />
              <Route path="/events/*" element={<EventsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/about" element={<AboutPage />} />


              <Route path="/profile/:userId" element={<ProfilePage />} />



              {/* UBS User Cabinet Routes */}
              <Route path="/ubs-user/*" element={<UbsUserCabinet />} />

              {/* Authentication Routes */}
              <Route path="/auth/sign-in" element={<SignIn />} />
              <Route path="/auth/sign-up" element={<SignUp />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

              {/* Error Routes */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
