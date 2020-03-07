import PropTypes from 'prop-types';
import { FocusOn } from 'react-focus-on';
import { VisuallyHidden } from '@ewarren/persist';
import Portal from './Portal';

const Modal = ({ children, force, onClose }) => {
  const handleClose = force ? () => {} : onClose;
  return (
    <Portal id="modal">
      <div className="fixed inset-0 bg-navy opacity-70 z-40" />
      <FocusOn onClickOutside={handleClose} onEscapeKey={handleClose}>
        <div className="modal-window fixed max-w-modal overflow-auto w-full z-50">
          {children}
          {!force && (
            <button
              className="absolute leading-none mr-4 mt-2 right-0 text-2xl top-0"
              type="button"
              onClick={handleClose}
            >
              <VisuallyHidden>Close</VisuallyHidden>
              <span aria-hidden>&times;</span>
            </button>
          )}
        </div>
        <style jsx>{`
          .modal-window {
            left: 50%;
            max-height: 80vh;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        `}</style>
      </FocusOn>
    </Portal>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  force: PropTypes.bool,
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  force: false,
  onClose: () => {},
};

export default Modal;
