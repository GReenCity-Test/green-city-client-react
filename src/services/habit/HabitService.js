import axios from 'axios';

const HABIT_LINK = `/habit`;

class HabitService {
  static async getMutualHabits(friendId, page = 0, size = 10, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/allMutualHabits/${friendId}?lang=${language}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting mutual habits:', error);
      throw error;
    }
  }

  static async getAllFriendHabits(friendId, page = 0, size = 10, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/all/${friendId}?lang=${language}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting friend habits:', error);
      throw error;
    }
  }

  static async getAllHabits(page = 0, size = 10, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}?lang=${language}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting all habits:', error);
      throw error;
    }
  }

  static async getMyAllHabits(language = 'en') {
    if (typeof language !== 'string' || !language.match(/^[a-z]{2}$/i)) {
      language = 'en';
    }
    try {
      const response = await axios.get(`/habit/assign/allForCurrentUser?lang=${language}`);
      return { page: response.data };
    } catch (error) {
      console.error('Error getting my habits:', error);
      throw error;
    }
  }

  static async getHabitById(id, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/${id}?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting habit with ID ${id}:`, error);
      throw error;
    }
  }

  static async getHabitToDoList(id, language = 'en') {
    try {
      const response = await axios.get(`${HABIT_LINK}/${id}/to-do-list?lang=${language}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting to-do list for habit with ID ${id}:`, error);
      throw error;
    }
  }

  static async getAllTags() {
    try {
      const response = await axios.get(`/tags/v2/search?type=HABIT`);
      return response.data;
    } catch (error) {
      console.error('Error getting tags:', error);
      throw error;
    }
  }

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

  static async deleteCustomHabit(id) {
    try {
      const response = await axios.delete(`${HABIT_LINK}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting custom habit with ID ${id}:`, error);
      throw error;
    }
  }

  static async acceptHabitInvitation(invitationId) {
    try {
      const response = await axios.patch(`${HABIT_LINK}/invite/${invitationId}/accept`, {});
      return response.data;
    } catch (error) {
      console.error(`Error accepting habit invitation with ID ${invitationId}:`, error);
      throw error;
    }
  }

  static async declineHabitInvitation(invitationId) {
    try {
      const response = await axios.delete(`${HABIT_LINK}/invite/${invitationId}/reject`);
      return response.data;
    } catch (error) {
      console.error(`Error declining habit invitation with ID ${invitationId}:`, error);
      throw error;
    }
  }

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
