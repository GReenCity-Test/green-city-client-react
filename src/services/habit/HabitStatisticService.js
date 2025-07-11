// import axios from 'axios';
// import {MVP_API_URL} from '../../config/api';
//
// // Base API URL from central configuration
// const HABIT_STATISTIC_LINK = `${MVP_API_URL}/habit/statistic`;
//
// /**
//  * Service for habit statistics-related API calls
//  */
// class HabitStatisticService {
//   /**
//    * Get today's statistics for all habit items
//    *
//    * @param {string} [language='en'] - Language code
//    * @returns {Promise<Array<Object>>} Promise that resolves to habit items statistics
//    */
//   static async getTodayStatisticsForAllHabitItems(language = 'en') {
//     try {
//       const response = await axios.get(`${HABIT_STATISTIC_LINK}/todayStatisticsForAllHabitItems?language=${language}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error getting today statistics for all habit items:', error);
//       throw error;
//     }
//   }
//
//   /**
//    * Get statistics for a specific user
//    *
//    * @param {number} userId - User ID
//    * @returns {Promise<Object>} Promise that resolves to user statistics
//    */
//   static async getUserStatistics(userId) {
//     try {
//       const response = await axios.get(`${HABIT_STATISTIC_LINK}/user/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error getting statistics for user with ID ${userId}:`, error);
//       throw error;
//     }
//   }
//
//   /**
//    * Get statistics for the current user
//    *
//    * @returns {Promise<Object>} Promise that resolves to current user statistics
//    */
//   static async getCurrentUserStatistics() {
//     try {
//       const response = await axios.get(`${HABIT_STATISTIC_LINK}/user/current`);
//       return response.data;
//     } catch (error) {
//       console.error('Error getting statistics for current user:', error);
//       throw error;
//     }
//   }
//
//   /**
//    * Get statistics for a specific habit
//    *
//    * @param {number} habitId - Habit ID
//    * @returns {Promise<Object>} Promise that resolves to habit statistics
//    */
//   static async getHabitStatistics(habitId) {
//     try {
//       const response = await axios.get(`${HABIT_STATISTIC_LINK}/habit/${habitId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error getting statistics for habit with ID ${habitId}:`, error);
//       throw error;
//     }
//   }
//
//   /**
//    * Get statistics for a specific habit assignment
//    *
//    * @param {number} habitAssignId - Habit assignment ID
//    * @returns {Promise<Object>} Promise that resolves to habit assignment statistics
//    */
//   static async getHabitAssignStatistics(habitAssignId) {
//     try {
//       const response = await axios.get(`${HABIT_STATISTIC_LINK}/habit-assign/${habitAssignId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error getting statistics for habit assignment with ID ${habitAssignId}:`, error);
//       throw error;
//     }
//   }
//
//   /**
//    * Get statistics for all habits
//    *
//    * @returns {Promise<Object>} Promise that resolves to all habits statistics
//    */
//   static async getAllHabitsStatistics() {
//     try {
//       const response = await axios.get(`${HABIT_STATISTIC_LINK}/all`);
//       return response.data;
//     } catch (error) {
//       console.error('Error getting statistics for all habits:', error);
//       throw error;
//     }
//   }
//
//   /**
//    * Get statistics for a specific date range
//    *
//    * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
//    * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
//    * @returns {Promise<Object>} Promise that resolves to date range statistics
//    */
//   static async getStatisticsByDateRange(startDate, endDate) {
//     try {
//       const response = await axios.get(`${HABIT_STATISTIC_LINK}/range?startDate=${startDate}&endDate=${endDate}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error getting statistics for date range ${startDate} to ${endDate}:`, error);
//       throw error;
//     }
//   }
// }
//
// export default HabitStatisticService;
import axios from 'axios';

const HABIT_STATISTIC_LINK = `/habit/statistic`;

class HabitStatisticService {

    static async getTodayStatisticsForAllHabitItems(language = 'en') {
        try {
            const response = await axios.get(`${HABIT_STATISTIC_LINK}/todayStatisticsForAllHabitItems?language=${language}`);
            return response.data;
        } catch (error) {
            console.error('Error getting today statistics for all habit items:', error);
            throw error;
        }
    }

    static async getHabitStatistics(habitId) {
        try {
            const response = await axios.get(`${HABIT_STATISTIC_LINK}/${habitId}`);
            return response.data;
        } catch (error) {
            console.error(`Error getting statistics for habit ID ${habitId}:`, error);
            throw error;
        }
    }

    static async getHabitAssignStatistics(habitAssignId) {
        try {
            const response = await axios.get(`${HABIT_STATISTIC_LINK}/assign/${habitAssignId}`);
            return response.data;
        } catch (error) {
            console.error(`Error getting statistics for habit assignment ID ${habitAssignId}:`, error);
            throw error;
        }
    }

    static async getAcquiredCount() {
        try {
            const response = await axios.get(`${HABIT_STATISTIC_LINK}/acquired/count`);
            return response.data;
        } catch (error) {
            console.error('Error getting acquired habits count:', error);
            throw error;
        }
    }

    static async getInProgressCount() {
        try {
            const response = await axios.get(`${HABIT_STATISTIC_LINK}/in-progress/count`);
            return response.data;
        } catch (error) {
            console.error('Error getting in-progress habits count:', error);
            throw error;
        }
    }

    static async getUserStatistics() {
        try {
            const response = await axios.get('/habit/assign/allForCurrentUser');
            return response.data;
        } catch (error) {
            console.error('Error getting habit statistics:', error);
            throw error;
        }
    }

}

export default HabitStatisticService;
