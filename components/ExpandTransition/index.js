/* eslint-disable react/jsx-props-no-spreading */
/**
 * @fileoverview
 * Creates a CSS-based expand transition when a component enters or leaves the
 * DOM. This will require either a `key` or `in` prop to control when the
 * transition occurs. See documentation:
 * https://reactcommunity.org/react-transition-group/css-transition

 */

import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './expand.css';

const ExpandTransition = ({ children, ...rest }) => (
  <CSSTransition classNames="expand" timeout={200} {...rest}>
    {children}
  </CSSTransition>
);

ExpandTransition.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExpandTransition;
