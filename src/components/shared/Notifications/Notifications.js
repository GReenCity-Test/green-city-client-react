import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import NotificationsService from '../../../services/notifications/NotificationsService';
import './Notifications.scss';

/**
 * Notifications component for displaying user notifications
 *
 * @returns {JSX.Element|null} - Rendered component or null if user is not authenticated
 */
const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Load notifications count on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated()) {
      loadNotificationsCount();

      // Subscribe to notifications count changes
      const subscription = NotificationsService.notificationsCount$.subscribe(count => {
        setNotificationsCount(count);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isAuthenticated]);

  // Load notifications when dropdown is opened
  useEffect(() => {
    if (showDropdown && isAuthenticated()) {
      loadNotifications();
    }
  }, [showDropdown, isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load notifications count
  const loadNotificationsCount = async () => {
    try {
      await NotificationsService.getUnreadNotificationsCount();
    } catch (error) {
      console.error('Error loading notifications count:', error);
    }
  };

  // Load notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationsService.getNotifications();
      setNotifications(response.page || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Mark notification as read and navigate to its link
  const handleNotificationClick = async (notification) => {
    try {
      await NotificationsService.markAsRead(notification.id);
      setShowDropdown(false);

      // Navigate to the notification link if available
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await NotificationsService.markAllAsRead();

      // Update local notifications to mark all as read
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Don't render if user is not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="notifications" ref={dropdownRef}>
      <button
        className="notifications-toggle"
        onClick={toggleDropdown}
        aria-expanded={showDropdown}
        aria-label="Notifications"
      >
        <span className="notifications-icon"></span>
        {notificationsCount > 0 && (
          <span className="notifications-count">{notificationsCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {notificationsCount > 0 && (
              <button
                className="mark-all-read"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notifications-list">
            {loading ? (
              <div className="notifications-loading">Loading notifications...</div>
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <p className="notification-text">{notification.text}</p>
                    <span className="notification-date">{formatDate(notification.creationDate)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
