import axios from 'axios';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const HABIT_ASSIGN_LINK = `${API_BASE_URL}/habit/assign`;

/**
 * Service for habit assignment-related API calls
 */
class HabitAssignService {
  /**
   * Get all habits assigned to the current user
   *
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/HabitAssign').HabitAssign[]>} Promise that resolves to habit assignments
   */
  static async getAssignedHabits(language = 'en') {
    try {
      const response = await axios.get(`${HABIT_ASSIGN_LINK}/allForCurrentUser?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error getting assigned habits:', error);
      throw error;
    }
  }

  /**
   * Get a specific habit assignment by ID
   *
   * @param {number} habitAssignId - Habit assignment ID
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/HabitAssign').HabitAssign>} Promise that resolves to habit assignment
   */
  static async getHabitByAssignId(habitAssignId, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_ASSIGN_LINK}/${habitAssignId}?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting habit assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  /**
   * Get friends' habit progress
   *
   * @param {number} habitAssignId - Habit assignment ID
   * @returns {Promise<import('../../models/habit/HabitAssign').FriendsHabitProgress[]>} Promise that resolves to friends' habit progress
   */
  static async getFriendsHabitProgress(habitAssignId) {
    try {
      const response = await axios.get(`${HABIT_ASSIGN_LINK}/${habitAssignId}/friends/habit-duration-info`);
      return response.data;
    } catch (error) {
      console.error(`Error getting friends' habit progress for assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  /**
   * Assign a habit to the current user
   *
   * @param {number} habitId - Habit ID
   * @returns {Promise<import('../../models/habit/HabitAssign').Response>} Promise that resolves to response
   */
  static async assignHabit(habitId) {
    try {
      const response = await axios.post(`${HABIT_ASSIGN_LINK}/${habitId}`, null);
      return response.data;
    } catch (error) {
      console.error(`Error assigning habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  /**
   * Assign a custom habit to the current user
   *
   * @param {number} habitId - Habit ID
   * @param {Object} body - Custom habit assignment properties
   * @returns {Promise<Object>} Promise that resolves to custom habit assignment
   */
  static async assignCustomHabit(habitId, body) {
    try {
      const response = await axios.post(`${HABIT_ASSIGN_LINK}/${habitId}/custom`, body);
      return response.data;
    } catch (error) {
      console.error(`Error assigning custom habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  /**
   * Enroll a habit for a specific date
   *
   * @param {number} habitAssignId - Habit assignment ID
   * @param {string} date - Date in ISO format (YYYY-MM-DD)
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/HabitAssign').HabitAssign>} Promise that resolves to habit assignment
   */
  static async enrollByHabit(habitAssignId, date, language = 'en') {
    try {
      const response = await axios.post(`${HABIT_ASSIGN_LINK}/${habitAssignId}/enroll/${date}?lang=${language}`, null);
      return response.data;
    } catch (error) {
      console.error(`Error enrolling habit assignment with ID ${habitAssignId} for date ${date}:`, error);
      throw error;
    }
  }

  /**
   * Unenroll a habit for a specific date
   *
   * @param {number} habitAssignId - Habit assignment ID
   * @param {string} date - Date in ISO format (YYYY-MM-DD)
   * @returns {Promise<import('../../models/habit/HabitAssign').HabitAssign>} Promise that resolves to habit assignment
   */
  static async unenrollByHabit(habitAssignId, date) {
    try {
      const response = await axios.post(`${HABIT_ASSIGN_LINK}/${habitAssignId}/unenroll/${date}`, null);
      return response.data;
    } catch (error) {
      console.error(`Error unenrolling habit assignment with ID ${habitAssignId} for date ${date}:`, error);
      throw error;
    }
  }

  /**
   * Get habit assignments for a specific period
   *
   * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
   * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/HabitAssign').HabitsForDateInterface[]>} Promise that resolves to habit assignments
   */
  static async getAssignHabitsByPeriod(startDate, endDate, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_ASSIGN_LINK}/activity/${startDate}/to/${endDate}?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting habit assignments for period ${startDate} to ${endDate}:`, error);
      throw error;
    }
  }

  /**
   * Set the status of a habit assignment
   *
   * @param {number} habitId - Habit assignment ID
   * @param {import('../../models/habit/HabitStatus').default} status - Habit status
   * @returns {Promise<import('../../models/habit/HabitAssign').HabitAssign>} Promise that resolves to habit assignment
   */
  static async setHabitStatus(habitId, status) {
    try {
      const response = await axios.patch(`${HABIT_ASSIGN_LINK}/${habitId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error setting status for habit assignment with ID ${habitId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a habit assignment
   *
   * @param {number} habitAssignId - Habit assignment ID
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   */
  static async deleteHabitById(habitAssignId) {
    try {
      const response = await axios.delete(`${HABIT_ASSIGN_LINK}/delete/${habitAssignId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting habit assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  /**
   * Mark progress notification as displayed
   *
   * @param {number} habitAssignId - Habit assignment ID
   * @returns {Promise<Object>} Promise that resolves when update is complete
   */
  static async progressNotificationHasDisplayed(habitAssignId) {
    try {
      const response = await axios.put(`${HABIT_ASSIGN_LINK}/${habitAssignId}/updateProgressNotificationHasDisplayed`, {});
      return response.data;
    } catch (error) {
      console.error(`Error updating progress notification for habit assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  /**
   * Update habit duration
   *
   * @param {number} habitAssignId - Habit assignment ID
   * @param {number} duration - New duration
   * @returns {Promise<import('../../models/habit/HabitAssign').UpdateHabitDuration>} Promise that resolves to updated habit duration
   */
  static async updateHabitDuration(habitAssignId, duration) {
    try {
      const response = await axios.put(`${HABIT_ASSIGN_LINK}/${habitAssignId}/update-habit-duration?duration=${duration}`, {});
      return response.data;
    } catch (error) {
      console.error(`Error updating duration for habit assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }
}

export default HabitAssignService;
