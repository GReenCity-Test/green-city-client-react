/**
 * @typedef {Object} HabitTranslation
 * @property {string} description - Description of the habit
 * @property {any} habitItem - Habit item
 * @property {string} languageCode - Language code
 * @property {string} name - Name of the habit
 * @property {string} nameUa - Ukrainian name of the habit
 * @property {string} descriptionUa - Ukrainian description of the habit
 * @property {any} habitItemUa - Ukrainian habit item
 */

/**
 * @typedef {Object} Habit
 * @property {number} defaultDuration - Default duration for completing the habit
 * @property {HabitTranslation} habitTranslation - Translations for the habit
 * @property {number} id - Unique identifier
 * @property {string} image - Path to the habit image
 * @property {boolean} [isAssigned] - Whether the habit is assigned to the current user
 * @property {number} [assignId] - ID of the habit assignment
 * @property {number} [complexity] - Difficulty level of the habit
 * @property {number} amountAcquiredUsers - Number of users who have acquired this habit
 * @property {string} [habitAssignStatus] - Status of the habit assignment
 * @property {boolean} isCustomHabit - Whether it's a custom habit created by a user
 * @property {number} usersIdWhoCreatedCustomHabit - ID of the user who created the custom habit
 * @property {import('./ToDoList').ToDoList[]} [customToDoListItems] - Custom to-do list items
 * @property {import('./ToDoList').ToDoList[]} [toDoListItems] - To-do list items
 * @property {string[]} tags - Tags associated with the habit
 * @property {number} [duration] - Duration for completing the habit
 */

/**
 * @typedef {Object} HabitList
 * @property {number} currentPage - Current page number
 * @property {Habit[]} page - Array of habits
 * @property {number} totalElements - Total number of habits
 * @property {number} totalPages - Total number of pages
 */

// This file is just for type definitions, no exports needed
