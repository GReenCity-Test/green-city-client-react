import axios from 'axios';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const HABIT_LINK = `${API_BASE_URL}/habit`;

/**
 * Service for habit-related API calls
 */
class HabitService {
  /**
   * Get mutual habits between the current user and a friend
   *
   * @param {number} friendId - ID of the friend
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/Habit').HabitList>} Promise that resolves to habit list
   */
  static async getMutualHabits(friendId, page = 0, size = 10, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/allMutualHabits/${friendId}?lang=${language}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting mutual habits:', error);
      throw error;
    }
  }

  /**
   * Get all habits of a friend
   *
   * @param {number} friendId - ID of the friend
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/Habit').HabitList>} Promise that resolves to habit list
   */
  static async getAllFriendHabits(friendId, page = 0, size = 10, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/all/${friendId}?lang=${language}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting friend habits:', error);
      throw error;
    }
  }

  /**
   * Get all available habits
   *
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/Habit').HabitList>} Promise that resolves to habit list
   */
  static async getAllHabits(page = 0, size = 10, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}?lang=${language}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting all habits:', error);
      throw error;
    }
  }

  /**
   * Get all habits of the current user
   *
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/Habit').HabitList>} Promise that resolves to habit list
   */
  static async getMyAllHabits(page = 0, size = 10, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/my?lang=${language}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting my habits:', error);
      throw error;
    }
  }

  /**
   * Get a specific habit by ID
   *
   * @param {number} id - Habit ID
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/Habit').Habit>} Promise that resolves to habit
   */
  static async getHabitById(id, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/${id}?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get to-do list for a habit
   *
   * @param {number} id - Habit ID
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/ToDoList').ToDoList[]>} Promise that resolves to to-do list
   */
  static async getHabitToDoList(id, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/${id}/to-do-list?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting to-do list for habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all tags for habits
   *
   * @returns {Promise<Array<Object>>} Promise that resolves to tags
   */
  static async getAllTags() {
    try {
      const response = await axios.get(`${API_BASE_URL}/tags/v2/search?type=HABIT`);
      return response.data;
    } catch (error) {
      console.error('Error getting tags:', error);
      throw error;
    }
  }

  /**
   * Add a custom habit
   *
   * @param {Object} habit - Custom habit data
   * @param {string} [language='en'] - Language code
   * @returns {Promise<Object>} Promise that resolves to custom habit
   */
  static async addCustomHabit(habit, language = 'en') {
    try {
      const formData = this.prepareCustomHabitRequest(habit, language);
      const response = await axios.post(`${HABIT_LINK}/custom`, formData);
      return response.data;
    } catch (error) {
      console.error('Error adding custom habit:', error);
      throw error;
    }
  }

  /**
   * Update a custom habit
   *
   * @param {Object} habit - Custom habit data
   * @param {string} [language='en'] - Language code
   * @param {number} id - Habit ID
   * @returns {Promise<Object>} Promise that resolves to updated custom habit
   */
  static async changeCustomHabit(habit, id, language = 'en') {
    try {
      const formData = this.prepareCustomHabitRequest(habit, language);
      const response = await axios.put(`${HABIT_LINK}/update/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error(`Error updating custom habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a custom habit
   *
   * @param {number} id - Habit ID
   * @returns {Promise<Object>} Promise that resolves when deletion is complete
   */
  static async deleteCustomHabit(id) {
    try {
      const response = await axios.delete(`${HABIT_LINK}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting custom habit with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Accept a habit invitation
   *
   * @param {number} invitationId - Invitation ID
   * @returns {Promise<string>} Promise that resolves when acceptance is complete
   */
  static async acceptHabitInvitation(invitationId) {
    try {
      const response = await axios.patch(`${HABIT_LINK}/invite/${invitationId}/accept`, {});
      return response.data;
    } catch (error) {
      console.error(`Error accepting habit invitation with ID ${invitationId}:`, error);
      throw error;
    }
  }

  /**
   * Decline a habit invitation
   *
   * @param {number} invitationId - Invitation ID
   * @returns {Promise<string>} Promise that resolves when rejection is complete
   */
  static async declineHabitInvitation(invitationId) {
    try {
      const response = await axios.delete(`${HABIT_LINK}/invite/${invitationId}/reject`);
      return response.data;
    } catch (error) {
      console.error(`Error declining habit invitation with ID ${invitationId}:`, error);
      throw error;
    }
  }

  /**
   * Prepare custom habit request
   *
   * @private
   * @param {Object} habit - Custom habit data
   * @param {string} language - Language code
   * @returns {FormData} Form data for the request
   */
  static prepareCustomHabitRequest(habit, language) {
    const body = {
      habitTranslations: [
        {
          name: habit.title,
          description: habit.description,
          habitItem: '',
          languageCode: language
        }
      ],
      complexity: habit.complexity,
      defaultDuration: habit.duration,
      tagIds: habit.tagIds,
      customToDoListItemDto: habit.toDoList
    };

    const formData = new FormData();
    formData.append('request', JSON.stringify(body));
    if (habit.imageFile) {
      formData.append('image', habit.imageFile);
    }

    return formData;
  }
}

export default HabitService;
