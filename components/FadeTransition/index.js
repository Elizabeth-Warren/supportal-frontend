/* eslint-disable react/jsx-props-no-spreading */
/**
 * @fileoverview
 * Creates a CSS-based fade transition when a component enters or leaves the
 * DOM. This will require either a `key` or `in` prop to control when the
 * transition occurs. See documentation:
 * https://reactcommunity.org/react-transition-group/css-transition
 */

import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './fade.css';

const FadeTransition = ({ children, ...rest }) => (
  <CSSTransition
    classNames="fade"
    addEndListener={(node, done) =>
      node.addEventListener('transitionend', done, false)
    }
    {...rest}
  >
    {children}
  </CSSTransition>
);

FadeTransition.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FadeTransition;
