import TodoStatus from './TodoStatus';

/**
 * @typedef {Object} ToDoList
 * @property {number|null} id - Unique identifier
 * @property {TodoStatus} status - Current status of the to-do item
 * @property {string} text - Description of the to-do item
 * @property {boolean} [selected] - Whether the item is selected
 * @property {boolean} [custom] - Whether it's a custom item
 */

/**
 * @typedef {Object} AllToDoLists
 * @property {ToDoList[]} userToDoListItemDto - User to-do list items
 * @property {ToDoList[]} customToDoListItemDto - Custom to-do list items
 */

/**
 * @typedef {Object} CustomToDoItem
 * @property {string} text - Description of the custom to-do item
 */

/**
 * @typedef {Object} HabitUpdateToDoList
 * @property {number} habitAssignId - ID of the habit assignment
 * @property {ToDoList[]} standardToDoList - Standard to-do list items
 * @property {ToDoList[]} customToDoList - Custom to-do list items
 * @property {string} lang - Language code
 */

// This file is just for type definitions, no exports needed
