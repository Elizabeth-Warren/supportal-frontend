import PropTypes from 'prop-types';
import compact from 'lodash/compact';
import get from 'lodash/get';
import MultiSelectInput from '../../MultiSelectInput';
import getEventAddressString from '../../../util/getEventAddressString';
import timeslotShiftToString from '../../../util/timeslotShiftToString';
import {
  MobilizeEventType,
  MobilizeTimeslotType,
} from '../../../constants/types';

const EventSearchResult = ({
  className,
  mobilizeEvent,
  onShiftChange,
  selectedShifts,
}) => {
  const { timeslots, timezone, title } = mobilizeEvent;
  const addressString = getEventAddressString(mobilizeEvent);

  const handleChange = e => {
    const result = e
      ? e.map(({ value }) => timeslots.find(item => `${item.id}` === value))
      : [];
    onShiftChange(compact(result));
  };

  const selectOptions = [
    ...timeslots.map(item => ({
      label: timeslotShiftToString(item, timezone),
      value: `${item.id}`,
    })),
  ];

  const value = selectedShifts.map(shift => `${shift.id}`);

  return (
    <div className={className}>
      <div className="font-bold mb-4 text-md">{title}</div>
      {addressString && <p className="mb-4">{addressString}</p>}
      <MultiSelectInput
        id="event-shift-select"
        label="Select one or more shifts"
        options={selectOptions}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};

EventSearchResult.propTypes = {
  className: PropTypes.string,
  mobilizeEvent: MobilizeEventType.isRequired,
  onShiftChange: PropTypes.func,
  selectedShifts: PropTypes.arrayOf(MobilizeTimeslotType),
};

EventSearchResult.defaultProps = {
  className: '',
  onShiftChange: () => {},
  selectedShifts: [],
};

export default EventSearchResult;
