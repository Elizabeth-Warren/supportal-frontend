import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import mapOptions from '../util/mapOptions';

const TabList = ({
  className,
  error,
  label,
  name,
  onChange,
  options,
  value,
}) => {
  const mappedOptions = mapOptions(options);
  return mappedOptions.length ? (
    <div className={className}>
      {(label || error) && (
        <div className="flex mb-2 flex-wrap items-baseline">
          {label && <div className="mr-4 text-base">{label}</div>}
          {error && <div className="text-brightRed text-sm">{error}</div>}
        </div>
      )}
      <ul className="flex flex-wrap text-sm -mx-1 -my-1">
        {mappedOptions.map(item => {
          const elId = kebabCase(`${name}-tab-${item.value}`);
          const isChecked = value === item.value;
          return (
            <li key={item.value} className="mx-1 my-1">
              <label
                htmlFor={elId}
                className={`${
                  isChecked ? 'bg-liberty' : 'bg-grey'
                } hover:bg-liberty block px-4 py-1 text-center w-full`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  id={elId}
                  name={name}
                  value={item.value}
                  checked={isChecked}
                  onChange={onChange}
                />
                {item.label}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
};

TabList.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string,
      }),
    ])
  ),
  value: PropTypes.string,
};

TabList.defaultProps = {
  className: '',
  error: null,
  label: null,
  onChange: () => {},
  options: [],
  value: null,
};

export default TabList;
