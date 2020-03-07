import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useState } from 'react';
import api from '../services/api';
import MultiMobilizeContext from '../contexts/MultiMobilizeContext';
import hasFutureTimeslots from '../util/hasFutureTimeslots';

const MultiMobilizeProvider = ({ children }) => {
  const [mobilizeEvents, setMobilizeEvents] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState({});
  const [error, setError] = useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const fetchEvents = async initialParams => {
    setIsBusy(true);
    setError(null);
    if (!hasAttemptedFetch) setHasAttemptedFetch(true);
    try {
      const params = {
        limit: 20,
        strategy: 'shifter_engine',
        ...initialParams,
      };
      const { data } = (
        await api.get('/shifter/recommended_events', { params })
      ).data;
      const result = data.filter(item => hasFutureTimeslots(item));
      setMobilizeEvents(result);
    } catch (err) {
      const message = get(err, 'response.data.detail', err.message);
      setError(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <MultiMobilizeContext.Provider
      value={{
        error,
        fetchEvents,
        hasAttemptedFetch,
        isBusy,
        mobilizeEvents,
        selectedShifts,
        setSelectedShifts,
      }}
    >
      {children}
    </MultiMobilizeContext.Provider>
  );
};

MultiMobilizeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MultiMobilizeProvider;
