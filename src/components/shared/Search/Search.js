import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchService from '../../../services/search/SearchService';
import './Search.scss';

/**
 * Search component for searching across the application
 *
 * @returns {JSX.Element} - Rendered component
 */
const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    ecoNews: [],
    events: [],
    tips: [],
    places: [],
    users: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when search is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Subscribe to search results
  useEffect(() => {
    const subscription = SearchService.searchResults$.subscribe(results => {
      setSearchResults(results);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle search query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        performSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Toggle search
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults({
        ecoNews: [],
        events: [],
        tips: [],
        places: [],
        users: []
      });
    }
  };

  // Perform search
  const performSearch = async () => {
    try {
      setLoading(true);
      await SearchService.searchAll(searchQuery);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle result click
  const handleResultClick = (result, type) => {
    setIsOpen(false);

    // Navigate to the appropriate page based on result type
    switch (type) {
      case 'ecoNews':
        navigate(`/news/${result.id}`);
        break;
      case 'events':
        navigate(`/events/details/${result.id}`);
        break;
      case 'tips':
        navigate(`/tips/${result.id}`);
        break;
      case 'places':
        navigate(`/map?placeId=${result.id}`);
        break;
      case 'users':
        navigate(`/profile/${result.id}`);
        break;
      default:
        break;
    }
  };

  // Get filtered results based on active tab
  const getFilteredResults = () => {
    if (activeTab === 'all') {
      return searchResults;
    }

    return {
      ...Object.fromEntries(Object.entries(searchResults).map(([key, value]) => [key, []])),
      [activeTab]: searchResults[activeTab]
    };
  };

  // Count total results
  const countTotalResults = () => {
    return Object.values(searchResults).reduce((total, results) => total + results.length, 0);
  };

  // Render results for a specific type
  const renderResults = (results, type) => {
    if (!results || results.length === 0) {
      return null;
    }

    return (
      <div className="search-results-section">
        <h3 className="search-results-title">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        <ul className="search-results-list">
          {results.map(result => (
            <li
              key={result.id}
              className="search-result-item"
              onClick={() => handleResultClick(result, type)}
            >
              {result.title || result.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="search" ref={searchRef}>
      <button
        className="search-toggle"
        onClick={toggleSearch}
        aria-expanded={isOpen}
        aria-label="Search"
      >
        <span className="search-icon"></span>
      </button>

      {isOpen && (
        <div className="search-dropdown">
          <div className="search-header">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button
              className="search-close"
              onClick={toggleSearch}
              aria-label="Close search"
            >
              ×
            </button>
          </div>

          <div className="search-tabs">
            <button
              className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              All
            </button>
            <button
              className={`search-tab ${activeTab === 'ecoNews' ? 'active' : ''}`}
              onClick={() => handleTabChange('ecoNews')}
            >
              News
            </button>
            <button
              className={`search-tab ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => handleTabChange('events')}
            >
              Events
            </button>
            <button
              className={`search-tab ${activeTab === 'tips' ? 'active' : ''}`}
              onClick={() => handleTabChange('tips')}
            >
              Tips
            </button>
            <button
              className={`search-tab ${activeTab === 'places' ? 'active' : ''}`}
              onClick={() => handleTabChange('places')}
            >
              Places
            </button>
            <button
              className={`search-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => handleTabChange('users')}
            >
              Users
            </button>
          </div>

          <div className="search-results">
            {loading ? (
              <div className="search-loading">Searching...</div>
            ) : searchQuery.trim().length < 3 ? (
              <div className="search-prompt">Enter at least 3 characters to search</div>
            ) : countTotalResults() === 0 ? (
              <div className="search-no-results">No results found</div>
            ) : (
              Object.entries(getFilteredResults()).map(([type, results]) =>
                renderResults(results, type)
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
