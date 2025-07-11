import axios from 'axios';
import HabitService from '../habit/HabitService';
import HabitAssignService from '../habit/HabitAssignService';
import HabitStatisticService from '../habit/HabitStatisticService';

const USER_LINK = '/user';
const FACT_LINK = `${USER_LINK}/fact-of-the-day`;

/**
 * Service for user-related API calls
 */
class UserService {
  static async countActivatedUsers() {
    try {
      const response = await axios.get(`${USER_LINK}/activatedUsersAmount`);
      return response.data;
    } catch (error) {
      console.error('Error counting activated users:', error);
      return 0;
    }
  }

  static async getUser() {
    try {
      const response = await axios.get(`${USER_LINK}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

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

  static async updateLastTimeActivity() {
    try {
      const date = new Date().toISOString();
      const response = await axios.put(`${USER_LINK}/updateUserLastActivityTime/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error updating last activity time:', error);
      return null;
    }
  }

  static async updateUserLanguage(languageId) {
    try {
      const response = await axios.put(`${USER_LINK}/language/${languageId}`);
      return response.data;
    } catch (error) {
      console.error('Error updating user language:', error);
      throw error;
    }
  }

  static async getUserProfile(userId) {
    try {
      const response = await axios.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting profile for user ID ${userId}:`, error);
      throw error;
    }
  }

  static async getUserHabits(userId, page = 0, size = 10) {
    try {
      if (userId === localStorage.getItem('userId')) {
        const habitList = await HabitService.getMyAllHabits(page, size);
        return habitList.page || [];
      } else {
        const habitList = await HabitService.getAllFriendHabits(userId, page, size);
        return habitList.page || [];
      }
    } catch (error) {
      console.error(`Error getting habits for user ID ${userId}:`, error);
      throw error;
    }
  }

  static async getUserHabitStatistics() {
    try {
      // Тепер без userId - бекенд бере по токену
      return await HabitStatisticService.getUserStatistics();
    } catch (error) {
      console.error(`Error getting habit statistics:`, error);
      throw error;
    }
  }

  static async addHabit(habitData) {
    try {
      if (habitData.isCustomHabit) {
        return await HabitService.addCustomHabit(habitData);
      } else {
        return await HabitAssignService.assignHabit(habitData.id);
      }
    } catch (error) {
      console.error(`Error adding habit:`, error);
      throw error;
    }
  }

  static async updateHabit(habitId, habitData) {
    try {
      if (habitData.isCustomHabit) {
        return await HabitService.changeCustomHabit(habitData, habitId);
      } else if (habitData.assignId) {
        return await HabitAssignService.updateHabitDuration(habitData.assignId, habitData.duration);
      } else {
        throw new Error('Invalid habit data for update');
      }
    } catch (error) {
      console.error(`Error updating habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  static async deleteHabit(habitId) {
    try {
      try {
        return await HabitAssignService.deleteHabitById(habitId);
      } catch {
        return await HabitService.deleteCustomHabit(habitId);
      }
    } catch (error) {
      console.error(`Error deleting habit with ID ${habitId}:`, error);
      throw error;
    }
  }

  static async getRandomFactOfTheDay(url = '') {
    try {
      const response = await axios.get(`${FACT_LINK}/random${url}`);
      return response.data;
    } catch (error) {
      console.error('Error getting random fact of the day:', error);
      throw error;
    }
  }

  static async getProfileStatistics(userId) {
    try {
      const response = await axios.get(`${USER_LINK}/${userId}/profileStatistics/`);
      return response.data;
    } catch (error) {
      console.error(`Error getting profile statistics for user ID ${userId}:`, error);
      throw error;
    }
  }

  static async uploadProfilePicture(userId, formData) {
    try {
      const response = await axios.post(`${USER_LINK}/${userId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading profile picture for user ID ${userId}:`, error);
      throw error;
    }
  }

  static async removeProfilePicture(userId) {
    try {
      const response = await axios.delete(`${USER_LINK}/${userId}/profile-picture`);
      return response.data;
    } catch (error) {
      console.error(`Error removing profile picture for user ID ${userId}:`, error);
      throw error;
    }
  }

  static async updateUserProfile(userId, profileData) {
    try {
      const response = await axios.put(`${USER_LINK}/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error(`Error updating profile for user ID ${userId}:`, error);
      throw error;
    }
  }
}

export default UserService;
