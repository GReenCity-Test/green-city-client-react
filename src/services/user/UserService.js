import axios from 'axios';
import HabitService from '../habit/HabitService';
import HabitAssignService from '../habit/HabitAssignService';
import HabitStatisticService from '../habit/HabitStatisticService';
import { USER_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = USER_API_URL;
const USER_LINK = API_BASE_URL;
const FACT_LINK = `${API_BASE_URL}/fact-of-the-day`;

/**
 * Service for user-related API calls
 */
class UserService {
  /**
   * Returns amount of users with activated status.
   * Can be used for representing total amount of users in the system.
   *
   * @returns {Promise<number>} Promise that resolves to the number of activated users
   */
  static async countActivatedUsers() {
    try {
      // Create a new axios instance without interceptors to avoid sending the Authorization header
      const axiosInstance = axios.create();
      // Explicitly set minimal headers to reduce request size
      const response = await axiosInstance.get(`${USER_LINK}/activatedUsersAmount`, {
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
      console.error('Error counting activated users:', error);
      return 0; // Return 0 as a fallback
    }
  }

  /**
   * Get current user information
   *
   * @returns {Promise<Object>} Promise that resolves to user data
   */
  static async getUser() {
    try {
      const response = await axios.get(`${USER_LINK}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  /**
   * Update user information
   *
   * @param {Object} userUpdateModel - User data to update
   * @returns {Promise<Object>} Promise that resolves when update is complete
   */
  static async updateUser(userUpdateModel) {
    try {
      const body = {
        firstName: userUpdateModel.firstName,
        lastName: userUpdateModel.lastName,
        emailNotification: userUpdateModel.emailNotification
      };
      const response = await axios.put(`${USER_LINK}`, body);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Update user's last activity time
   *
   * @returns {Promise<Object>} Promise that resolves when update is complete
   */
  static async updateLastTimeActivity() {
    try {
      const date = new Date().toISOString();
      const response = await axios.put(`${USER_LINK}/updateUserLastActivityTime/`, date);
      return response.data;
    } catch (error) {
      console.error('Error updating last activity time:', error);
      // Don't throw error for this non-critical operation
      return null;
    }
  }

  /**
   * Update user's preferred language
   *
   * @param {number} languageId - ID of the language
   * @returns {Promise<Object>} Promise that resolves when update is complete
   */
  static async updateUserLanguage(languageId) {
    try {
      const response = await axios.put(`${USER_LINK}/language/${languageId}`, {});
      return response.data;
    } catch (error) {
      console.error('Error updating user language:', error);
      throw error;
    }
  }

  /**
   * Get user profile information
   *
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Promise that resolves to user profile data
   */
  static async getUserProfile(userId) {
    try {
      const response = await axios.get(`${USER_LINK}/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error(`Error getting profile for user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get habits for a user
   *
   * @param {number} userId - User ID
   * @param {number} [page=0] - Page number (0-based)
   * @param {number} [size=10] - Page size
   * @returns {Promise<Array<Object>>} Promise that resolves to user habits
   */
  static async getUserHabits(userId, page = 0, size = 10) {
    try {
      // If it's the current user, use getMyAllHabits
      if (userId === localStorage.getItem('userId')) {
        const habitList = await HabitService.getMyAllHabits(page, size);
        return habitList.page || [];
      } else {
        // Otherwise, get habits for the specified user
        const habitList = await HabitService.getAllFriendHabits(userId, page, size);
        return habitList.page || [];
      }
    } catch (error) {
      console.error(`Error getting habits for user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get habit statistics for a user
   *
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Promise that resolves to user habit statistics
   */
  static async getUserHabitStatistics(userId) {
    try {
      return await HabitStatisticService.getUserStatistics(userId);
    } catch (error) {
      console.error(`Error getting habit statistics for user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Add a habit for a user
   *
   * @param {number} userId - User ID
   * @param {Object} habitData - Habit data
   * @returns {Promise<Object>} Promise that resolves when habit is added
   */
  static async addHabit(userId, habitData) {
    try {
      // Check if it's a custom habit
      if (habitData.isCustomHabit) {
        return await HabitService.addCustomHabit(habitData);
      } else {
        // Assign an existing habit
        return await HabitAssignService.assignHabit(habitData.id);
      }
    } catch (error) {
      console.error(`Error adding habit for user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update a habit
   *
   * @param {number} habitId - Habit ID
   * @param {Object} habitData - Updated habit data
   * @returns {Promise<Object>} Promise that resolves when habit is updated
   */
  static async updateHabit(habitId, habitData) {
    try {
      // Check if it's a custom habit
      if (habitData.isCustomHabit) {
        return await HabitService.changeCustomHabit(habitData, habitId);
      } else if (habitData.assignId) {
        // Update habit assignment (e.g., duration)
        return await HabitAssignService.updateHabitDuration(habitData.assignId, habitData.duration);
      } else {
        throw new Error('Invalid habit data for update');
      }
    } catch (error) {
      console.error(`Error updating habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a habit
   *
   * @param {number} habitId - Habit ID
   * @returns {Promise<void>} Promise that resolves when habit is deleted
   */
  static async deleteHabit(habitId) {
    try {
      // First try to delete as a habit assignment
      try {
        return await HabitAssignService.deleteHabitById(habitId);
      } catch (error) {
        // If that fails, try to delete as a custom habit
        return await HabitService.deleteCustomHabit(habitId);
      }
    } catch (error) {
      console.error(`Error deleting habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  /**
   * Get a random fact of the day
   *
   * @param {string} [url=''] - Additional URL path (e.g., '/by-tags' for habit-related facts)
   * @returns {Promise<import('../../models/user/FactOfTheDay').FactOfTheDay>} Promise that resolves to a fact of the day
   */
  static async getRandomFactOfTheDay(url = '') {
    try {
      const response = await axios.get(`${FACT_LINK}/random${url}`);
      return response.data;
    } catch (error) {
      console.error('Error getting random fact of the day:', error);
      throw error;
    }
  }

  /**
   * Get profile statistics for the current user
   *
   * @param {number} userId - User ID
   * @returns {Promise<import('../../models/user/ProfileStatistics').ProfileStatistics>} Promise that resolves to profile statistics
   */
  static async getProfileStatistics(userId) {
    try {
      const response = await axios.get(`${USER_LINK}/${userId}/profileStatistics/`);
      return response.data;
    } catch (error) {
      console.error(`Error getting profile statistics for user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Upload a profile picture for a user
   *
   * @param {number} userId - User ID
   * @param {FormData} formData - Form data containing the image file
   * @returns {Promise<Object>} Promise that resolves to the updated user profile
   */
  static async uploadProfilePicture(userId, formData) {
    try {
      const response = await axios.post(`${USER_LINK}/${userId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading profile picture for user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a user's profile picture
   *
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Promise that resolves when the profile picture is removed
   */
  static async removeProfilePicture(userId) {
    try {
      const response = await axios.delete(`${USER_LINK}/${userId}/profile-picture`);
      return response.data;
    } catch (error) {
      console.error(`Error removing profile picture for user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update a user's profile information
   *
   * @param {number} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.name - User's name
   * @param {string} profileData.city - User's city
   * @param {Object} profileData.cityCoordinates - User's city coordinates
   * @param {string} profileData.credo - User's personal credo
   * @param {Object} profileData.socialNetworks - User's social network links
   * @param {Object} profileData.privacySettings - User's privacy settings
   * @param {Object} profileData.emailPreferences - User's email preferences
   * @returns {Promise<Object>} Promise that resolves to the updated user profile
   */
  static async updateUserProfile(userId, profileData) {
    try {
      const response = await axios.put(`${USER_LINK}/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error(`Error updating profile for user with ID ${userId}:`, error);
      throw error;
    }
  }
}

export default UserService;
