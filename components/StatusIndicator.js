import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import UserActivityStatuses from '../constants/UserActivityStatuses';

const StatusIndicator = ({ status }) => {
  const indicatorClasses = [
    'h-2',
    'inline-block',
    'mr-1',
    'rounded-full',
    'w-2',
  ];
  switch (status) {
    case UserActivityStatuses.ACTIVE:
      indicatorClasses.push('bg-liberty');
      break;
    case UserActivityStatuses.INACTIVE:
      indicatorClasses.push('bg-red');
      break;
    case UserActivityStatuses.CHURNING:
      indicatorClasses.push('bg-yellow');
      break;
    case UserActivityStatuses.NEW:
      indicatorClasses.push('bg-grey');
      break;
    default:
      indicatorClasses.push('hidden');
      break;
  }
  const label = capitalize(
    get(
      Object.entries(UserActivityStatuses).find(entry => entry[1] === status),
      '0',
      'None'
    )
  );
  return (
    <span>
      <span className={indicatorClasses.join(' ')} />
      <span>{label}</span>
    </span>
  );
};

StatusIndicator.propTypes = {
  status: PropTypes.oneOf(Object.values(UserActivityStatuses)).isRequired,
};

export default StatusIndicator;
