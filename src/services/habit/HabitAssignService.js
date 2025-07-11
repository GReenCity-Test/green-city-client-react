import axios from 'axios';

// Прямий базовий шлях через proxy для backend
const HABIT_ASSIGN_LINK = `/habit/assign`;

/**
 * Service for habit assignment-related API calls
 */
class HabitAssignService {
  static async getAssignedHabits(language = 'en') {
    try {
      const response = await axios.get(`${HABIT_ASSIGN_LINK}/allForCurrentUser?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error getting assigned habits:', error);
      throw error;
    }
  }

  static async getHabitByAssignId(habitAssignId, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_ASSIGN_LINK}/${habitAssignId}?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting habit assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  static async getFriendsHabitProgress(habitAssignId) {
    try {
      const response = await axios.get(`${HABIT_ASSIGN_LINK}/${habitAssignId}/friends/habit-duration-info`);
      return response.data;
    } catch (error) {
      console.error(`Error getting friends' habit progress for assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  static async assignHabit(habitId) {
    try {
      const response = await axios.post(`${HABIT_ASSIGN_LINK}/${habitId}`, null);
      return response.data;
    } catch (error) {
      console.error(`Error assigning habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  static async assignCustomHabit(habitId, body) {
    try {
      const response = await axios.post(`${HABIT_ASSIGN_LINK}/${habitId}/custom`, body);
      return response.data;
    } catch (error) {
      console.error(`Error assigning custom habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  static async enrollByHabit(habitAssignId, date, language = 'en') {
    try {
      const response = await axios.post(`${HABIT_ASSIGN_LINK}/${habitAssignId}/enroll/${date}?lang=${language}`, null);
      return response.data;
    } catch (error) {
      console.error(`Error enrolling habit assignment with ID ${habitAssignId} for date ${date}:`, error);
      throw error;
    }
  }

  static async unenrollByHabit(habitAssignId, date) {
    try {
      const response = await axios.post(`${HABIT_ASSIGN_LINK}/${habitAssignId}/unenroll/${date}`, null);
      return response.data;
    } catch (error) {
      console.error(`Error unenrolling habit assignment with ID ${habitAssignId} for date ${date}:`, error);
      throw error;
    }
  }

  static async getAssignHabitsByPeriod(startDate, endDate, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_ASSIGN_LINK}/activity/${startDate}/to/${endDate}?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting habit assignments for period ${startDate} to ${endDate}:`, error);
      throw error;
    }
  }

  static async setHabitStatus(habitId, status) {
    try {
      const response = await axios.patch(`${HABIT_ASSIGN_LINK}/${habitId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error setting status for habit assignment with ID ${habitId}:`, error);
      throw error;
    }
  }

  static async deleteHabitById(habitAssignId) {
    try {
      const response = await axios.delete(`${HABIT_ASSIGN_LINK}/delete/${habitAssignId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting habit assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  static async progressNotificationHasDisplayed(habitAssignId) {
    try {
      const response = await axios.put(`${HABIT_ASSIGN_LINK}/${habitAssignId}/updateProgressNotificationHasDisplayed`, {});
      return response.data;
    } catch (error) {
      console.error(`Error updating progress notification for habit assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  static async updateHabitDuration(habitAssignId, duration) {
    try {
      const response = await axios.put(`${HABIT_ASSIGN_LINK}/${habitAssignId}/update-habit-duration?duration=${duration}`, {});
      return response.data;
    } catch (error) {
      console.error(`Error updating duration for habit assignment with ID ${habitAssignId}:`, error);
      throw error;
    }
  }

  static async getAllHabitsForCurrentUser() {
    try {
      const response = await axios.get(`/habit/assign/allForCurrentUser`);
      return response.data;
    } catch (error) {
      console.error('Error getting all habits for current user:', error);
      throw error;
    }
  }
}

export default HabitAssignService;
