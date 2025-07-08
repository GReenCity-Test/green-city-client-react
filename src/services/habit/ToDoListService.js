import axios from 'axios';
import TodoStatus from '../../models/habit/TodoStatus';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const HABIT_LINK = `${API_BASE_URL}/habit`;
const CUSTOM_TODO_LINK = `${API_BASE_URL}/custom/to-do-list-items`;
const USER_TODO_LINK = `${API_BASE_URL}/user/to-do-list-items`;

/**
 * Service for to-do list-related API calls
 */
class ToDoListService {
  /**
   * Get to-do list for a habit
   *
   * @param {number} habitId - Habit ID
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/ToDoList').ToDoList[]>} Promise that resolves to to-do list
   */
  static async getHabitToDoList(habitId, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/${habitId}/to-do-list?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting to-do list for habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  /**
   * Get all to-do lists for a habit assignment
   *
   * @param {number} habitAssignId - Habit assignment ID
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/ToDoList').AllToDoLists>} Promise that resolves to all to-do lists
   */
  static async getHabitAllToDoLists(habitAssignId, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/assign/${habitAssignId}/allUserAndCustomList?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting all to-do lists for habit assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  /**
   * Get all user to-do lists that are in progress
   *
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/ToDoList').AllToDoLists[]>} Promise that resolves to all to-do lists
   */
  static async getUserToDoLists(language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/assign/allUserAndCustomToDoListsInprogress?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user to-do lists:', error);
      throw error;
    }
  }

  /**
   * Update the status of a standard to-do item
   *
   * @param {import('../../models/habit/ToDoList').ToDoList} item - To-do item
   * @param {string} [language='en'] - Language code
   * @returns {Promise<import('../../models/habit/ToDoList').ToDoList[]>} Promise that resolves to updated to-do list
   */
  static async updateStandardToDoItemStatus(item, language = 'en') {
    try {
      const response = await axios.patch(
        `${USER_TODO_LINK}/${item.id}/status/${item.status}?lang=${language}`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating status for standard to-do item with ID ${item.id}:`, error);
      throw error;
    }
  }

  /**
   * Update the status of a custom to-do item
   *
   * @param {number} userId - User ID
   * @param {import('../../models/habit/ToDoList').ToDoList} item - To-do item
   * @returns {Promise<import('../../models/habit/ToDoList').ToDoList>} Promise that resolves to updated to-do item
   */
  static async updateCustomToDoItemStatus(userId, item) {
    try {
      const response = await axios.patch(
        `${CUSTOM_TODO_LINK}/${userId}/custom-to-do-ping-list-items?itemId=${item.id}&status=${item.status}`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating status for custom to-do item with ID ${item.id}:`, error);
      throw error;
    }
  }

  /**
   * Update a habit to-do list
   *
   * @param {import('../../models/habit/ToDoList').HabitUpdateToDoList} habitToDoList - Habit to-do list update data
   * @returns {Promise<Object>} Promise that resolves when update is complete
   */
  static async updateHabitToDoList(habitToDoList) {
    try {
      const assignId = habitToDoList.habitAssignId;
      const body = {
        customToDoListItemDto: habitToDoList.customToDoList,
        userToDoListItemDto: habitToDoList.standardToDoList
      };
      const response = await axios.put(
        `${HABIT_LINK}/assign/${assignId}/allUserAndCustomList?lang=${habitToDoList.lang}`,
        body
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating habit to-do list for assignment with ID ${habitToDoList.habitAssignId}:`, error);
      throw error;
    }
  }
}

export default ToDoListService;
