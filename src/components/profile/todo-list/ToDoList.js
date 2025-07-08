import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import ToDoListService from '../../../services/habit/ToDoListService';
import TodoStatus from '../../../models/habit/TodoStatus';
import './ToDoList.scss';

/**
 * Component for displaying a user's to-do list
 */
const ToDoList = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [toDoList, setToDoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [toDoListCache, setToDoListCache] = useState(null);

  useEffect(() => {
    if (currentUser) {
      getAllToDoLists();
    }
  }, [currentUser, i18n.language]);

  /**
   * Get all to-do lists for the current user
   */
  const getAllToDoLists = async () => {
    if (toDoListCache) {
      updateAllToDoList(toDoListCache);
      return;
    }

    try {
      setLoading(true);
      const list = await ToDoListService.getUserToDoLists(i18n.language);
      setToDoListCache(list);
      updateAllToDoList(list);
    } catch (error) {
      console.error('Error getting to-do lists:', error);
      setError('Failed to load to-do lists');
      setToDoList([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update the to-do list with data from the API
   *
   * @param {Array} list - List of to-do items from the API
   */
  const updateAllToDoList = (list) => {
    const customToDoList = convertToDoList(list, 'custom');
    const standardToDoList = convertToDoList(list, 'standard');
    customToDoList.forEach(el => el.custom = true);
    setToDoList([...customToDoList, ...standardToDoList]);
  };

  /**
   * Convert the API response to a flat list of to-do items
   *
   * @param {Array} list - List of to-do items from the API
   * @param {string} type - Type of to-do items ('custom' or 'standard')
   * @returns {Array} Flat list of to-do items
   */
  const convertToDoList = (list, type) => {
    return list.reduce((acc, obj) =>
      acc.concat(type === 'custom' ? obj.customToDoListItemDto : obj.userToDoListItemDto),
    []);
  };

  /**
   * Check if a string is a valid URL
   *
   * @param {string} url - URL to check
   * @returns {boolean} Whether the URL is valid
   */
  const isValidURL = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
    return pattern.test(url);
  };

  /**
   * Toggle the expanded/collapsed state of the to-do list
   */
  const openCloseList = () => {
    setToggle(!toggle);
  };

  /**
   * Toggle the done/in-progress status of a to-do item
   *
   * @param {Object} item - To-do item to toggle
   */
  const toggleDone = async (item) => {
    const updatedItem = {
      ...item,
      status: item.status === TodoStatus.INPROGRESS ? TodoStatus.DONE : TodoStatus.INPROGRESS,
      selected: !item.selected
    };

    try {
      if (updatedItem.custom) {
        await ToDoListService.updateCustomToDoItemStatus(currentUser.id, updatedItem);
      } else {
        await ToDoListService.updateStandardToDoItemStatus(updatedItem, i18n.language);
      }

      // Update the local state
      updateToDoList(updatedItem);
    } catch (error) {
      console.error('Error updating to-do item status:', error);
      // Revert the change in the UI
      updateToDoList(item);
    }
  };

  /**
   * Update a to-do item in the local state
   *
   * @param {Object} item - Updated to-do item
   */
  const updateToDoList = (item) => {
    setToDoList(prevList =>
      prevList.map(el => el.id === item.id ? { ...el, status: item.status, selected: item.selected } : el)
    );
  };

  if (loading) {
    return (
      <div className="to-do-list-block">
        <div className="loading-spinner">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="to-do-list-block">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={getAllToDoLists}>{t('common.retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="outer">
      <div className="to-do-list-block">
        <div className="header-position to-do-list-content">
          <div className="header">
            {t('profile.to-do-list')}
            <div className="items-count">
              <br />
              {toDoList.length} {t('profile.elements', { count: toDoList.length })}
            </div>
          </div>
          {toDoList.length > 3 && (
            <button className="btn-see-all" onClick={openCloseList}>
              {toggle ? t('user.habit.btn.see-less') : t('user.habit.btn.see-all')}
            </button>
          )}
        </div>

        {toDoList.length > 0 ? (
          <div className="to-do-list-content">
            <ul className={`to-do-list ${toggle ? 'to-do-list-max' : 'to-do-list-min'}`}>
              {toDoList.map(item => (
                <li
                  key={item.id}
                  className={item.status === TodoStatus.DONE ? 'item-striked' : 'item'}
                >
                  <span title={item.text}>
                    {isValidURL(item.text) ? (
                      <a href={item.text} target="_blank" rel="noopener noreferrer">
                        {item.text}
                      </a>
                    ) : (
                      item.text
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={item.status === TodoStatus.DONE}
                    onChange={() => toggleDone(item)}
                    className="checkbox"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="empty-list">
            <p>{t('profile.empty-list')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoList;
