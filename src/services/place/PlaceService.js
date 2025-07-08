import axios from 'axios';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const PLACE_LINK = `${API_BASE_URL}/favorite_place`;

/**
 * Service for place-related API calls
 */
class PlaceService {
  /**
   * Get all favorite eco places for the current user
   *
   * @returns {Promise<import('../../models/place/EcoPlace').EcoPlace[]>} Promise that resolves to eco places
   */
  static async getEcoPlaces() {
    try {
      const response = await axios.get(`${PLACE_LINK}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting eco places:', error);
      return []; // Return empty array as a fallback
    }
  }

  /**
   * Add a place to favorites
   *
   * @param {number} placeId - Place ID
   * @returns {Promise<Object>} Promise that resolves when the place is added
   */
  static async addPlaceToFavorites(placeId) {
    try {
      const response = await axios.post(`${PLACE_LINK}/${placeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error adding place with ID ${placeId} to favorites:`, error);
      throw error;
    }
  }

  /**
   * Remove a place from favorites
   *
   * @param {number} placeId - Place ID
   * @returns {Promise<Object>} Promise that resolves when the place is removed
   */
  static async removePlaceFromFavorites(placeId) {
    try {
      const response = await axios.delete(`${PLACE_LINK}/${placeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing place with ID ${placeId} from favorites:`, error);
      throw error;
    }
  }
}

export default PlaceService;
