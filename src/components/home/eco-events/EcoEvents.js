import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EcoEventsItem from './EcoEventsItem';
import NewsService from '../../../services/news/NewsService';
import { useTranslation } from '../../../services/translation/TranslationService';
import './EcoEvents.scss';

const EcoEvents = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const eventImg = 'assets/img/main-event-placeholder.png';
  const arrow = 'assets/img/icon/arrow.png';
  const { t } = useTranslation();

  useEffect(() => {
    loadLatestNews();
  }, []);

  const loadLatestNews = async () => {
    try {
      console.log('EcoEvents: Loading latest news');
      setLoading(true);

      // Call the service method with a specific limit
      const newsData = await NewsService.loadLatestNews(3);

      console.log('EcoEvents: News data received:', newsData);

      // Check if we got a valid array response
      if (Array.isArray(newsData) && newsData.length > 0) {
        setLatestNews(newsData);
        setError(null);
        console.log('EcoEvents: News data set successfully');
      } else {
        console.warn('EcoEvents: Received empty or invalid news data, using fallback');
        setError('No news available. Using sample content instead.');

        // Use fallback data
        const mockNews = [
          {
            id: 1,
            title: 'Eco News Title 1',
            content: 'This is the content of the first eco news item.',
            imagePath: 'assets/img/main-event-placeholder.png',
            author: 'John Doe',
            creationDate: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Eco News Title 2',
            content: 'This is the content of the second eco news item.',
            imagePath: 'assets/img/main-event-placeholder.png',
            author: 'Jane Smith',
            creationDate: new Date().toISOString()
          },
          {
            id: 3,
            title: 'Eco News Title 3',
            content: 'This is the content of the third eco news item.',
            imagePath: 'assets/img/main-event-placeholder.png',
            author: 'Bob Johnson',
            creationDate: new Date().toISOString()
          }
        ];
        setLatestNews(mockNews);
      }
    } catch (error) {
      console.error('EcoEvents: Error loading latest news:', error);
      setError('Failed to load news. Please try again later.');

      // Fallback to mock data in case of any error
      const mockNews = [
        {
          id: 1,
          title: 'Eco News Title 1',
          content: 'This is the content of the first eco news item.',
          imagePath: 'assets/img/main-event-placeholder.png',
          author: 'John Doe',
          creationDate: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Eco News Title 2',
          content: 'This is the content of the second eco news item.',
          imagePath: 'assets/img/main-event-placeholder.png',
          author: 'Jane Smith',
          creationDate: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Eco News Title 3',
          content: 'This is the content of the third eco news item.',
          imagePath: 'assets/img/main-event-placeholder.png',
          author: 'Bob Johnson',
          creationDate: new Date().toISOString()
        }
      ];
      setLatestNews(mockNews);
    } finally {
      setLoading(false);
      console.log('EcoEvents: Loading state set to false');
    }
  };

  return (
    <div className="eco-events">
      {loading ? (
        <div className="loading-spinner">
          <p>{t('homepage.eco-news.loading')}</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{t('homepage.eco-news.error')}</p>
        </div>
      ) : latestNews.length > 0 ? (
        <div className="eco-events-wrapper">
          <div className="main-event">
            <img
              src={latestNews[0]?.imagePath || eventImg}
              alt="event-image"
              className="main-event-image"
              aria-hidden="true"
            />
            <EcoEventsItem ecoEvent={latestNews[0]} mainEvent={true} />
          </div>
          <div className="other-events">
            <EcoEventsItem ecoEvent={latestNews[1]} />
            <div className="splitter"></div>
            <EcoEventsItem ecoEvent={latestNews[2]} />
          </div>
        </div>
      ) : (
        <div className="no-news-message">
          <p>{t('homepage.eco-news.no-news')}</p>
        </div>
      )}
      <Link to="/news" className="centered" aria-label="link to eco-news page">
        {t('homepage.eco-news.read-all')}
        <img src={arrow} alt="arrow" aria-hidden="true" />
      </Link>
    </div>
  );
};

export default EcoEvents;
