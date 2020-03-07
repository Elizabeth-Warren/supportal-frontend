import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import EventSignUp from '../EventSignUp';
import MultiMobilizeContext from '../../../contexts/MultiMobilizeContext';
import SearchEventFilters from './SearchEventFilters';
import SearchEventResults from './SearchEventResults';
import SelectionSummary from './SelectionSummary';
import scrollToContentTop from '../../../util/scrollToContentTop';

const Views = Object.freeze({
  SHIFTS: 'SHIFTS',
  SIGNUP: 'SIGNUP',
});

const SearchEventForm = () => {
  const [initialValue, setInitialValue] = useState(null);
  const [activeSearchView, setActiveSearchView] = useState(Views.SHIFTS);
  const { hasAttemptedFetch, mobilizeEvents, selectedShifts } = useContext(
    MultiMobilizeContext
  );
  const { query } = useRouter();

  useEffect(() => {
    const { zip, filter, sl } = query;
    if (zip) {
      const newInitialValue = {
        zip,
        filter: filter ? filter.toUpperCase() : 'ALL',
        stagingLocation: !!sl || false,
      };
      setInitialValue(newInitialValue);
    }
  }, [query]);

  const handleSubmit = () => {
    setActiveSearchView(Views.SHIFTS);
    scrollToContentTop();
  };

  return (
    <div>
      <SearchEventFilters initialValue={initialValue} className="mb-8" />
      {hasAttemptedFetch && (
        <>
          <div
            style={{
              display: activeSearchView === Views.SHIFTS ? 'block' : 'none',
            }}
          >
            <SearchEventResults
              onSubmit={() => setActiveSearchView(Views.SIGNUP)}
            />
          </div>
          <div
            style={{
              display: activeSearchView === Views.SIGNUP ? 'block' : 'none',
            }}
          >
            <SelectionSummary
              className="border-b-1 border-t-1 border-grey mb-8 py-4"
              mobilizeEvents={mobilizeEvents}
              shifts={selectedShifts}
              onBack={() => setActiveSearchView(Views.SHIFTS)}
            />
            <EventSignUp shifts={selectedShifts} onSubmit={handleSubmit} />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchEventForm;
