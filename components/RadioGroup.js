/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import ToggleGroup from './ToggleGroup';
import { InputTypes } from '../constants/formElements';

const RadioGroup = ({ selected, ...other }) => (
  <ToggleGroup type={InputTypes.RADIO} selected={selected} {...other} />
);

RadioGroup.propTypes = {
  selected: PropTypes.string,
};

RadioGroup.defaultProps = {
  selected: null,
};

export default RadioGroup;
