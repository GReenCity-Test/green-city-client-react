/**
 * Enum for to-do item status
 * @readonly
 * @enum {string}
 */
const TodoStatus = {
  /** To-do item has been completed */
  DONE: 'DONE',
  /** To-do item is in progress */
  INPROGRESS: 'INPROGRESS',
  /** To-do item is active but not yet started */
  ACTIVE: 'ACTIVE'
};

export default TodoStatus;
