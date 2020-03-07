import PropTypes from 'prop-types';
import { VisuallyHidden } from '@ewarren/persist';
import NotificationTypes from '../constants/NotificationTypes';

const NotificationItem = ({
  className,
  message,
  dismissable,
  type,
  onDismiss,
}) => {
  const containerClasses = [className, 'py-2', 'px-4'];
  switch (type) {
    case NotificationTypes.ERROR:
      containerClasses.push('bg-red', 'text-white');
      break;
    case NotificationTypes.WARNING:
      containerClasses.push('bg-yellow', 'text-black');
      break;
    default:
      containerClasses.push('bg-lightLiberty', 'text-black');
      break;
  }
  return (
    <div role="alert" className={containerClasses.join(' ')}>
      <div className="m-auto max-w-section flex items-start">
        <div className="flex-grow">{message}</div>
        {dismissable && (
          <button className="flex-shrink-0 " type="button" onClick={onDismiss}>
            <b aria-hidden>&times;</b>
            <VisuallyHidden>Close</VisuallyHidden>
          </button>
        )}
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node.isRequired,
  type: PropTypes.oneOf(Object.values(NotificationTypes)),
  dismissable: PropTypes.bool,
  onDismiss: PropTypes.func,
};

NotificationItem.defaultProps = {
  className: '',
  type: NotificationTypes.DEFAULT,
  dismissable: true,
  onDismiss: () => {},
};

export default NotificationItem;
