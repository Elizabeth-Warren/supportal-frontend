import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MobilizeProvider from '../MobilizeProvider';
import MultiMobilizeProvider from '../MultiMobilizeProvider';
import SearchEventForm from './SearchEvent/SearchEventForm';
import SetEventForm from './SetEvent/SetEventForm';
import TabList from '../TabList';

const SET = 'set';
const SEARCH = 'search';

const tabOptions = [
  {
    value: SET,
    label: 'Set Event',
  },
  {
    value: SEARCH,
    label: 'Search Event',
  },
];

const EventScheduler = () => {
  const [selectedTab, setSelectedTab] = useState('set');
  const { query } = useRouter();

  const handleTabChange = e => {
    setSelectedTab(e.target.value);
  };

  useEffect(() => {
    if (query.zip && !query.event) {
      setSelectedTab(SEARCH);
    }
  }, [query]);

  return (
    <div>
      <TabList
        name="event-method"
        className="mb-4"
        onChange={handleTabChange}
        options={tabOptions}
        value={selectedTab}
      />
      {selectedTab === SET && (
        <MobilizeProvider>
          <SetEventForm />
        </MobilizeProvider>
      )}
      {selectedTab === SEARCH && (
        <MultiMobilizeProvider>
          <SearchEventForm />
        </MultiMobilizeProvider>
      )}
    </div>
  );
};

export default EventScheduler;
