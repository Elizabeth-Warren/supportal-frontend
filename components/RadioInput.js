/* eslint-disable react/jsx-props-no-spreading */
import ToggleInput from './ToggleInput';
import { InputTypes } from '../constants/formElements';

const RadioInput = props => <ToggleInput type={InputTypes.RADIO} {...props} />;

export default RadioInput;
