import { useContext, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import LeadsContext from '../contexts/LeadsContext';
import scrollToContentTop from '../util/scrollToContentTop';
import { LeadType } from '../constants/types';
import { TabStatus } from '../constants/leadStatuses';

const LeadRelease = ({ lead }) => {
  const hasSuccessfulContact = lead.status === TabStatus.SUCCESSFUL;
  const { isLoading, skip } = useContext(LeadsContext);
  const [isShowingModal, setIsShowingModal] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsShowingModal(true);
  };

  const handleReleaseConfirm = async e => {
    if (isLoading) return;
    e.preventDefault();
    await skip(lead);
    setIsShowingModal(false);
    scrollToContentTop();
  };

  return (
    <>
      <button
        type="button"
        className="underline text-sm"
        onClick={handleClick}
        disabled={isLoading}
        data-tracking="btn-lead-skip"
      >
        {hasSuccessfulContact ? 'Release this contact' : 'Skip this person'}
      </button>
      {isShowingModal && (
        <ConfirmationModal
          confirmCta={hasSuccessfulContact ? 'Release' : 'Skip'}
          disableActions={isLoading}
          onCancel={() => setIsShowingModal(false)}
          onConfirm={handleReleaseConfirm}
        >
          <p className="mb-4">
            Are you sure you want to release {lead.person.first_name}? You will
            not be matched with {lead.person.first_name} again.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

LeadRelease.propTypes = {
  lead: LeadType.isRequired,
};

export default LeadRelease;
