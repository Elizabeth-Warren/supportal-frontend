import PropTypes from 'prop-types';
import theme from '@ewarren/persist/lib/theme';
import { Button, Chevron } from '@ewarren/persist';
import { useContext, useEffect, useState } from 'react';
import AnnularThrobber from '../../AnnularThrobber';
import EventItem from './EventItem';
import MultiMobilizeContext from '../../../contexts/MultiMobilizeContext';

const PER_PAGE = 3;

const SearchEventResults = ({ onSubmit }) => {
  const {
    isBusy,
    mobilizeEvents,
    selectedShifts,
    setSelectedShifts,
  } = useContext(MultiMobilizeContext);
  const [page, setPage] = useState(0);
  const [localSelectedShifts, setLocalSelectedShifts] = useState({
    ...selectedShifts,
  });

  const handleChange = e => {
    const { checked, name, value } = e.target;
    const slotId = parseInt(value, 10);
    const newShifts = { ...localSelectedShifts };
    newShifts[name] = localSelectedShifts[name] || [];
    if (checked) {
      newShifts[name].push(slotId);
    } else {
      newShifts[name] = newShifts[name].filter(item => item !== slotId);
    }
    if (!newShifts[name].length) {
      delete newShifts[name];
    }
    setLocalSelectedShifts(newShifts);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSelectedShifts(localSelectedShifts);
    onSubmit();
  };

  useEffect(() => {
    setPage(0);
    const newShifts = { ...selectedShifts };
    Object.keys(newShifts).forEach(key => {
      if (!mobilizeEvents.find(event => `${event.id}` === `${key}`)) {
        delete newShifts[key];
      }
    });
    setLocalSelectedShifts(newShifts);
    setSelectedShifts(newShifts);
  }, [mobilizeEvents]);

  return isBusy ? (
    <div className="bg-white p-8">
      <AnnularThrobber className="m-auto" background={theme.colors.white} />
    </div>
  ) : (
    <form onSubmit={handleSubmit}>
      {!mobilizeEvents.length && <p className="mb-4">No available events.</p>}
      {mobilizeEvents.slice(0, (page + 1) * PER_PAGE).map(event => (
        <EventItem
          key={event.id}
          mobilizeEvent={event}
          onChange={handleChange}
          selected={localSelectedShifts[`${event.id}`] || []}
        />
      ))}
      <div className="bg-white border-t-1 border-grey bottom-0 flex items-center py-4 sticky">
        {mobilizeEvents.length > (page + 1) * PER_PAGE && (
          <button
            className="font-bold"
            type="button"
            onClick={() => setPage(page + 1)}
          >
            More results
            <span className="ml-2 text-red">
              <Chevron direction="down" />
            </span>
          </button>
        )}
        <Button
          className="ml-auto"
          disabled={!Object.keys(localSelectedShifts).length}
          size="sm"
          type="submit"
        >
          Select shifts
        </Button>
      </div>
    </form>
  );
};

SearchEventResults.propTypes = {
  onSubmit: PropTypes.func,
};

SearchEventResults.defaultProps = {
  onSubmit: () => {},
};

export default SearchEventResults;
