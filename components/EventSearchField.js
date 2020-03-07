import Button, { ButtonLevels } from '@ewarren/persist/lib/components/Button';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import MobilizeContext from '../contexts/MobilizeContext';
import TextInput from './TextInput';
import { Themes } from '../constants/formElements';

const parseInput = input =>
  input.split('/').find(segment => !Number.isNaN(parseInt(segment, 10)));

const EventSearchField = ({ className, initialValue, showClear, theme }) => {
  const { fetchEvent, error, isBusy } = useContext(MobilizeContext);
  const [input, setInput] = useState(initialValue);
  const eventId = parseInput(input);

  const handleInput = e => {
    setInput(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isBusy || !eventId) return;
    fetchEvent(eventId);
  };

  useEffect(() => {
    if (initialValue) setInput(initialValue);
  }, [initialValue]);

  return (
    <form onSubmit={handleSubmit} className={`${className} flex flex-col`}>
      <div className="flex flex-wrap items-end -mx-1">
        <TextInput
          id="event-search-input"
          label="Event link:"
          value={input}
          onChange={handleInput}
          error={error}
          className="flex-grow mx-1"
          theme={theme}
        />
        <Button
          level={ButtonLevels.QUATERNARY}
          type="submit"
          style={{ paddingBottom: '6px' }}
          className={[
            theme === Themes.INVERTED ? 'hover:text-white' : '',
            'mt-2',
            'mx-1',
            'w-full',
            'sm:w-auto',
            'whitespace-no-wrap',
          ].join(' ')}
          disabled={!eventId || isBusy}
        >
          {isBusy ? 'Loading…' : 'Set Event'}
        </Button>
      </div>
      {showClear && (
        <button
          className="mt-4 ml-auto"
          type="button"
          onClick={() => {
            fetchEvent();
            setInput('');
          }}
        >
          <span aria-hidden className="font-bold mr-1 text-lg">
            &times;
          </span>
          Clear results
        </button>
      )}
    </form>
  );
};

EventSearchField.propTypes = {
  className: PropTypes.string,
  initialValue: PropTypes.string,
  showClear: PropTypes.bool,
  theme: PropTypes.string,
};

EventSearchField.defaultProps = {
  className: '',
  initialValue: '',
  showClear: false,
  theme: Themes.DEFAULT,
};

export default EventSearchField;
