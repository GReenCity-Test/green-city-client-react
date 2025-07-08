import axios from 'axios';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;

class MapService {
  /**
   * Fetches all eco-friendly places
   * @returns {Promise} - Promise that resolves to an array of places
   */
  static async getAllPlaces() {
    try {
      const response = await axios.get(`${API_BASE_URL}/places`);
      return response.data;
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  }

  /**
   * Fetches places by filter
   * @param {Object} filter - Filter parameters
   * @returns {Promise} - Promise that resolves to an array of filtered places
   */
  static async getPlacesByFilter(filter) {
    try {
      const response = await axios.post(`${API_BASE_URL}/places/filter`, filter);
      return response.data;
    } catch (error) {
      console.error('Error fetching places by filter:', error);
      throw error;
    }
  }

  /**
   * Fetches a single place by ID
   * @param {number} id - Place ID
   * @returns {Promise} - Promise that resolves to a place
   */
  static async getPlaceById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/places/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching place with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetches all place categories
   * @returns {Promise} - Promise that resolves to an array of categories
   */
  static async getCategories() {
    try {
      const response = await axios.get(`${API_BASE_URL}/category`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Adds a place to favorites
   * @param {number} placeId - Place ID
   * @returns {Promise} - Promise that resolves when the place is added to favorites
   */
  static async addToFavorites(placeId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/favorite/place/${placeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error adding place ${placeId} to favorites:`, error);
      throw error;
    }
  }

  /**
   * Removes a place from favorites
   * @param {number} placeId - Place ID
   * @returns {Promise} - Promise that resolves when the place is removed from favorites
   */
  static async removeFromFavorites(placeId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/favorite/place/${placeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing place ${placeId} from favorites:`, error);
      throw error;
    }
  }

  /**
   * Fetches user's favorite places
   * @returns {Promise} - Promise that resolves to an array of favorite places
   */
  static async getFavoritePlaces() {
    try {
      const response = await axios.get(`${API_BASE_URL}/favorite/place`);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite places:', error);
      throw error;
    }
  }
}

export default MapService;
