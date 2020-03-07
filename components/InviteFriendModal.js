/**
 * @fileoverview
 * This component displays an "Invite a friend" modal. Not everyone is eligible
 * to invite a friend, though. A user must have contacted 10 propsects on their
 * list before they are able to invite someone initially. After that, the last
 * person they invited must contact 10 propsects. An API is available to check
 * the user's invitation eligibility. The messaging and UI we give the user is
 * different depending on if the user is eligible, not eligible because they
 * need to make more contacts, or not eligible because their invitee needs to
 * make more contacts.
 */
import Button from '@ewarren/persist/lib/components/Button';
import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import PropTypes from 'prop-types';
import theme from '@ewarren/persist/lib/theme';
import { useContext, useEffect, useState } from 'react';
import AnnularThrobber from './AnnularThrobber';
import ConfirmationModal from './ConfirmationModal';
import Modal from './Modal';
import NotificationTypes from '../constants/NotificationTypes';
import NotificationsContext from '../contexts/NotificationsContext';
import TextInput from './TextInput';
import api from '../services/api';
import pluralize from '../util/pluralize';

const InviteFriendModal = ({ onClose }) => {
  const [eligibility, setEligibility] = useState(null);
  const { showNotification } = useContext(NotificationsContext);
  const isEligible = eligibility && eligibility.has_invite;
  const invitee = eligibility ? eligibility.latest_invite : null;
  const inviteeRemainingCount = invitee ? invitee.remaining_contacts_count : 0;

  const [formState, setFormState] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [isBusy, setIsBusy] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    const newState = {
      ...formState,
      [name]: value,
    };
    setFormState(newState);
  };

  const handleConfirm = async e => {
    if (isBusy || !isEligible) return;
    e.preventDefault();
    setIsBusy(true);
    try {
      const { status } = await api.post('/invites/', formState);
      const message =
        status === 204
          ? 'That user already exists. You can invite someone else!'
          : 'Your invitation has been sent!';
      showNotification({
        message,
        type: NotificationTypes.DEFAULT,
      });
    } catch (err) {
      showNotification({
        message: err.message,
        type: NotificationTypes.ERROR,
      });
    }
    setIsBusy(false);
    onClose();
  };

  // When the component mounts, check the user's eligibility to send an invite.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/invites/available/');
        setEligibility(data);
      } catch (err) {
        showNotification({
          message: err.message,
          type: NotificationTypes.ERROR,
        });
        onClose();
      }
    })();
  }, []);

  // Until we get back a response from the above API, show a loading spinner.
  if (!eligibility) {
    return (
      <Modal onClose={onClose}>
        <div className="bg-white flex items-center justify-center w-full">
          <AnnularThrobber background={theme.colors.white} className="my-32" />
        </div>
      </Modal>
    );
  }

  // If the user has already invited someone and that person still needs to
  // contact more people, show messaging indicating that and don't show any
  // additional fields.
  if (!isEligible && invitee.email) {
    return (
      <Modal onClose={onClose}>
        <div className="bg-white p-8 md:p-12">
          <WideHeadline size={WideHeadlineSizes.MD} className="mb-6">
            Invite a friend
          </WideHeadline>
          <p className="mb-6">
            {inviteeRemainingCount ? (
              <>
                Thanks for inviting <b>{invitee.email}</b>! You will be able to
                invite additional friends once they have successfully recruited{' '}
                <b>{inviteeRemainingCount}</b> more volunteer{' '}
                {pluralize('prospect', inviteeRemainingCount)}!
              </>
            ) : (
              <>You’ve used all your invites for now. Good job!</>
            )}
          </p>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  // Otherwise, show the user the invite form, but disable all fields if the
  // user themselves still needs to contact people for eligibility.
  return (
    <ConfirmationModal
      confirmCta="Send invite"
      disableActions={isBusy || !isEligible}
      onCancel={onClose}
      onConfirm={handleConfirm}
      trackingId="form-invite-friend"
    >
      <WideHeadline size={WideHeadlineSizes.MD} className="mb-6">
        Invite a friend
      </WideHeadline>
      <p className="mb-6">
        {isEligible ? (
          <>
            Congrats, you’ve unlocked the ability to add a friend! Choose
            carefully - you won’t be able to invite anyone else until your
            friend has successfully recruited 10 volunteers prospects!
          </>
        ) : (
          <>
            Complete <b>{eligibility.remaining_contacts_count}</b> more
            successful{' '}
            {pluralize('contact', eligibility.remaining_contacts_count)} to
            invite a friend!
          </>
        )}
      </p>
      <div className="md:flex md:-mx-2">
        <TextInput
          className="mb-4 md:mx-2 flex-grow"
          name="first_name"
          label="First name"
          value={formState.first_name}
          onChange={handleChange}
          disabled={!isEligible}
          id="invite-first-name"
        />
        <TextInput
          className="mb-4 md:mx-2 flex-grow"
          name="last_name"
          label="Last name"
          value={formState.last_name}
          onChange={handleChange}
          disabled={!isEligible}
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
        disabled={!isEligible}
        id="invite-email"
        required
      />
    </ConfirmationModal>
  );
};

InviteFriendModal.propTypes = {
  onClose: PropTypes.func,
};

InviteFriendModal.defaultProps = {
  onClose: () => {},
};

export default InviteFriendModal;
