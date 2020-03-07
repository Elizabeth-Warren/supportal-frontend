/* eslint-disable react/jsx-props-no-spreading */
// We're intentionally disabling props spreading here to allow for a catch-all
// of input-related attributes.
import PropTypes from 'prop-types';
import Chevron, {
  ChevronDirections,
} from '@ewarren/persist/lib/components/Chevron';
import mapOptions from '../util/mapOptions';
import { Themes } from '../constants/formElements';

const SelectInput = ({
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
  const inputClassNames = [
    'appearance-none',
    'bg-transparent',
    'block',
    'border-2',
    'font-bold',
    'pl-2',
    'pr-8',
    'py-2',
    'relative',
    'rounded-none',
    'w-full',
    'z-10',
  ];
  if (error) {
    inputClassNames.push('border-brightRed');
    if (theme === Themes.INVERTED) {
      inputClassNames.push('text-white');
    }
  } else if (theme === Themes.INVERTED) {
    inputClassNames.push('border-white', 'text-white');
  } else {
    inputClassNames.push('border-navy', 'text-navy');
  }
  const mappedOptions = mapOptions(options);
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
        <select
          className={inputClassNames.join(' ')}
          value={value}
          id={id}
          onChange={onChange}
          aria-invalid={!!error}
          {...other}
        >
          {mappedOptions.map(item => (
            <option value={item.value} key={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <div className="absolute flex items-center inset-y-0 right-0 mr-4 text-lg">
          <Chevron direction={ChevronDirections.DOWN} />
        </div>
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

SelectInput.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  theme: PropTypes.oneOf(Object.values(Themes)),
  type: PropTypes.string,
  value: PropTypes.string,
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

SelectInput.defaultProps = {
  className: '',
  error: null,
  onChange: () => {},
  label: null,
  theme: Themes.DEFAULT,
  type: 'text',
  value: '',
  options: [],
};

export default SelectInput;
