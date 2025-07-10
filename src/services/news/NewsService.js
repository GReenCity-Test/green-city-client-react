import axios from 'axios';
import AuthService from '../auth/AuthService';

// Import the API URL from the central configuration
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;

/**
 * Service for news-related API calls
 */
class NewsService {
  /**
   * Fetches the latest news articles
   * @param {number} limit - Number of news articles to fetch
   * @returns {Promise<import('../../models/news/EcoNewsModel').EcoNewsModel[]>} - Promise that resolves to an array of news articles
   */
  static async loadLatestNews(limit = 3) {
    try {
      console.log('Fetching latest news with limit:', limit);
      console.log('API_BASE_URL:', API_BASE_URL);

      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();

      // Explicitly set minimal headers to reduce request size
      const config = {
        params: { page: 0, size: limit },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': ''
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      };

      console.log('Request config:', JSON.stringify(config));

      const response = await axiosInstance.get(`${API_BASE_URL}/eco-news/newest`, config);

      console.log('Response received successfully');
      return response.data;
    } catch (error) {
      console.error('Error fetching latest news:', error);

      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }

      // Return empty array instead of throwing to prevent component crashes
      return [];
    }
  }

  /**
   * Fetches all news articles with pagination
   * @param {number} page - Page number (0-based)
   * @param {number} size - Number of items per page
   * @returns {Promise<import('../../models/news/EcoNewsDto').EcoNewsDto>} - Promise that resolves to paginated news data
   */
  static async getAllNews(page = 0, size = 10) {
    try {
      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.get(`${API_BASE_URL}/eco-news`, {
        params: { page, size },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': ''
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all news:', error);
      throw error;
    }
  }

  /**
   * Fetches a single news article by ID
   * @param {number} id - News article ID
   * @returns {Promise<import('../../models/news/EcoNewsModel').EcoNewsModel>} - Promise that resolves to a news article
   */
  static async getNewsById(id) {
    try {
      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.get(`${API_BASE_URL}/eco-news/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': ''
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching news with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Searches for news articles by title or content
   * @param {string} searchQuery - Search query
   * @param {number} page - Page number (0-based)
   * @param {number} size - Number of items per page
   * @returns {Promise<import('../../models/news/EcoNewsDto').EcoNewsDto>} - Promise that resolves to search results
   */
  static async searchNews(searchQuery, page = 0, size = 10) {
    try {
      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.get(`${API_BASE_URL}/eco-news/search`, {
        params: { query: searchQuery, page, size },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': ''
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  }

  /**
   * Fetches news articles by filter
   * @param {Object} params - Filter parameters
   * @returns {Promise<import('../../models/news/EcoNewsDto').EcoNewsDto>} - Promise that resolves to filtered news data
   */
  static async getNewsByFilter(params) {
    try {
      console.log('NewsService.getNewsByFilter called with params:', params);
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Full URL:', `${API_BASE_URL}/eco-news`);

      // Check if user is authenticated
      const isAuth = AuthService.isAuthenticated();
      console.log('User is authenticated:', isAuth);

      // Create headers based on authentication status
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      // Add Authorization header if user is authenticated
      if (isAuth) {
        const token = AuthService.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          console.log('Added Authorization header with token');
        } else {
          console.log('User is authenticated but token is missing');
        }
      } else {
        console.log('User is not authenticated, not adding Authorization header');
      }

      // Create a new axios instance
      const axiosInstance = axios.create();

      // Set up request config
      const config = {
        params,
        headers,
        // Disable sending cookies to further reduce request size
        withCredentials: false
      };

      console.log('Request config:', JSON.stringify(config));

      // Make the API call
      console.log('Making API call to:', `${API_BASE_URL}/eco-news`);
      const response = await axiosInstance.get(`${API_BASE_URL}/eco-news`, config);

      console.log('Response status:', response.status);
      console.log('Full response:', response);

      // Check if response data exists
      if (!response.data) {
        console.error('Response data is empty or undefined');
        return { page: [], totalElements: 0, totalPages: 0 };
      }

      console.log('Response data structure:', Object.keys(response.data));

      // Check if page property exists
      if (response.data.page) {
        console.log('Response page length:', response.data.page.length);
        if (response.data.page.length > 0) {
          console.log('First item in response:', JSON.stringify(response.data.page[0]));
          console.log('All items in response:', JSON.stringify(response.data.page));
        } else {
          console.log('Response page is empty');
        }
      } else {
        console.log('Response does not contain a page property');
        // Try to adapt the response format if it's not in the expected format
        if (Array.isArray(response.data)) {
          console.log('Response data is an array, adapting to expected format');
          return {
            page: response.data,
            totalElements: response.data.length,
            totalPages: 1
          };
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching news by filter:', error);

      // Log more detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

      throw error;
    }
  }

  /**
   * Fetches news articles by author ID
   * @param {number} authorId - Author ID
   * @param {number} page - Page number (0-based)
   * @param {number} size - Number of items per page
   * @returns {Promise<import('../../models/news/EcoNewsDto').EcoNewsDto>} - Promise that resolves to news data
   */
  static async getNewsByAuthorId(authorId, page = 0, size = 10) {
    try {
      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.get(`${API_BASE_URL}/eco-news`, {
        params: { 'author-id': authorId, page, size },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': ''
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching news by author ID ${authorId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches recommended news articles
   * @param {number} id - News article ID
   * @returns {Promise<import('../../models/news/EcoNewsModel').EcoNewsModel[]>} - Promise that resolves to recommended news articles
   */
  static async getRecommendedNews(id) {
    try {
      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.get(`${API_BASE_URL}/eco-news/${id}/recommended`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': ''
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching recommended news for ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Checks if a news article is liked by a user
   * @param {number} newsId - News article ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} - Promise that resolves to whether the news article is liked by the user
   */
  static async isLikedByUser(newsId, userId) {
    try {
      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.get(`${API_BASE_URL}/eco-news/${newsId}/likes/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': ''
        },
        // Disable sending cookies to further reduce request size
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error(`Error checking if news ${newsId} is liked by user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Toggles like status for a news article
   * @param {number} id - News article ID
   * @returns {Promise<Object>} - Promise that resolves when like status is toggled
   */
  static async toggleLike(id) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to like a news article');
      }

      const response = await axios.post(`${API_BASE_URL}/eco-news/${id}/likes`, {});
      return response.data;
    } catch (error) {
      console.error(`Error toggling like for news with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a news article
   * @param {number} id - News article ID
   * @returns {Promise<Object>} - Promise that resolves when news article is deleted
   */
  static async deleteNews(id) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to delete a news article');
      }

      const response = await axios.delete(`${API_BASE_URL}/eco-news/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting news with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Adds a news article to favorites
   * @param {number} id - News article ID
   * @returns {Promise<Object>} - Promise that resolves when news article is added to favorites
   */
  static async addToFavorites(id) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to add a news article to favorites');
      }

      const response = await axios.post(`${API_BASE_URL}/eco-news/${id}/favorites`, {});
      return response.data;
    } catch (error) {
      console.error(`Error adding news ${id} to favorites:`, error);
      throw error;
    }
  }

  /**
   * Removes a news article from favorites
   * @param {number} id - News article ID
   * @returns {Promise<Object>} - Promise that resolves when news article is removed from favorites
   */
  static async removeFromFavorites(id) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to remove a news article from favorites');
      }

      const response = await axios.delete(`${API_BASE_URL}/eco-news/${id}/favorites`, {});
      return response.data;
    } catch (error) {
      console.error(`Error removing news ${id} from favorites:`, error);
      throw error;
    }
  }

  /**
   * Creates a new news article
   * @param {import('../../models/news/CreateNewsModel').NewsDTO} newsData - News article data
   * @returns {Promise<import('../../models/news/EcoNewsModel').EcoNewsModel>} - Promise that resolves to created news article
   */
  static async createNews(newsData) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to create a news article');
      }

      const formData = new FormData();
      formData.append('addEcoNewsDtoRequest', JSON.stringify(newsData));

      if (newsData.image) {
        formData.append('image', newsData.image);
      }

      const response = await axios.post(`${API_BASE_URL}/eco-news`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  }

  /**
   * Updates a news article
   * @param {import('../../models/news/CreateNewsModel').NewsDTO} newsData - Updated news article data
   * @returns {Promise<import('../../models/news/EcoNewsModel').EcoNewsModel>} - Promise that resolves to updated news article
   */
  static async updateNews(newsData) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to update a news article');
      }

      if (!newsData.id) {
        throw new Error('News ID is required for updating');
      }

      const formData = new FormData();
      formData.append('updateEcoNewsDto', JSON.stringify(newsData));

      if (newsData.image) {
        formData.append('image', newsData.image);
      }

      const response = await axios.put(`${API_BASE_URL}/eco-news/${newsData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating news with ID ${newsData.id}:`, error);
      throw error;
    }
  }

  /**
   * Uploads images for a news article
   * @param {File[]} images - Array of image files
   * @returns {Promise<string[]>} - Promise that resolves to array of image URLs
   */
  static async uploadImages(images) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to upload images');
      }

      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      const response = await axios.post(`${API_BASE_URL}/eco-news/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  /**
   * Creates HTTP parameters for news filtering
   * @param {Object} parameters - Filter parameters
   * @param {number} parameters.page - Page number
   * @param {number} parameters.size - Page size
   * @param {string} [parameters.title] - Title search term
   * @param {boolean} parameters.favorite - Whether to show only favorites
   * @param {number} parameters.userId - User ID
   * @param {number} [parameters.authorId] - Author ID
   * @param {string[]} parameters.tags - Tags to filter by
   * @returns {Object} - HTTP parameters
   */
  static getNewsHttpParams(parameters) {
    const params = {
      page: parameters.page,
      size: parameters.size
    };

    if (parameters.title) {
      params.title = parameters.title.trim().toUpperCase();
    }

    if (parameters.favorite) {
      params.favorite = parameters.favorite;
      params['user-id'] = parameters.userId;
    } else if (parameters.authorId) {
      params['author-id'] = parameters.authorId;
    }

    if (parameters.tags && parameters.tags.length > 0) {
      params.tags = parameters.tags.join(',').toUpperCase();
    }

    return params;
  }
}

export default NewsService;
