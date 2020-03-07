import PropTypes from 'prop-types';
import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import ConfirmationModal from '../ConfirmationModal';

const SendEmailConfirmationModal = ({ onCancel, onConfirm }) => {
  return (
    <ConfirmationModal onCancel={onCancel} onCOnfirm={onConfirm}>
      <WideHeadline size={WideHeadlineSizes.MD} className="mb-6">
        Send email
      </WideHeadline>
      <p className="mb-4">
        Are you sure you want to send this email to 500 recipients?
      </p>
    </ConfirmationModal>
  );
};

SendEmailConfirmationModal.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

SendEmailConfirmationModal.defaultProps = {
  onCancel: () => {},
  onConfirm: () => {},
};

export default SendEmailConfirmationModal;
