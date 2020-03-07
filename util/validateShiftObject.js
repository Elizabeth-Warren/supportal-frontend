import isArray from 'lodash/isArray';
import isInteger from 'lodash/isInteger';

const validateShiftObject = props => {
  // Shifts should be a hash map where the keys are valid mobilize event IDs,
  // and their values are valid timeslot IDs for that event.
  const { shifts } = props;
  if (!shifts) {
    return new Error('A shift prop is required.');
  }
  if (typeof shifts !== 'object') {
    return new Error(
      `The shift prop expects an object. Received a ${typeof shifts}`
    );
  }
  /* eslint-disable consistent-return */
  Object.entries(shifts).forEach(([key, slotIds]) => {
    if (!isArray(slotIds)) {
      return new Error(`The value for ${key} should be an array`);
    }
    if (!isInteger(parseInt(key, 10))) {
      return new Error(`${key} is not a valid MA event ID`);
    }
    slotIds.forEach(slotId => {
      if (!isInteger(slotId)) {
        return new Error(
          `Slot IDs should be integers. Recieved a ${typeof slotId}`
        );
      }
    });
  });
  /* eslint-enable consistent-return */
  return null;
};

export default validateShiftObject;
