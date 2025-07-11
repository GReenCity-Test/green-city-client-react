import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NewsService from '../../services/news/NewsService';
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
  const defaultImage = 'assets/img/main-event-placeholder.png';

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
  // Note: This is a placeholder. The actual implementation would depend on how user roles are stored
  const isAdmin = () => {
    if (!isAuthenticated() || !currentUser) return false;
    // TODO: Implement admin check based on user roles when available
    return false;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="single-news-view">
        <div className="container">
          <div className="loading-spinner">
            <p>Loading news article...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="single-news-view">
        <div className="container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="back-button" onClick={handleBackClick}>
              Back to news
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state if news is not loaded yet
  if (!news) {
    return (
      <div className="single-news-view">
        <div className="container">
          <div className="loading-spinner">
            <p>Loading news article...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="single-news-view">
      <div className="container">
        <div className="news-header">
          <button className="back-button" onClick={handleBackClick}>
            Back to news
          </button>
          
          {/* Show edit button only if user is the author or an admin */}
          {(isAuthor() || isAdmin()) && (
            <button 
              className="edit-button"
              onClick={() => navigate(`/news/edit/${news.id}`)}
            >
              Edit
            </button>
          )}
        </div>

        <div className="news-content">
          <h1 className="news-title">{news.title}</h1>
          
          <div className="news-meta">
            <span className="news-author">
              {news.author?.name || 'Unknown Author'}
            </span>
            <span className="news-date">{formatDate(news.creationDate)}</span>
          </div>

          {news.tags && news.tags.length > 0 && (
            <div className="news-tags">
              {news.tags.map((tag) => (
                <span key={tag} className="news-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="news-image">
            <img src={news.imagePath || defaultImage} alt={news.title} />
          </div>

          <div className="news-text" dangerouslySetInnerHTML={{ __html: news.content }} />

          {news.source && (
            <div className="news-source">
              <h3>Source:</h3>
              <p>{news.source}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleNewsView;