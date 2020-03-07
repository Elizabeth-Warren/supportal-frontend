import Button, { ButtonLevels } from '@ewarren/persist/lib/components/Button';
import PropTypes from 'prop-types';
import Modal from './Modal';

const ConfirmationModal = ({
  children,
  onCancel,
  onConfirm,
  cancelCta,
  confirmCta,
  disableActions,
  trackingId,
}) => {
  return (
    <Modal onClose={onCancel}>
      <form
        data-tracking={trackingId}
        onSubmit={onConfirm}
        className="bg-white p-8 md:p-12"
      >
        {children}
        <div className="flex flex-wrap">
          <Button
            type="submit"
            disabled={disableActions}
            className="mr-2"
            level={ButtonLevels.QUATERNARY}
          >
            {confirmCta}
          </Button>
          <Button
            type="reset"
            onClick={onCancel}
            level={ButtonLevels.INVERTED}
            disabled={disableActions}
          >
            {cancelCta}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  cancelCta: PropTypes.node,
  children: PropTypes.node.isRequired,
  confirmCta: PropTypes.node,
  disableActions: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  trackingId: PropTypes.string,
};

ConfirmationModal.defaultProps = {
  cancelCta: 'Cancel',
  confirmCta: 'Submit',
  disableActions: false,
  onCancel: () => {},
  onConfirm: () => {},
  trackingId: undefined,
};

export default ConfirmationModal;
