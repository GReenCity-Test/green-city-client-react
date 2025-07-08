/**
 * @typedef {Object} BaseCalendar
 * @property {number} year - Year of the date
 * @property {number} month - Month of the date (0-11)
 * @property {number} numberOfDate - Day of the month (1-31)
 * @property {Date} date - Full date object
 * @property {string} dayName - Name of the day (e.g., "Mon", "Tue")
 * @property {boolean} hasHabitsInProgress - Whether the day has habits in progress
 * @property {boolean} areHabitsDone - Whether all habits for the day are done
 */

/**
 * @typedef {Object} CalendarWeekInterface
 * @property {number} year - Year of the date
 * @property {number} month - Month of the date (0-11)
 * @property {number} numberOfDate - Day of the month (1-31)
 * @property {Date} date - Full date object
 * @property {string} dayName - Name of the day (e.g., "Mon", "Tue")
 * @property {boolean} hasHabitsInProgress - Whether the day has habits in progress
 * @property {boolean} areHabitsDone - Whether all habits for the day are done
 * @property {boolean} isCurrent - Whether the day is the current day
 */

/**
 * @typedef {Object} CalendarInterface
 * @property {number} year - Year of the date
 * @property {number} month - Month of the date (0-11)
 * @property {number} numberOfDate - Day of the month (1-31)
 * @property {Date} date - Full date object
 * @property {string} dayName - Name of the day (e.g., "Mon", "Tue")
 * @property {boolean} hasHabitsInProgress - Whether the day has habits in progress
 * @property {boolean} areHabitsDone - Whether all habits for the day are done
 * @property {number} firstDay - Day of the week for the first day of the month (0-6, where 0 is Sunday)
 * @property {number} totalDaysInMonth - Total number of days in the month
 * @property {boolean} isCurrentDayActive - Whether the day is the current active day
 */

/**
 * @typedef {Object} HabitPopupInterface
 * @property {number} habitAssignId - ID of the habit assignment
 * @property {string} habitName - Name of the habit
 * @property {boolean} enrolled - Whether the habit is enrolled for the day
 */

/**
 * @typedef {Object} HabitsForDateInterface
 * @property {string} enrollDate - Date in ISO format (YYYY-MM-DD)
 * @property {HabitPopupInterface[]} habitAssigns - Habit assignments for the date
 */

// This file is just for type definitions, no exports needed
