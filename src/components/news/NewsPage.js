import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NewsService from '../../services/news/NewsService';
import NewsItem from './NewsItem';
import TagFilter from '../shared/TagFilter';
import { tagsListEcoNewsData } from '../../models/news/NewsConstants';
import { getMockNews } from '../../models/news/MockNewsData';
import './NewsPage.scss';

const NewsPage = () => {
  // State for news data
  const [news, setNews] = useState([]);
  const [totalNews, setTotalNews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 12;

  // State for filters and view
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isGalleryView, setIsGalleryView] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);

  // Auth context
  const { isAuthenticated, currentUser } = useAuth();

  // Load news on the initial render and when filters change
  useEffect(() => {
    loadNews(true).catch(err => {
      console.error("Error in useEffect loadNews:", err);
    });
  }, [selectedTags, searchQuery, showFavorites]);

  // Process API response and update state
  const processApiResponse = (response, reset, currentPage) => {
    if (response.page && response.page.length > 0) {
      console.log('Successfully fetched news from database');

      setNews(prevNews => reset ? response.page : [...prevNews, ...response.page]);
      setTotalNews(response.totalElements);
      setHasMore(currentPage < response.totalPages - 1);
      setPage(prevPage => reset ? 1 : prevPage + 1);
      setError(null);
      return true;
    } else {
      console.warn('API returned empty news array');
      return false;
    }
  };

  // Filter mock news based on current filters
  const getFilteredMockNews = (mockNews) => {
    let filteredNews = mockNews;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredNews = filteredNews.filter(item => 
        item.title.toLowerCase().includes(query) || 
        (item.content && item.content.toLowerCase().includes(query))
      );
    }

    // Filter by tags
    if (selectedTags && selectedTags.length > 0) {
      filteredNews = filteredNews.filter(item => 
        item.tags && item.tags.some(tag => selectedTags.includes(tag))
      );
    }

    // Filter by favorites if needed
    if (showFavorites) {
      filteredNews = filteredNews.map(item => ({
        ...item,
        favorite: Math.random() > 0.5 // Randomly mark ~50% as favorites
      })).filter(item => item.favorite);
    }

    return filteredNews;
  };

  // Process mock news data and update state
  const processMockNews = (reset, currentPage) => {
    const mockNews = getMockNews();
    console.log('Mock news data loaded:', mockNews.length, 'items');

    const filteredMockNews = getFilteredMockNews(mockNews);

    // Simulate pagination with mock data
    const startIndex = reset ? 0 : (currentPage * pageSize);
    const endIndex = startIndex + pageSize;
    const paginatedMockNews = filteredMockNews.slice(startIndex, endIndex);

    // Update state with mock data
    setNews(prevNews => reset ? paginatedMockNews : [...prevNews, ...paginatedMockNews]);
    setTotalNews(filteredMockNews.length);
    setHasMore(endIndex < filteredMockNews.length);
    setPage(prevPage => reset ? 1 : prevPage + 1);
  };

  // Load news from API
  const loadNews = async (reset = false) => {
    const currentPage = reset ? 0 : page;
    try {
      setLoading(true);

      if (reset) {
        setNews([]);
        setPage(0);
      }

      // Create filter parameters
      const params = NewsService.getNewsHttpParams({
        page: currentPage,
        size: pageSize,
        title: searchQuery,
        favorite: showFavorites,
        userId: currentUser?.id,
        tags: selectedTags
      });

      // Fetch news with filters
      const response = await NewsService.getNewsByFilter(params);
      processApiResponse(response, reset, currentPage);

    } catch (error) {
      console.error('Error loading news:', error);

      // Log error details
      if (error.response) {
        console.error('Error response:', error.response.status);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

      setError('Failed to load news. Using mock data instead.');
      processMockNews(reset, currentPage);
    } finally {
      setLoading(false);
    }
  };

  // Handle tag selection
  const handleTagSelect = (tags) => {
    setSelectedTags(tags);
  };

  // Toggle search visibility
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible && searchQuery) {
      setSearchQuery('');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Cancel search
  const cancelSearch = () => {
    if (searchQuery) {
      setSearchQuery('');
    } else {
      setIsSearchVisible(false);
    }
  };

  // Toggle view mode (gallery/list)
  const toggleView = () => {
    setIsGalleryView(!isGalleryView);
    // Save view preference in session storage
    sessionStorage.setItem('viewGallery', JSON.stringify(!isGalleryView));
  };

  // Toggle favorites filter
  const toggleFavorites = () => {
    if (!isAuthenticated()) {
      // Show auth modal or redirect to login
      return;
    }
    setShowFavorites(!showFavorites);
  };

  // Handle favorite toggle for a news item
  const handleToggleFavorite = async (e, newsItem) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      // Show auth modal or redirect to login
      return;
    }

    try {
      if (newsItem.favorite) {
        await NewsService.removeFromFavorites(newsItem.id);
      } else {
        await NewsService.addToFavorites(newsItem.id);
      }

      // Update the news item in state
      setNews(prevNews =>
        prevNews.map(item =>
          item.id === newsItem.id
            ? { ...item, favorite: !item.favorite }
            : item
        )
      );
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  // Load more news
  const loadMore = () => {
    if (!loading && hasMore) {
      loadNews(false).catch(err => {
        console.error("Error in loadMore:", err);
      });
    }
  };

  // Check if there is no news to display
  const noNewsToDisplay = !loading && news.length === 0 && !error;

  // Check if we're displaying mock data
  const isShowingMockData = error && error.includes('Using mock data');

  // Check if we're displaying real data from the database
  const isShowingRealData = !isShowingMockData && news.length > 0;

  // Get the appropriate message for no news state
  const getNoNewsMessage = () => {
    if (showFavorites) {
      return "You don't have any favorite news articles yet.";
    }

    if (selectedTags.length > 0) {
      return "No news articles match your selected filters.";
    }

    return "No news articles available at the moment.";
  };

  return (
    <div className="news-page">
      <div className="container">
        <div className="news-header">
          <h1>Eco News</h1>

          <div className="news-actions">
            {/* Search input */}
            {isSearchVisible && (
              <div className="search-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search news..."
                  className="search-input"
                />
                <button className="search-cancel" onClick={cancelSearch}>
                  ×
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="action-buttons">
              {!isSearchVisible && (
                <button
                  className={`action-button search-button ${isSearchVisible ? 'active' : ''}`}
                  onClick={toggleSearch}
                  aria-label="Search news"
                >
                  <span className="search-icon"></span>
                </button>
              )}

              <button
                className={`action-button bookmark-button ${showFavorites ? 'active' : ''}`}
                onClick={toggleFavorites}
                aria-label="Show favorites"
              >
                <span className="bookmark-icon"></span>
              </button>

              {isAuthenticated() && (
                <Link to="/news/create-news" className="create-news-button">
                  Create News
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tag filter */}
        <div className="filter-section">
          <TagFilter
            tags={tagsListEcoNewsData}
            onTagSelect={handleTagSelect}
            selectedTags={selectedTags}
          />

          <button
            className="view-toggle-button"
            onClick={toggleView}
            aria-label={isGalleryView ? "Switch to list view" : "Switch to gallery view"}
          >
            <span className={isGalleryView ? "gallery-icon" : "list-icon"}></span>
          </button>
        </div>

        {/* News count */}
        {!loading && (
          <div className="news-count">
            <p>{totalNews} news found</p>
          </div>
        )}

        {/* Real data indicator */}
        {isShowingRealData && (
          <div className="real-data-indicator" style={{
            backgroundColor: '#e8f5e9',
            border: '1px solid #a5d6a7',
            borderRadius: '4px',
            padding: '10px',
            marginBottom: '15px',
            color: '#2e7d32',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>
              <img src="/assets/img/icon/check.svg" alt="success" style={{ width: '16px', height: '16px', marginRight: '5px' }} /> Displaying real news data from the database
            </p>
          </div>
        )}

        {/* Mock data indicator */}
        {isShowingMockData && (
          <div className="mock-data-indicator" style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            marginBottom: '15px',
            color: '#666',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>
              <img src="/assets/img/icon/info.svg" alt="info" style={{ width: '16px', height: '16px', marginRight: '5px' }} /> Displaying mock news data for demonstration purposes
            </p>
          </div>
        )}

        {/* Error message */}
        {error && !isShowingMockData && <div className="error-message">{error}</div>}

        {/* News grid/list */}
        <div className={isGalleryView ? "news-grid" : "news-list"}>
          {news.map(newsItem => (
            <div 
              key={newsItem.id} 
              className="news-item-container"
            >
              <NewsItem
                news={newsItem}
                isGalleryView={isGalleryView}
              />
              <button
                className={`favorite-button ${newsItem.favorite ? 'active' : ''}`}
                onClick={(e) => handleToggleFavorite(e, newsItem)}
                aria-label={newsItem.favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <span className="favorite-icon"></span>
              </button>
            </div>
          ))}
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="loading-spinner">
            <p>Loading news...</p>
          </div>
        )}

        {/* Load more button */}
        {!loading && hasMore && news.length > 0 && (
          <button className="load-more-button" onClick={loadMore}>
            Load More
          </button>
        )}

        {/* No more news message */}
        {!loading && !hasMore && news.length > 0 && (
          <p className="no-more-news">No more news to load.</p>
        )}

        {/* No news message */}
        {noNewsToDisplay && (
          <div className="no-news">
            <h3>No news found</h3>
            <p>
              {getNoNewsMessage()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
