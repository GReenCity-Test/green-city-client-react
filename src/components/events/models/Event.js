/**
 * @typedef {Object} Event
 * @property {number} id - Unique identifier for the event
 * @property {string} title - Title of the event
 * @property {string} date - Start date and time of the event (ISO string)
 * @property {string} endDate - End date and time of the event (ISO string)
 * @property {string} location - Location where the event will take place
 * @property {string} description - Detailed description of the event
 * @property {string} organizer - Name of the event organizer
 * @property {string} image - URL to the main event image
 * @property {string[]} [additionalImages] - Array of URLs to additional event images
 * @property {number} capacity - Maximum number of participants
 * @property {number} registeredCount - Current number of registered participants
 * @property {string[]} [tags] - Array of tags associated with the event
 * @property {boolean} [isUserRegistered] - Whether the current user is registered for the event
 */

/**
 * @typedef {Object} EventListResponse
 * @property {Event[]} events - Array of events
 * @property {number} totalElements - Total number of events matching the criteria
 * @property {number} totalPages - Total number of pages
 * @property {number} currentPage - Current page number (0-based)
 * @property {number} size - Page size
 */

/**
 * @typedef {Object} AbsenceEvent
 * @property {number} id - Unique identifier for the event
 * @property {string} title - Title of the event
 * @property {string} date - Date and time of the event (ISO string)
 * @property {string} location - Location where the event took place
 * @property {string} image - URL to the event image
 * @property {string} absenceReason - Reason for absence
 */

/**
 * @typedef {Object} AbsenceEventListResponse
 * @property {AbsenceEvent[]} events - Array of absence events
 * @property {number} totalElements - Total number of absence events
 * @property {number} totalPages - Total number of pages
 * @property {number} currentPage - Current page number (0-based)
 * @property {number} size - Page size
 */

// This file is just for type definitions, no exports needed
