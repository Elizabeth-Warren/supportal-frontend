import { utcToZonedTime, format } from 'date-fns-tz';
import pluralize from './pluralize';

const timeslotRangeToString = (timeslots, timeZone) => {
  const firstDate = format(
    utcToZonedTime(new Date(timeslots[0].start_date * 1000), timeZone),
    'MMMM d',
    { timeZone }
  );
  const lastDate = format(
    utcToZonedTime(
      new Date(timeslots[timeslots.length - 1].end_date * 1000),
      timeZone
    ),
    'MMMM d',
    { timeZone }
  );

  let str = `${timeslots.length} `;
  str += pluralize('time', timeslots.length);
  if (firstDate === lastDate) {
    str += ' on ';
  } else {
    str += ' between ';
  }
  str += firstDate;
  if (firstDate !== lastDate) {
    str += ' and ';
    str += lastDate;
  }
  return str;
};

export default timeslotRangeToString;
