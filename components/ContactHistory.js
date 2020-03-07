import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import ContactHistoryItem from './ContactHistoryItem';
import { VolProspectContactEventType } from '../constants/types';

const ContactHistory = ({ events }) => {
  const sortedEvents = sortBy(events, 'created_at')
    .filter(item => item.metadata && item.result_category === 'SUCCESSFUL')
    .reverse();

  return (
    <ul>
      {sortedEvents.map((item, i) => (
        <li className={i !== 0 ? 'mt-6' : ''} key={item.id || item.created_at}>
          <ContactHistoryItem contactEvent={item} />
        </li>
      ))}
    </ul>
  );
};

ContactHistory.propTypes = {
  events: PropTypes.arrayOf(VolProspectContactEventType),
};

ContactHistory.defaultProps = {
  events: [],
};

export default ContactHistory;
