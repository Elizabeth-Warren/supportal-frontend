import { useContext, useEffect, useState } from 'react';
import ErrorNotificationWrapper from '../components/ErrorNotificationWrapper';
import NotificationTypes from '../constants/NotificationTypes';
import NotificationsContext from '../contexts/NotificationsContext';

const useErrorMessage = (show = false, msg = null) => {
  const { showNotification, removeNotification } = useContext(
    NotificationsContext
  );
  const [notification, setNotification] = useState(null);
  const message = <ErrorNotificationWrapper>{msg}</ErrorNotificationWrapper>;
  useEffect(() => {
    if (show) {
      setNotification(
        showNotification({
          message,
          type: NotificationTypes.ERROR,
        })
      );
    } else if (notification) {
      removeNotification(notification.id);
    }
  }, [show]);
};

export default useErrorMessage;
