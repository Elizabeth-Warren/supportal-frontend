/* eslint-disable react/jsx-props-no-spreading */
import ToggleInput from './ToggleInput';
import { InputTypes } from '../constants/formElements';

const CheckboxInput = props => (
  <ToggleInput type={InputTypes.CHECKBOX} {...props} />
);

export default CheckboxInput;
