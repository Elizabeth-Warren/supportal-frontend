import { utcToZonedTime, format } from 'date-fns-tz';
import getEventAddressString from '../util/getEventAddressString';
import timeslotShiftToString from '../util/timeslotShiftToString';
import { MobilizeEventType } from '../constants/types';

const LeadsLayoutHeaderEvent = ({ mobilizeEvent }) => {
  const { timeslots, title, timezone: timeZone } = mobilizeEvent;
  const addressString = getEventAddressString(mobilizeEvent);

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

  return (
    <div>
      <h2 className="mb-4 font-bold leading-none text-2xl">{title}</h2>
      <address className="not-italic">{addressString}</address>
      <p>
        {firstDate === lastDate ? (
          timeslotShiftToString(timeslots[0], timeZone)
        ) : (
          <>
            {timeslots.length} times between{' '}
            <span className="whitespace-no-wrap">{firstDate}</span> and{' '}
            <span className="whitespace-no-wrap">{lastDate}</span>
          </>
        )}
      </p>
    </div>
  );
};

LeadsLayoutHeaderEvent.propTypes = {
  mobilizeEvent: MobilizeEventType.isRequired,
};

export default LeadsLayoutHeaderEvent;
