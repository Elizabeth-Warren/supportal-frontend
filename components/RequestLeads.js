import get from 'lodash/get';
import { Button } from '@ewarren/persist';
import { useContext, useState } from 'react';
import LeadsContext from '../contexts/LeadsContext';
import MobilizeContext from '../contexts/MobilizeContext';
import RadioGroup from './RadioGroup';

const RequestLeads = () => {
  const { assignLeads, leads } = useContext(LeadsContext);
  const { mobilizeEvent } = useContext(MobilizeContext);
  const [requestNear, setRequestNear] = useState('user');
  const location = get(mobilizeEvent, 'location.location', null);

  const handleClick = () => {
    const params = {};
    if (requestNear === 'event' && location) {
      params.location = location;
    }
    assignLeads(params);
  };

  return (
    <>
      {location && (
        <RadioGroup
          options={[
            {
              label: 'Find volunteers near me',
              value: 'user',
            },
            {
              label: 'Find volunteers near event',
              value: 'event',
            },
          ]}
          onChange={e => {
            setRequestNear(e.target.value);
          }}
          name="request_location"
          selected={requestNear}
        />
      )}
      <Button
        onClick={handleClick}
        className="w-full"
        data-tracking="btn-request-prospects"
        type="button"
      >
        Request{leads.length ? ' more ' : ' '}prospects
      </Button>
    </>
  );
};

export default RequestLeads;
