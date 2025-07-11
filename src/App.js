import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.scss';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AUTH_SETTINGS } from './config/settings';
import { useEffect } from 'react';
import Layout from './components/shared/Layout';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import NewsPage from './components/news/NewsPage';
import CreateNews from './components/news/create-news';
import SingleNewsView from './components/news/single-news-view';
import MapPage from './components/map/MapPage';
import ProfilePage from './components/profile/ProfilePage';
import EventsPage from './components/events/EventsPage';
import UbsUserCabinet from './components/ubs-user/UbsUserCabinet';
import {AuthProvider, useAuth} from './contexts/AuthContext';

// Component to redirect to the user's profile page
const ProfileMeRedirect = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      if (currentUser?.id) {
        navigate(`/profile/${currentUser.id}`);
      } else {
        // If user is authenticated but ID is not available yet, try to get it from localStorage
        const userId = localStorage.getItem('userId');
        if (userId) {
          navigate(`/profile/${userId}`);
        } else {
          // If still no ID, redirect to sign-in
          navigate('/auth/sign-in', { state: { message: 'Please sign in to view your profile.' } });
        }
      }
    } else {
      navigate('/auth/sign-in', { state: { message: 'Please sign in to view your profile.' } });
    }
  }, [currentUser, isAuthenticated, navigate]);

  return <div className="loading-spinner">Redirecting to your profile...</div>;
};

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
              <Route path="/news/:id" element={<SingleNewsView />} />
              <Route path="/events/*" element={<EventsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/about" element={<AboutPage />} />


              <Route path="/profile/me" element={<ProfileMeRedirect />} />
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
