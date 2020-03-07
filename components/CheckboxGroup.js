/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import ToggleGroup from './ToggleGroup';
import { InputTypes } from '../constants/formElements';

const CheckboxGroup = ({ selected, ...other }) => (
  <ToggleGroup type={InputTypes.CHECKBOX} selected={selected} {...other} />
);

CheckboxGroup.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
};

CheckboxGroup.defaultProps = {
  selected: [],
};

export default CheckboxGroup;
