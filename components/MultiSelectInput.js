/* eslint-disable react/jsx-props-no-spreading */
// We're intentionally disabling props spreading here to allow for a catch-all
// of input-related attributes.
import PropTypes from 'prop-types';
import Select from 'react-select';
import persist from '@ewarren/persist/lib/theme';
import mapOptions from '../util/mapOptions';
import { Themes } from '../constants/formElements';

const MultiSelectInput = ({
  className,
  error,
  onChange,
  id,
  label,
  theme,
  value,
  options,
  ...other
}) => {
  const inputClassNames = ['font-bold', 'w-full'];
  let borderColor = persist.colors.navy;
  if (error) {
    borderColor = persist.colors.brightRed;
    if (theme === Themes.INVERTED) {
      inputClassNames.push('text-white');
    }
  } else if (theme === Themes.INVERTED) {
    borderColor = persist.colors.white;
    inputClassNames.push('text-white');
  } else {
    inputClassNames.push('text-navy');
  }

  const mappedOptions = mapOptions(options);
  const selectedValues = value.map(val =>
    mappedOptions.find(item => item.value === val)
  );

  const inputStyles = {
    control: styles => ({
      ...styles,
      border: `2px solid ${borderColor}`,
      borderRadius: 0,
    }),
    dropdownIndicator: styles => ({ ...styles, color: persist.colors.navy }),
  };

  return (
    <label className={[className, 'block'].join(' ')} htmlFor={id}>
      {(label || error) && (
        <div className="flex mb-2 flex-wrap items-baseline">
          {label && <div className="mr-4 text-base">{label}</div>}
          {error && <div className="text-brightRed text-sm">{error}</div>}
        </div>
      )}
      <div
        className={[
          theme === Themes.INVERTED ? 'bg-transparent' : 'bg-white',
          'relative',
          'select-container',
        ].join(' ')}
      >
        <Select
          className={inputClassNames.join(' ')}
          value={selectedValues}
          id={id}
          onChange={onChange}
          aria-invalid={!!error}
          options={mappedOptions}
          isMulti
          styles={inputStyles}
          {...other}
        />
        {error && (
          <b
            className="text-brightRed text-xl leading-none absolute mr-4"
            style={{ right: 0, top: '50%', marginTop: '-0.65em' }}
            aria-hidden
          >
            &times;
          </b>
        )}
      </div>
    </label>
  );
};

MultiSelectInput.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  theme: PropTypes.oneOf(Object.values(Themes)),
  type: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
    ])
  ),
};

MultiSelectInput.defaultProps = {
  className: '',
  error: null,
  onChange: () => {},
  label: null,
  theme: Themes.DEFAULT,
  type: 'text',
  value: '',
  options: [],
};

export default MultiSelectInput;
