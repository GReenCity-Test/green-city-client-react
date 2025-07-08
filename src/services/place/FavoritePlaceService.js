import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const FAVORITE_PLACE_LINK = `${API_BASE_URL}/favorite/place`;
const PLACE_LINK = `${API_BASE_URL}/place`;

/**
 * Service for favorite place-related API calls
 */
class FavoritePlaceService {
  /**
   * Subject for favorite places data
   * @type {BehaviorSubject<import('../../models/place/Place').Place[]>}
   */
  favoritePlaces$ = new BehaviorSubject([]);

  /**
   * Update favorite places
   *
   * @param {boolean} isFromSideBar - Whether the update is from the sidebar
   * @returns {Promise<void>} Promise that resolves when favorite places are updated
   */
  static async updateFavoritePlaces(isFromSideBar = false) {
    if (isFromSideBar) {
      return;
    }

    try {
      const response = await axios.get(FAVORITE_PLACE_LINK);
      this.favoritePlaces$.next(response.data);
    } catch (error) {
      console.error('Error updating favorite places:', error);
      throw error;
    }
  }

  /**
   * Add a place to favorites
   *
   * @param {Object} favoritePlaceSave - Favorite place to save
   * @param {boolean} isFromSideBar - Whether the add is from the sidebar
   * @returns {Promise<void>} Promise that resolves when place is added to favorites
   */
  static async addFavoritePlace(favoritePlaceSave, isFromSideBar = false) {
    try {
      await axios.post(`${PLACE_LINK}/save/favorite/`, favoritePlaceSave);
      await this.updateFavoritePlaces(isFromSideBar);
    } catch (error) {
      console.error('Error adding favorite place:', error);
      throw error;
    }
  }

  /**
   * Delete a place from favorites
   *
   * @param {number} placeId - Place ID
   * @param {boolean} isFromSideBar - Whether the delete is from the sidebar
   * @returns {Promise<void>} Promise that resolves when place is deleted from favorites
   */
  static async deleteFavoritePlace(placeId, isFromSideBar = false) {
    try {
      await axios.delete(`${FAVORITE_PLACE_LINK}/${placeId}`);
      await this.updateFavoritePlaces(isFromSideBar);
    } catch (error) {
      console.error(`Error deleting favorite place with ID ${placeId}:`, error);
      throw error;
    }
  }

  /**
   * Get all favorite places
   *
   * @returns {Promise<import('../../models/place/Place').Place[]>} Promise that resolves to favorite places
   */
  static async getFavoritePlaces() {
    try {
      const response = await axios.get(FAVORITE_PLACE_LINK);
      return response.data;
    } catch (error) {
      console.error('Error getting favorite places:', error);
      throw error;
    }
  }
}

export default FavoritePlaceService;
