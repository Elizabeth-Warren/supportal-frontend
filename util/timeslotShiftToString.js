import { utcToZonedTime, format } from 'date-fns-tz';

const timeslotShiftToString = (timeslot, timeZone) => {
  const start = new Date(timeslot.start_date * 1000);
  const end = new Date(timeslot.end_date * 1000);
  return `${format(utcToZonedTime(start, timeZone), 'EEEE, MMMM d, yyyy, ha', {
    timeZone,
  })} - ${format(utcToZonedTime(end, timeZone), `ha zzz`, { timeZone })}`;
};

export default timeslotShiftToString;
