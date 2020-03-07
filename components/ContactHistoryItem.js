import compact from 'lodash/compact';
import format from 'date-fns/format';
import { useEffect, useState } from 'react';
import api from '../services/api';
import timeslotShiftToString from '../util/timeslotShiftToString';
import { DECLINED, Successful } from '../constants/leadStatuses';
import { VolProspectContactEventType } from '../constants/types';

const ContactHistoryItem = ({ contactEvent }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      let msg = '';
      if (!contactEvent.ma_event_id) {
        msg +=
          contactEvent.metadata.status === DECLINED
            ? 'Had a conversation with'
            : Successful[contactEvent.metadata.status];
      } else {
        const { data } = await api.get(
          `/shifter/events/${contactEvent.ma_event_id}`
        );
        const timeslots = contactEvent.ma_timeslot_ids.map(id => {
          const timeslot = data.timeslots.find(item => item.id === id);
          return timeslot
            ? timeslotShiftToString(timeslot, data.timezone)
            : null;
        });
        msg += `Scheduled for ${data.title} for ${compact(timeslots).join(
          ', '
        )}`;
      }
      msg += ` by you on ${format(
        new Date(contactEvent.created_at),
        'MM/dd/yy'
      )}`;
      setMessage(msg);
    })();
  }, []);

  return (
    <>
      {message}
      {contactEvent.note && (
        <p className="mt-1">
          <b>Notes:</b> {contactEvent.note}
        </p>
      )}
    </>
  );
};

ContactHistoryItem.propTypes = {
  contactEvent: VolProspectContactEventType.isRequired,
};

export default ContactHistoryItem;
