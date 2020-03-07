/**
 * @fileoverview
 * For use by admins to add users.
 */
import PropTypes from 'prop-types';
import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import { useContext, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import NotificationTypes from '../constants/NotificationTypes';
import NotificationsContext from '../contexts/NotificationsContext';
import SwitchboardAdminContext from '../contexts/SwitchboardAdminContext';
import TextInput from './TextInput';
import CheckboxGroup from './CheckboxGroup';

const AddUserModal = ({ onClose }) => {
  const { showNotification } = useContext(NotificationsContext);
  const { addUser } = useContext(SwitchboardAdminContext);

  const [formState, setFormState] = useState({
    email: '',
    first_name: '',
    last_name: '',
    should_send_invite_email: true,
    is_mobilize_america_signup: false,
  });

  const [isBusy, setIsBusy] = useState(false);

  const handleChange = e => {
    const { name, value, type } = e.target;
    const newState = { ...formState };
    if (type === 'checkbox') {
      newState[value] = e.target.checked;
    } else {
      newState[name] = value;
    }
    setFormState(newState);
  };

  const handleConfirm = async e => {
    if (isBusy) return;
    e.preventDefault();
    setIsBusy(true);
    try {
      await addUser(formState);
      const message = `User created for ${formState.email}`;
      showNotification({
        message,
        type: NotificationTypes.DEFAULT,
      });
    } finally {
      setIsBusy(false);
      onClose();
    }
  };

  return (
    <ConfirmationModal
      confirmCta="Add"
      disableActions={isBusy}
      onCancel={onClose}
      onConfirm={handleConfirm}
      trackingId="form-add-user"
    >
      <WideHeadline size={WideHeadlineSizes.MD} className="mb-6">
        Add a user
      </WideHeadline>
      <div className="md:flex md:-mx-2">
        <TextInput
          className="mb-4 md:mx-2 flex-grow"
          name="first_name"
          label="First name"
          value={formState.first_name}
          onChange={handleChange}
          id="invite-first-name"
        />
        <TextInput
          className="mb-4 md:mx-2 flex-grow"
          name="last_name"
          label="Last name"
          value={formState.last_name}
          onChange={handleChange}
          id="invite-last-name"
        />
      </div>
      <TextInput
        className="mb-8"
        type="email"
        name="email"
        label="Email"
        value={formState.email}
        onChange={handleChange}
        id="invite-email"
        required
      />
      <div className="mb-8">
        <CheckboxGroup
          onChange={handleChange}
          name="signUpOptions"
          disabled={false}
          options={[
            {
              value: 'should_send_invite_email',
              label: 'Send an invite email when you add this user',
            },
            {
              value: 'is_mobilize_america_signup',
              label: 'Show this user demo data until they attend a training',
            },
          ]}
          selected={[
            'should_send_invite_email',
            'is_mobilize_america_signup',
          ].filter(key => formState[key])}
        />
      </div>
    </ConfirmationModal>
  );
};

AddUserModal.propTypes = {
  onClose: PropTypes.func,
};

AddUserModal.defaultProps = {
  onClose: () => {},
};

export default AddUserModal;
