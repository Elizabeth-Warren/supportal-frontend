import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useState } from 'react';
import api from '../services/api';
import MobilizeContext from '../contexts/MobilizeContext';
import hasFutureTimeslots from '../util/hasFutureTimeslots';

const MobilizeProvider = ({ children }) => {
  const [mobilizeEvent, setMobilizeEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const fetchEvent = async id => {
    let result = null;
    setError(null);
    if (id) {
      setIsBusy(true);
      try {
        const { data } = await api.get(`/shifter/events/${id}`);
        if (!hasFutureTimeslots(data)) {
          throw new Error('This event already happened.');
        }
        result = data;
      } catch (err) {
        result = null;
        const message = get(err, 'response.data.detail', err.message);
        setError(message);
      } finally {
        setIsBusy(false);
      }
    }
    setMobilizeEvent(result);
    return result;
  };
  return (
    <MobilizeContext.Provider
      value={{
        error,
        fetchEvent,
        isBusy,
        mobilizeEvent,
      }}
    >
      {children}
    </MobilizeContext.Provider>
  );
};

MobilizeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MobilizeProvider;
