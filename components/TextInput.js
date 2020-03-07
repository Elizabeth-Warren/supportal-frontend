/* eslint-disable react/jsx-props-no-spreading */
// We're intentionally disabling props spreading here to allow for a catch-all
// of input-related attributes.
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';
import { InputTypes, Themes } from '../constants/formElements';

const TextInput = ({
  className,
  error,
  onChange,
  id,
  inputClassName,
  label,
  theme,
  type,
  value,
  ...other
}) => {
  const inputClassNames = [
    inputClassName,
    'block',
    'border-2',
    'font-bold',
    'p-2',
    'w-full',
  ];
  let props = other;
  let Component = 'input';
  if (error) {
    inputClassNames.push('border-brightRed');
    if (theme === Themes.INVERTED) {
      inputClassNames.push('bg-transparent', 'text-white');
    }
  } else if (theme === Themes.INVERTED) {
    inputClassNames.push('bg-transparent', 'border-white', 'text-white');
  } else {
    inputClassNames.push('bg-white', 'border-navy', 'text-navy');
  }

  // For telephone inputs, we're enforcing a consistent format in the UI, so
  // are using an input mask as well as HTML5 pattern validation.
  if (type === InputTypes.TEL) {
    Component = InputMask;
    props = {
      ...other,
      mask: '(999) 999-9999',
      // Disabline linting on the next line because the pattern string conflicts
      // with prettier's autofix.
      pattern: '[\(][0-9]{3}[\)] [0-9]{3}-[0-9]{4}', // eslint-disable-line
    };
  }

  if (type === InputTypes.TEXTAREA) {
    Component = 'textarea';
  }

  return (
    <label className={[className, 'block'].join(' ')} htmlFor={id}>
      {(label || error) && (
        <div className="flex mb-2 flex-wrap items-baseline">
          {label && <div className="mr-4 text-base">{label}</div>}
          {error && <div className="text-brightRed text-sm">{error}</div>}
        </div>
      )}
      <div className="relative">
        <Component
          className={inputClassNames.join(' ')}
          value={value}
          id={id}
          onChange={onChange}
          type={type !== 'textarea' ? type : undefined}
          aria-invalid={!!error}
          {...props}
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

TextInput.propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onChange: PropTypes.func,
  id: PropTypes.string.isRequired,
  inputClassName: PropTypes.string,
  label: PropTypes.node,
  theme: PropTypes.oneOf(Object.values(Themes)),
  type: PropTypes.string,
  value: PropTypes.string,
};

TextInput.defaultProps = {
  className: '',
  error: null,
  inputClassName: '',
  onChange: () => {},
  label: null,
  theme: Themes.DEFAULT,
  type: 'text',
  value: '',
};

export default TextInput;
