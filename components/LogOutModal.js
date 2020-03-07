import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import PropTypes from 'prop-types';
import localforage from 'localforage';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import LeadsContext from '../contexts/LeadsContext';
import StorageKeys from '../constants/StorageKeys';
import pluralize from '../util/pluralize';
import { Categories } from '../constants/leadStatuses';

const LogOutModal = ({ onClose }) => {
  const [contactedCount, setContactedCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { signOut } = useContext(AuthContext);
  const { sortedLeads } = useContext(LeadsContext);
  useEffect(() => {
    (async () => {
      const [contacted, success] = await Promise.all([
        localforage.getItem(StorageKeys.SESSION_CONTACT_COUNT),
        localforage.getItem(StorageKeys.SESSION_SUCCESS_COUNT),
      ]);
      setContactedCount(contacted || 0);
      setSuccessCount(success || 0);
      setIsLoading(false);
    })();
  }, []);

  const handleConfirm = async e => {
    e.preventDefault();
    await signOut();
  };

  const headline = contactedCount ? 'Good job!' : 'Are you sure?';
  let body;
  if (contactedCount) {
    body = `You’ve made ${contactedCount} ${pluralize(
      'contact',
      contactedCount
    )}`;
    if (successCount) {
      body += ` and recruited ${successCount} new ${pluralize(
        'prospect',
        successCount
      )}!`;
    } else {
      body += '!';
    }
    body += ' Keep up the good work!';
  } else {
    const uncontactedLeads =
      sortedLeads[Categories.UNCONTACTED.toLowerCase()].length || 0;
    if (uncontactedLeads) {
      body = `You have ${uncontactedLeads} prospects waiting for a call.`;
    } else {
      body = 'You haven’t contacted any prospects.';
    }
    body += ' Are you sure you want to log out?';
  }

  return (
    !isLoading && (
      <>
        <ConfirmationModal
          cancelCta="Keep calling"
          confirmCta="Log out"
          onCancel={onClose}
          onConfirm={handleConfirm}
          trackingId="form-log-out-modal"
        >
          <WideHeadline size={WideHeadlineSizes.MD} className="mb-6">
            {headline}
          </WideHeadline>
          <p className="mb-8">{body}</p>
        </ConfirmationModal>
      </>
    )
  );
};

LogOutModal.propTypes = {
  onClose: PropTypes.func,
};

LogOutModal.defaultProps = {
  onClose: () => {},
};

export default LogOutModal;
