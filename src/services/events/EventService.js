import axios from 'axios';
import AuthService from '../auth/AuthService';
import { MVP_API_URL } from '../../config/api';

// Base API URL from central configuration
const API_BASE_URL = MVP_API_URL;
const EVENTS_LINK = `${API_BASE_URL}/events`;

/**
 * Service for events-related API calls
 */
class EventService {
  /**
   * Get a list of events with pagination and filtering
   *
   * @param {number} page - Page number (1-based)
   * @param {string} filter - Filter type ('all', 'upcoming', 'past')
   * @param {number} size - Page size
   * @returns {Promise<Object>} Promise that resolves to events data
   */
  static async getEvents(page = 1, filter = 'all', size = 6) {
    try {
      const response = await axios.get(`${EVENTS_LINK}`, {
        params: {
          page: page - 1, // API uses 0-based pagination
          size,
          filter
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  /**
   * Get event details by ID
   *
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Promise that resolves to event details
   */
  static async getEventById(eventId) {
    try {
      const response = await axios.get(`${EVENTS_LINK}/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with ID ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Register for an event
   *
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Promise that resolves when registration is complete
   */
  static async registerForEvent(eventId) {
    try {
      const response = await axios.post(`${EVENTS_LINK}/${eventId}/register`);
      return response.data;
    } catch (error) {
      console.error(`Error registering for event with ID ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel registration for an event
   *
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Promise that resolves when cancellation is complete
   */
  static async cancelEventRegistration(eventId) {
    try {
      const response = await axios.delete(`${EVENTS_LINK}/${eventId}/register`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling registration for event with ID ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Get a list of absence events (events where the user registered but was absent)
   *
   * @param {number} page - Page number (1-based)
   * @param {number} size - Page size
   * @returns {Promise<Object>} Promise that resolves to absence events data
   */
  static async getAbsenceEvents(page = 1, size = 6) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to view absence events');
      }

      const response = await axios.get(`${EVENTS_LINK}/absence`, {
        params: {
          page: page - 1, // API uses 0-based pagination
          size
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching absence events:', error);
      throw error;
    }
  }

  /**
   * Get events created by the current user
   *
   * @param {number} page - Page number (1-based)
   * @param {number} size - Page size
   * @returns {Promise<Object>} Promise that resolves to user's events data
   */
  static async getUserEvents(page = 1, size = 6) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to view their events');
      }

      const response = await axios.get(`${EVENTS_LINK}/my-events`, {
        params: {
          page: page - 1, // API uses 0-based pagination
          size
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  }

  /**
   * Create a new event
   *
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Promise that resolves to created event
   */
  static async createEvent(eventData) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to create an event');
      }

      const response = await axios.post(`${EVENTS_LINK}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event
   *
   * @param {number} eventId - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<Object>} Promise that resolves to updated event
   */
  static async updateEvent(eventId, eventData) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to update an event');
      }

      const response = await axios.put(`${EVENTS_LINK}/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event with ID ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an event
   *
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Promise that resolves when deletion is complete
   */
  static async deleteEvent(eventId) {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('User must be authenticated to delete an event');
      }

      const response = await axios.delete(`${EVENTS_LINK}/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event with ID ${eventId}:`, error);
      throw error;
    }
  }
}

export default EventService;
