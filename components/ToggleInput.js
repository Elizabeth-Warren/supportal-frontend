/* eslint-disable react/jsx-props-no-spreading */
/**
 * @fileoverview
 * Outputs either a checkbox, or a radio buttons Don't use this component
 * directly. Instead use, RadioInput or CheckboxInput.
 */
import PropTypes from 'prop-types';
import Checkmark from '../assets/checkmark.svg';
import { InputTypes } from '../constants/formElements';

const { RADIO, CHECKBOX } = InputTypes;

const ToggleInput = ({
  className,
  checked,
  label,
  value,
  id,
  disabled,
  onChange,
  name,
  type,
  ...other
}) => {
  const customInputClasses = [
    'border-navy',
    'flex-shrink-0',
    'h-5',
    'inline-flex',
    'items-center',
    'justify-center',
    'w-5',
  ];

  if (disabled) {
    customInputClasses.push('opacity-75');
  }

  if (type === RADIO) {
    customInputClasses.push('border-2', 'rounded-full');
  } else {
    customInputClasses.push('border-3');
    if (checked) {
      customInputClasses.push('bg-navy');
    } else {
      customInputClasses.push('bg-white');
    }
  }

  return (
    <label
      key={value}
      htmlFor={id}
      className={[className, 'flex items-start'].join(' ')}
    >
      <input
        checked={checked}
        className="sr-only"
        disabled={disabled}
        name={name}
        id={id}
        onChange={onChange}
        type={type}
        value={value}
        {...other}
      />
      <div className={customInputClasses.join(' ')}>
        {checked && type === RADIO && (
          <div className="bg-liberty rounded-full h-3 w-3" />
        )}
        {checked && type === CHECKBOX && (
          <Checkmark className="w-3 stroke-current inline-flex fill-current text-white" />
        )}
      </div>
      <span className="flex-grow max-w-full ml-2">{label}</span>
      <style jsx>{`
        input:focus + div {
          outline: 1px dotted #212121;
          outline: 5px auto -webkit-focus-ring-color;
        }
      `}</style>
    </label>
  );
};

ToggleInput.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.oneOf([CHECKBOX, RADIO]).isRequired,
  value: PropTypes.string.isRequired,
};

ToggleInput.defaultProps = {
  checked: false,
  className: '',
  disabled: false,
  onChange: () => {},
};

export default ToggleInput;
