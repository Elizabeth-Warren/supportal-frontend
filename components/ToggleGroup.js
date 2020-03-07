/**
 * @fileoverview
 * Outputs either a group of checkboxes, or a group of radio buttons. Don't use
 * this component directly. Instead use, RadioGroup or CheckboxGroup.
 */
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import CheckboxInput from './CheckboxInput';
import RadioInput from './RadioInput';
import mapOptions from '../util/mapOptions';
import { InputTypes } from '../constants/formElements';

const { RADIO, CHECKBOX } = InputTypes;

const ToggleGroup = ({ disabled, name, options, onChange, selected, type }) => {
  const mappedOptions = mapOptions(options);
  const Component = type === RADIO ? RadioInput : CheckboxInput;
  return (
    <>
      {mappedOptions.map(({ label, value }) => {
        const elId = kebabCase(`${name}-${type}-${value}`);
        const checked =
          type === RADIO ? selected === value : selected.includes(value);
        return (
          <Component
            key={elId}
            className="mb-3"
            id={elId}
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            label={label}
          />
        );
      })}
    </>
  );
};

ToggleGroup.propTypes = {
  disabled: PropTypes.bool,
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
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  type: PropTypes.oneOf([RADIO, CHECKBOX]).isRequired,
};

ToggleGroup.defaultProps = {
  disabled: false,
  onChange: () => {},
  options: [],
  selected: null,
};

export default ToggleGroup;
