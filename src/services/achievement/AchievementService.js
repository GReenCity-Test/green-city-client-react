import axios from 'axios';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const ACHIEVEMENT_LINK = `${API_BASE_URL}/achievements`;

/**
 * Service for achievement-related API calls
 */
class AchievementService {
  /**
   * Get all achieved achievements
   *
   * @returns {Promise<import('../../models/achievement/Achievement').Achievement[]>} Promise that resolves to achievements
   */
  static async getAchievements() {
    try {
      const response = await axios.get(`${ACHIEVEMENT_LINK}?achievementStatus=ACHIEVED`);
      return response.data;
    } catch (error) {
      console.error('Error getting achievements:', error);
      throw error;
    }
  }

  /**
   * Get the total number of achievements
   *
   * @returns {Promise<number>} Promise that resolves to the number of achievements
   */
  static async getAchievementsAmount() {
    try {
      const response = await axios.get(`${ACHIEVEMENT_LINK}/count`);
      return response.data;
    } catch (error) {
      console.error('Error getting achievements amount:', error);
      throw error;
    }
  }

  /**
   * Get the number of achieved achievements
   *
   * @returns {Promise<number>} Promise that resolves to the number of achieved achievements
   */
  static async getAchievedAmount() {
    try {
      const response = await axios.get(`${ACHIEVEMENT_LINK}/count?achievementStatus=ACHIEVED`);
      return response.data;
    } catch (error) {
      console.error('Error getting achieved amount:', error);
      throw error;
    }
  }

  /**
   * Get achievements by category
   *
   * @param {number} categoryId - Category ID
   * @returns {Promise<import('../../models/achievement/Achievement').Achievement[]>} Promise that resolves to achievements
   */
  static async getAchievementsByCategory(categoryId) {
    try {
      const response = await axios.get(`${ACHIEVEMENT_LINK}?achievementCategoryId=${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting achievements for category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Get all achievement categories
   *
   * @returns {Promise<import('../../models/achievement/Achievement').AchievementCategory[]>} Promise that resolves to categories
   */
  static async getCategories() {
    try {
      const response = await axios.get(`${ACHIEVEMENT_LINK}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error getting achievement categories:', error);
      throw error;
    }
  }
}

export default AchievementService;
