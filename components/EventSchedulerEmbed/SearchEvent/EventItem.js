import PropTypes from 'prop-types';
import Accordion from '../../Accordion';
import CheckboxGroup from '../../CheckboxGroup';
import getEventAddressString from '../../../util/getEventAddressString';
import isTimeslotInFuture from '../../../util/isTimeslotInFuture';
import timeslotRangeToString from '../../../util/timeslotRangeToString';
import timeslotShiftToString from '../../../util/timeslotShiftToString';
import { MobilizeEventType } from '../../../constants/types';

const EventItem = ({ mobilizeEvent, selected, onChange }) => {
  const { id, timezone, timeslots, title } = mobilizeEvent;
  const accordionTitle = (
    <div className="text-sm">
      <div className="font-bold text-md">{title}</div>
      {getEventAddressString(mobilizeEvent) && (
        <div>{getEventAddressString(mobilizeEvent)}</div>
      )}
      <div>{timeslotRangeToString(timeslots, timezone)}</div>
    </div>
  );
  const timeslotOptions = timeslots
    .filter(timeslot => isTimeslotInFuture(timeslot.start_date))
    .map(timeslot => ({
      label: timeslotShiftToString(timeslot, timezone),
      value: `${timeslot.id}`,
    }));

  return (
    <Accordion
      className="border-t-1 border-grey"
      indicatorClassName="text-xl"
      title={accordionTitle}
      id={`event-${id}`}
    >
      <div className="px-6 md:px-12 py-3">
        <CheckboxGroup
          name={`${id}`}
          onChange={onChange}
          selected={selected.map(item => `${item}`)}
          options={timeslotOptions}
        />
      </div>
    </Accordion>
  );
};

EventItem.propTypes = {
  mobilizeEvent: MobilizeEventType.isRequired,
  onChange: PropTypes.func,
  selected: PropTypes.arrayOf(PropTypes.number),
};

EventItem.defaultProps = {
  onChange: () => {},
  selected: [],
};

export default EventItem;
