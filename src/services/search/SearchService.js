import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const SEARCH_LINK = `${API_BASE_URL}/search`;

/**
 * Service for search-related API calls
 */
class SearchService {
  /**
   * Subject for search results
   * @type {BehaviorSubject<Object>}
   */
  static searchResults$ = new BehaviorSubject({
    ecoNews: [],
    events: [],
    tips: [],
    places: [],
    users: []
  });

  /**
   * Search across all content types
   *
   * @param {string} searchQuery - Search query
   * @returns {Promise<Object>} Promise that resolves to search results
   */
  static async searchAll(searchQuery) {
    try {
      if (!searchQuery || searchQuery.trim().length < 3) {
        const emptyResults = {
          ecoNews: [],
          events: [],
          tips: [],
          places: [],
          users: []
        };
        this.searchResults$.next(emptyResults);
        return emptyResults;
      }

      const response = await axios.get(`${SEARCH_LINK}/all`, {
        params: { query: searchQuery }
      });

      this.searchResults$.next(response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching all content:', error);
      throw error;
    }
  }

  /**
   * Search for eco news
   *
   * @param {string} searchQuery - Search query
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @returns {Promise<Object>} Promise that resolves to search results
   */
  static async searchEcoNews(searchQuery, page = 0, size = 10) {
    try {
      const response = await axios.get(`${SEARCH_LINK}/eco-news`, {
        params: { query: searchQuery, page, size }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching eco news:', error);
      throw error;
    }
  }

  /**
   * Search for events
   *
   * @param {string} searchQuery - Search query
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @returns {Promise<Object>} Promise that resolves to search results
   */
  static async searchEvents(searchQuery, page = 0, size = 10) {
    try {
      const response = await axios.get(`${SEARCH_LINK}/events`, {
        params: { query: searchQuery, page, size }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  }

  /**
   * Search for tips
   *
   * @param {string} searchQuery - Search query
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @returns {Promise<Object>} Promise that resolves to search results
   */
  static async searchTips(searchQuery, page = 0, size = 10) {
    try {
      const response = await axios.get(`${SEARCH_LINK}/tips`, {
        params: { query: searchQuery, page, size }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching tips:', error);
      throw error;
    }
  }

  /**
   * Search for places
   *
   * @param {string} searchQuery - Search query
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @returns {Promise<Object>} Promise that resolves to search results
   */
  static async searchPlaces(searchQuery, page = 0, size = 10) {
    try {
      const response = await axios.get(`${SEARCH_LINK}/places`, {
        params: { query: searchQuery, page, size }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  /**
   * Search for users
   *
   * @param {string} searchQuery - Search query
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @returns {Promise<Object>} Promise that resolves to search results
   */
  static async searchUsers(searchQuery, page = 0, size = 10) {
    try {
      const response = await axios.get(`${SEARCH_LINK}/users`, {
        params: { query: searchQuery, page, size }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

export default SearchService;
