import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import NewsService from '../../../services/news/NewsService';
import NewsHeader from './NewsHeader';
import NewsContent from './NewsContent';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import './SingleNewsView.scss';

/**
 * SingleNewsView component for displaying a single news article in detail
 * 
 * @returns {JSX.Element} - Rendered component
 */
const SingleNewsView = () => {
  // Get the news ID from the URL
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();

  // State for news data
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default image
  const defaultImage = '/assets/img/main-event-placeholder.png';

  // Load news data on component mount
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        const newsData = await NewsService.getNewsById(id);
        setNews(newsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle back button click
  const handleBackClick = () => {
    // If there's a previous location in history, go back
    // Otherwise, navigate to the news page
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/news');
    }
  };

  // Check if the current user is the author of the news
  const isAuthor = () => {
    if (!isAuthenticated() || !currentUser || !news) return false;
    return news.author?.id === currentUser.id;
  };

  // Check if the current user is an admin
  const isAdmin = () => {
    if (!isAuthenticated() || !currentUser) return false;
    // TODO: Implement admin check based on user roles when available
    return false;
  };

  // Render loading state
  if (loading) {
    return <LoadingState />;
  }

  // Render error state
  if (error) {
    return <ErrorState error={error} onBackClick={handleBackClick} />;
  }

  // Render loading state if news is not loaded yet
  if (!news) {
    return <LoadingState />;
  }

  return (
    <div className="single-news-view">
      <div className="container">
        <NewsHeader 
          onBackClick={handleBackClick} 
          isAuthor={isAuthor()} 
          isAdmin={isAdmin()} 
          newsId={news.id} 
        />
        <NewsContent 
          news={news} 
          formatDate={formatDate} 
          defaultImage={defaultImage} 
        />
      </div>
    </div>
  );
};

export default SingleNewsView;
