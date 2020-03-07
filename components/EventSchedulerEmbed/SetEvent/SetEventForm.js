import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import compact from 'lodash/compact';
import get from 'lodash/get';
import EventSearchField from '../../EventSearchField';
import EventSignUp from '../EventSignUp';
import MobilizeContext from '../../../contexts/MobilizeContext';
import SetEventResults from './SetEventResults';
import scrollToContentTop from '../../../util/scrollToContentTop';

const SetEventForm = () => {
  const { fetchEvent, mobilizeEvent } = useContext(MobilizeContext);
  const [initialValue, setInitialValue] = useState('');
  const [selectedShifts, setSelectedShifts] = useState([]);
  const { query } = useRouter();

  const handleShiftChange = e => {
    setSelectedShifts(e);
  };

  useEffect(() => {
    // When a user selects an event, if that event only has one timeslot we
    // can go ahead and set that.
    const timeslots = get(mobilizeEvent, 'timeslots', []);
    if (timeslots.length === 1) {
      setSelectedShifts([...timeslots]);
    }
  }, [mobilizeEvent]);

  useEffect(() => {
    if (!query.event) return;
    (async () => {
      const event = await fetchEvent(query.event);
      if (event) {
        setInitialValue(event.browser_url);

        // For backwards compatibility.
        const shiftsParam = query.shifts || query.shift;

        if (shiftsParam) {
          const shifts = [];
          shiftsParam.split(',').forEach(shiftId => {
            const shift = event.timeslots.find(
              timeslot => `${timeslot.id}` === shiftId
            );
            shifts.push(shift);
          });
          setSelectedShifts(compact(shifts));
        }
      }
    })();
  }, [query]);

  const handleSubmit = () => {
    scrollToContentTop();
  };

  return (
    <div>
      <EventSearchField initialValue={initialValue} />
      {mobilizeEvent && (
        <SetEventResults
          className="mt-8"
          mobilizeEvent={mobilizeEvent}
          onShiftChange={handleShiftChange}
          selectedShifts={selectedShifts}
        />
      )}
      {mobilizeEvent && !!selectedShifts.length && (
        <EventSignUp
          className="mt-8"
          shifts={{ [mobilizeEvent.id]: selectedShifts.map(shift => shift.id) }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default SetEventForm;
