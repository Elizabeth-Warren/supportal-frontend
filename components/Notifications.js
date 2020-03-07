import PropTypes from 'prop-types';
import { useContext } from 'react';
import NotificationItem from './NotificationItem';
import NotificationsContext from '../contexts/NotificationsContext';

const Notifications = ({ className }) => {
  const { notifications, removeNotification } = useContext(
    NotificationsContext
  );
  return (
    !!notifications.length && (
      <div className={className}>
        {notifications.map(item => (
          <NotificationItem
            key={item.id}
            message={item.message}
            type={item.type}
            dismissable={item.dismissable}
            onDismiss={() => removeNotification(item.id)}
          />
        ))}
      </div>
    )
  );
};

Notifications.propTypes = {
  className: PropTypes.string,
};

Notifications.defaultProps = {
  className: '',
};

export default Notifications;
