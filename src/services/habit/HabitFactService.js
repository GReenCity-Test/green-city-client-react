import axios from 'axios';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const FACT_LINK = `${API_BASE_URL}/facts`;
const HABIT_FACT_RANDOM_LINK = `${FACT_LINK}/random`;

/**
 * Service for habit fact-related API calls
 */
class HabitFactService {
  /**
   * Get a random fact for a specific habit
   *
   * @param {number} habitId - Habit ID
   * @param {string} [language='en'] - Language code
   * @returns {Promise<Object>} Promise that resolves to a random fact
   */
  static async getRandomFactByHabitId(habitId, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_FACT_RANDOM_LINK}?habit-id=${habitId}&language=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting random fact for habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  /**
   * Get a random fact
   *
   * @param {string} [language='en'] - Language code
   * @returns {Promise<Object>} Promise that resolves to a random fact
   */
  static async getRandomFact(language = 'en') {
    try {
      const response = await axios.get(`${HABIT_FACT_RANDOM_LINK}?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error getting random fact:', error);
      throw error;
    }
  }

  /**
   * Get all facts
   *
   * @param {string} [language='en'] - Language code
   * @returns {Promise<Array<Object>>} Promise that resolves to all facts
   */
  static async getAllFacts(language = 'en') {
    try {
      const response = await axios.get(`${FACT_LINK}?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error getting all facts:', error);
      throw error;
    }
  }

  /**
   * Get facts by habit ID
   *
   * @param {number} habitId - Habit ID
   * @param {string} [language='en'] - Language code
   * @returns {Promise<Array<Object>>} Promise that resolves to facts for the habit
   */
  static async getFactsByHabitId(habitId, language = 'en') {
    try {
      const response = await axios.get(`${FACT_LINK}/habit/${habitId}?language=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting facts for habit with ID ${habitId}:`, error);
      throw error;
    }
  }
}

export default HabitFactService;
