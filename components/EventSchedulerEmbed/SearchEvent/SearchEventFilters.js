import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import CheckboxInput from '../../CheckboxInput';
import MultiMobilizeContext from '../../../contexts/MultiMobilizeContext';
import TabList from '../../TabList';
import TextInput from '../../TextInput';

const filterOptions = Object.freeze([
  {
    value: 'ALL',
    label: 'All',
  },
  {
    value: 'CANVASS',
    label: 'Canvass',
  },
  {
    value: 'PHONE_BANK',
    label: 'Phone bank',
  },
  {
    value: 'MEET_GREET',
    label: 'Principal',
  },
]);

const SearchEventFilters = ({ className, initialValue }) => {
  const [formState, setFormState] = useState({
    zip: '',
    filter: 'ALL',
    stagingLocation: false,
  });
  const { fetchEvents } = useContext(MultiMobilizeContext);

  const handleChange = e => {
    setFormState({
      ...formState,
      [e.target.name]:
        e.target.type === 'checkbox' ? !!e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async e => {
    if (e) {
      e.preventDefault();
    }
    if (
      formState.zip.length !== 5 ||
      Number.isNaN(parseInt(formState.zip, 10))
    ) {
      return;
    }
    const params = { zip5: formState.zip };
    if (formState.filter !== 'ALL') params.event_types = formState.filter;
    if (formState.filter === 'MEET_GREET') {
      params.tag_ids = '100';
    } else if (formState.stagingLocation) {
      params.tag_ids = '34,35';
    }
    await fetchEvents(params);
  };

  useEffect(() => {
    if (initialValue) {
      setFormState({ ...formState, ...initialValue });
    }
  }, [initialValue]);

  useEffect(() => {
    handleSubmit();
  }, [formState]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`${className} flex flex-col items-start`}
    >
      <TextInput
        id="search-event-zip"
        className="mb-4"
        label="Zip code:"
        value={formState.zip}
        onChange={handleChange}
        name="zip"
        maxLength="5"
        pattern="[0-9]{5}"
      />
      <TabList
        label="Filter:"
        name="filter"
        className="mb-6"
        onChange={handleChange}
        options={filterOptions}
        value={formState.filter}
      />
      <CheckboxInput
        id="search-event-sl"
        label="Staging location"
        checked={formState.stagingLocation}
        name="stagingLocation"
        value="34,35"
        onChange={handleChange}
      />
    </form>
  );
};

SearchEventFilters.propTypes = {
  className: PropTypes.string,
  initialValue: PropTypes.shape({
    zip: PropTypes.string,
    filter: PropTypes.string,
    stagingLocation: PropTypes.bool,
  }),
};

SearchEventFilters.defaultProps = {
  className: '',
  initialValue: null,
};

export default SearchEventFilters;
