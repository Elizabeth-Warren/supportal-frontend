import isTimeslotInFuture from './isTimeslotInFuture';

const hasFutureTimeslots = event => {
  return (
    event.timeslots
      .map(timeslot => timeslot.start_date)
      .filter(slot => isTimeslotInFuture(slot) && !slot.is_full).length > 0
  );
};

export default hasFutureTimeslots;
