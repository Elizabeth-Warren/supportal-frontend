import PropTypes from 'prop-types';
import compact from 'lodash/compact';
import { TextLink } from '@ewarren/persist';
import React, { useEffect } from 'react';
import timeslotShiftToString from '../../../util/timeslotShiftToString';
import validateShiftObject from '../../../util/validateShiftObject';
import { MobilizeEventType } from '../../../constants/types';

const SelectionSummary = ({ className, mobilizeEvents, onBack, shifts }) => {
  const selectedEvents = compact(
    Object.entries(shifts).map(([eventId, shiftIds]) => {
      const event = mobilizeEvents.find(item => `${item.id}` === eventId);
      return event
        ? {
            ...event,
            timeslots: event.timeslots.filter(shift =>
              shiftIds.includes(shift.id)
            ),
          }
        : null;
    })
  );

  useEffect(() => {
    if (!selectedEvents.length) {
      onBack();
    }
  }, [selectedEvents]);

  return (
    <div className={className}>
      <div className="flex items-baseline">
        <p className="font-bold text-md">Signing up for:</p>
        {onBack && (
          <TextLink
            as="button"
            type="button"
            className="ml-auto"
            onClick={onBack}
            level="tertiary"
          >
            Edit
          </TextLink>
        )}
      </div>
      <dl>
        {selectedEvents.map(event => (
          <React.Fragment key={event.id}>
            <dt className="font-bold mt-4">{event.title}</dt>
            {event.timeslots.map(timeslot => (
              <dd key={timeslot.id} className="text-sm">
                {timeslotShiftToString(timeslot, event.timezone)}
              </dd>
            ))}
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
};

SelectionSummary.propTypes = {
  className: PropTypes.string,
  mobilizeEvents: PropTypes.arrayOf(MobilizeEventType),
  onBack: PropTypes.func,
  shifts: validateShiftObject,
};

SelectionSummary.defaultProps = {
  className: '',
  mobilizeEvents: [],
  onBack: null,
  shifts: {},
};

export default SelectionSummary;
