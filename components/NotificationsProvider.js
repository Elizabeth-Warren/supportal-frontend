import PropTypes from 'prop-types';
import shortid from 'shortid';
import { useState } from 'react';
import NotificationsContext from '../contexts/NotificationsContext';
import NotificationTypes from '../constants/NotificationTypes';

const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Clears all existing notifications.
   */
  const clearNotifications = () => {
    setNotifications([]);
  };

  /**
   * Removes a notification from the notifications array.
   * @param {string} id
   */
  const removeNotification = id => {
    setNotifications(notifications.filter(item => item.id !== id));
  };

  /**
   * Creates a new notification from a notification object.
   * @param {object} obj
   * @param {string} [obj.id] - An ID for the notification. Optional, and if
   *   omitted a unique ID will be created.
   * @param {string|React} obj.message - The required notification message,
   *   either a string or a React component, to display.
   * @param {NotificationTypes} [obj.type] - The display theme for the message.
   * @param {boolean} [obj.dismissable] - Can the notificaiton can be dismissed.
   * @param {number} [obj.dismissAfter] - If set, the time in milliseconds that
   *   this notification will dismiss itself.
   * @returns {object} - Returns the newly created notification instance.
   */
  const showNotification = ({
    id: origId = null,
    message,
    type = NotificationTypes.DEFAULT,
    dismissable = true,
    dismissAfter = 0,
  }) => {
    if (!message) {
      throw new Error('A `message` is required.');
    }
    const id = origId || shortid.generate();
    const newNotification = { id, message, type, dismissable };
    const existingCopy = notifications.find(item => item.id === id);
    if (existingCopy) {
      return existingCopy;
    }
    setNotifications([...notifications, newNotification]);
    if (dismissable && dismissAfter) {
      window.setTimeout(() => {
        removeNotification(id);
      }, dismissAfter);
    }
    return newNotification;
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        clearNotifications,
        removeNotification,
        showNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

NotificationsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationsProvider;
