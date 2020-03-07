// Code largely taken from
// https://www.jayfreestone.com/writing/react-portals-with-hooks/

import { createPortal } from 'react-dom';
import usePortal from '../hooks/usePortal';

/**
 * @example
 * <Portal>
 *   <p>Thinking with portals</p>
 * </Portal>
 */
const Portal = ({ id, children }) => {
  const target = usePortal(id);
  return createPortal(children, target);
};

export default Portal;
