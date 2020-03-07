/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { useField } from 'formik';
import SelectInput from './SelectInput';
import TextInput from './TextInput';
import stateHash from '../assets/us-state-hash.json';

const FormikField = ({ name, error, ...rest }) => {
  const [field, meta] = useField(name);
  const Component = name !== 'state' ? TextInput : SelectInput;
  const fieldError = error || (meta.touched && meta.error ? meta.error : null);
  const props = {
    id: `formik-field-${name}`,
    error: fieldError,
    required: true,
    ...field,
    ...rest,
  };
  if (name === 'state') {
    props.options = [
      '',
      ...Object.entries(stateHash)
        .sort(([a], [b]) => `${a}`.localeCompare(b))
        .map(([value, label]) => ({
          value,
          label: `${value} - ${label}`,
        })),
    ];
  }
  return <Component {...props} />;
};

FormikField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  name: PropTypes.string.isRequired,
};

FormikField.defaultProps = {
  label: '',
  error: null,
  type: 'text',
};

export default FormikField;
