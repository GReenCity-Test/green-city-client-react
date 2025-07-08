import HabitStatus from './HabitStatus';

/**
 * @typedef {Object} HabitStatusCalendarList
 * @property {string} enrollDate - Date of enrollment
 * @property {number} id - Unique identifier
 */

/**
 * @typedef {Object} HabitAssign
 * @property {number} id - Unique identifier
 * @property {HabitStatus} status - Current status of the habit
 * @property {Date} createDateTime - When the habit was assigned
 * @property {import('./Habit').Habit} habit - The habit being assigned
 * @property {number} [complexity] - Difficulty level of the habit
 * @property {boolean} [enrolled] - Whether the habit is enrolled
 * @property {number} userId - The user the habit is assigned to
 * @property {number} duration - How long the habit should be practiced
 * @property {number} [defaultDuration] - Default duration for the habit
 * @property {number} workingDays - Number of days the habit has been worked on
 * @property {number} habitStreak - Current streak of consecutive days
 * @property {Date} lastEnrollmentDate - Last date the habit was enrolled
 * @property {HabitStatusCalendarList[]} habitStatusCalendarDtoList - Calendar data for habit tracking
 * @property {import('./ToDoList').ToDoList[]} toDoListItems - Tasks associated with the habit
 * @property {boolean} [progressNotificationHasDisplayed] - Whether progress notification has been displayed
 */

/**
 * @typedef {Object} Response
 * @property {number} id - Unique identifier
 * @property {HabitStatus} status - Current status of the habit
 * @property {Date} createDateTime - When the habit was assigned
 * @property {number} habit - ID of the habit
 * @property {number} userId - The user the habit is assigned to
 * @property {number} duration - How long the habit should be practiced
 * @property {number} workingDays - Number of days the habit has been worked on
 * @property {number} habitStreak - Current streak of consecutive days
 * @property {Date} lastEnrollmentDate - Last date the habit was enrolled
 */

/**
 * @typedef {Object} ChangesFromCalendarToProgress
 * @property {boolean} isEnrolled - Whether the habit is enrolled
 * @property {string} date - Date of enrollment
 */

/**
 * @typedef {Object} UpdateHabitDuration
 * @property {number} habitAssignId - ID of the habit assignment
 * @property {number} habitId - ID of the habit
 * @property {number} userId - ID of the user
 * @property {HabitStatus} status - Status of the habit
 * @property {number} workingDays - Number of days the habit has been worked on
 * @property {number} duration - Duration of the habit
 */

/**
 * @typedef {Object} FriendsHabitPopupModel
 * @property {number} id - Unique identifier
 * @property {string} name - Name of the friend
 * @property {string} profilePicturePath - Path to the friend's profile picture
 * @property {FriendsHabitProgress} habitProgress - Friend's habit progress
 */

/**
 * @typedef {Object} FriendsHabitProgress
 * @property {number} userId - ID of the user
 * @property {number} duration - Duration of the habit
 * @property {number} workingDays - Number of days the habit has been worked on
 */

// This file is just for type definitions, no exports needed
