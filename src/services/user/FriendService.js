import axios from 'axios';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const USER_LINK = `${API_BASE_URL}/user`;
const FRIEND_LINK = `${API_BASE_URL}/friends`;
const HABIT_LINK = `${API_BASE_URL}/habit`;

/**
 * Service for friend-related API calls
 */
class FriendService {
  /**
   * Get all friends with pagination
   *
   * @param {number} [page=0] - Page number (0-based)
   * @param {number} [size=10] - Page size
   * @returns {Promise<import('../../models/user/Friend').FriendArrayModel>} Promise that resolves to paginated friends
   */
  static async getAllFriends(page = 0, size = 10) {
    try {
      const response = await axios.get(`${FRIEND_LINK}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting all friends:', error);
      throw error;
    }
  }

  /**
   * Get friends by name with pagination
   *
   * @param {string} name - Name to search for
   * @param {number} [page=0] - Page number (0-based)
   * @param {number} [size=10] - Page size
   * @returns {Promise<import('../../models/user/Friend').FriendArrayModel>} Promise that resolves to paginated friends
   */
  static async getFriendsByName(name, page = 0, size = 10) {
    try {
      const response = await axios.get(`${FRIEND_LINK}?name=${encodeURIComponent(name)}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting friends by name "${name}":`, error);
      throw error;
    }
  }

  /**
   * Get new potential friends (users who are not yet friends)
   *
   * @param {string} [name=''] - Name to search for
   * @param {number} [page=0] - Page number (0-based)
   * @param {number} [size=10] - Page size
   * @returns {Promise<import('../../models/user/Friend').FriendArrayModel>} Promise that resolves to paginated potential friends
   */
  static async getNewFriends(name = '', page = 0, size = 10) {
    try {
      const response = await axios.get(
        `${FRIEND_LINK}/not-friends-yet?name=${encodeURIComponent(name)}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting new potential friends:', error);
      throw error;
    }
  }

  /**
   * Get friend requests with pagination
   *
   * @param {number} [page=0] - Page number (0-based)
   * @param {number} [size=10] - Page size
   * @returns {Promise<import('../../models/user/Friend').FriendArrayModel>} Promise that resolves to paginated friend requests
   */
  static async getFriendRequests(page = 0, size = 10) {
    try {
      const response = await axios.get(`${FRIEND_LINK}/friendRequests?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting friend requests:', error);
      throw error;
    }
  }

  /**
   * Get all friends of a specific user with pagination
   *
   * @param {number} userId - User ID
   * @param {number} [page=0] - Page number (0-based)
   * @param {number} [size=10] - Page size
   * @returns {Promise<import('../../models/user/Friend').FriendArrayModel>} Promise that resolves to paginated friends
   */
  static async getUserFriends(userId, page = 0, size = 10) {
    try {
      const response = await axios.get(`${FRIEND_LINK}/${userId}/all-user-friends?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting friends of user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get mutual friends between the current user and another user
   *
   * @param {number} userId - User ID
   * @param {number} [page=0] - Page number (0-based)
   * @param {number} [size=10] - Page size
   * @returns {Promise<import('../../models/user/Friend').FriendArrayModel>} Promise that resolves to paginated mutual friends
   */
  static async getMutualFriends(userId, page = 0, size = 10) {
    try {
      const response = await axios.get(`${FRIEND_LINK}/mutual-friends?friendId=${userId}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting mutual friends with user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get recommended friends with pagination
   *
   * @param {number} [page=0] - Page number (0-based)
   * @param {number} [size=10] - Page size
   * @returns {Promise<import('../../models/user/Friend').FriendArrayModel>} Promise that resolves to paginated recommended friends
   */
  static async getRecommendedFriends(page = 0, size = 10) {
    try {
      const response = await axios.get(`${FRIEND_LINK}/recommended-friends?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting recommended friends:', error);
      throw error;
    }
  }

  /**
   * Send a friend request to a user
   *
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Promise that resolves when the request is sent
   */
  static async addFriend(userId) {
    try {
      const response = await axios.post(`${FRIEND_LINK}/${userId}`, {});
      return response.data;
    } catch (error) {
      console.error(`Error sending friend request to user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Accept a friend request
   *
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Promise that resolves when the request is accepted
   */
  static async acceptFriendRequest(userId) {
    try {
      const response = await axios.patch(`${FRIEND_LINK}/${userId}/acceptFriend`, {});
      return response.data;
    } catch (error) {
      console.error(`Error accepting friend request from user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Decline a friend request
   *
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Promise that resolves when the request is declined
   */
  static async declineFriendRequest(userId) {
    try {
      const response = await axios.patch(`${FRIEND_LINK}/${userId}/declineFriend`, {});
      return response.data;
    } catch (error) {
      console.error(`Error declining friend request from user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a friend
   *
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Promise that resolves when the friend is removed
   */
  static async removeFriend(userId) {
    try {
      const response = await axios.delete(`${FRIEND_LINK}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing friend with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel a sent friend request
   *
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Promise that resolves when the request is canceled
   */
  static async cancelFriendRequest(userId) {
    try {
      const response = await axios.delete(`${FRIEND_LINK}/${userId}/cancelRequest`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling friend request to user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get user data as a friend
   *
   * @param {number} userId - User ID
   * @returns {Promise<import('../../models/user/Friend').UserDataAsFriend>} Promise that resolves to user data as a friend
   */
  static async getUserDataAsFriend(userId) {
    try {
      const response = await axios.get(`${FRIEND_LINK}/user-data-as-friend/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting user data as friend for user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Check if a user is online
   *
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Promise that resolves to whether the user is online
   */
  static async isUserOnline(userId) {
    try {
      const response = await axios.get(`${USER_LINK}/isOnline/${userId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error checking if user with ID ${userId} is online:`, error);
      return false; // Default to offline if there's an error
    }
  }

  /**
   * Invite friends to a habit
   *
   * @param {number} habitId - Habit ID
   * @param {number[]} friendIds - Friend IDs
   * @returns {Promise<Object>} Promise that resolves when the invitations are sent
   */
  static async inviteFriendsToHabit(habitId, friendIds) {
    try {
      const queryParams = friendIds.map(id => `friendsIds=${id}`).join('&');
      const response = await axios.post(`${HABIT_LINK}/assign/${habitId}/invite?${queryParams}`, {});
      return response.data;
    } catch (error) {
      console.error(`Error inviting friends to habit with ID ${habitId}:`, error);
      throw error;
    }
  }
}

export default FriendService;
