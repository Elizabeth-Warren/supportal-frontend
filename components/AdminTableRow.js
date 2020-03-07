import PropTypes from 'prop-types';
import Chevron, {
  ChevronDirections,
} from '@ewarren/persist/lib/components/Chevron';
import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import format from 'date-fns/format';
import { useContext, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import ExpandTransition from './ExpandTransition';
import StatusIndicator from './StatusIndicator';
import SwitchboardAdminContext from '../contexts/SwitchboardAdminContext';
import getFormattedPhone from '../util/getFormattedPhone';
import { UserProfileType } from '../constants/types';

const AdminTableRow = ({ isFullView, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingModal, setIsShowingModal] = useState(false);
  const { removeUser } = useContext(SwitchboardAdminContext);

  const handleConfirm = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await removeUser(user.id);
    } finally {
      setIsShowingModal(false);
      setIsLoading(false);
    }
  };

  const formatDateStr = dateStr =>
    dateStr ? format(new Date(dateStr), 'MMMM dd, yyyy') : '';
  const addedBy = user.added_by
    ? [user.added_by.first_name, user.added_by.last_name].join(' ')
    : '';

  return (
    <>
      <tr className="border-b-3 border-offWhite">
        <td className="pr-1 py-4 md:py-2 truncate">
          <span className="relative">
            {user.is_admin && (
              <b className="block text-sm absolute top-0 -mt-4">Admin</b>
            )}
            {user.email}
          </span>
        </td>
        {isFullView && (
          <>
            <td className="pr-1 py-4 md:py-2">{user.first_name}</td>
            <td className="pr-1 py-4 md:py-2">{user.last_name}</td>
            <td className="pr-1 py-4 md:py-2">{user.city}</td>
            <td className="pr-1 py-4 md:py-2">
              <StatusIndicator status={user.activity_status} />
            </td>
          </>
        )}
        <td className="py-4 md:py-2">
          {isFullView && (
            <button
              className="block mb-1 ml-auto text-purple underline"
              type="button"
              onClick={() => {
                setIsShowingModal(true);
              }}
            >
              Revoke
            </button>
          )}
          <button
            className="block ml-auto text-purple"
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            id={`control-${user.id}`}
            aria-expanded={isOpen}
          >
            {isOpen ? 'Less' : 'More'}
            <Chevron
              className="ml-2"
              direction={isOpen ? ChevronDirections.UP : ChevronDirections.DOWN}
            />
          </button>
        </td>
      </tr>

      <tr aria-labelledby={`control-${user.id}`} aria-hidden={!isOpen}>
        <td colSpan={isFullView ? 6 : 2}>
          <ExpandTransition in={isOpen} mountOnEnter unmountOnExit>
            <div
              className="bg-lightLiberty overflow-x-auto text-base p-4"
              style={{ marginTop: '-3px' }}
            >
              <dl>
                {!isFullView && (
                  <>
                    <dt>Email</dt>
                    <dd>{user.email}</dd>
                    <dt>First name</dt>
                    <dd>{user.first_name}</dd>
                    <dt>Last name</dt>
                    <dd>{user.last_name}</dd>
                    <dt>City</dt>
                    <dd>{user.city}</dd>
                    <dt>Status</dt>
                    <dd>
                      <StatusIndicator status={user.activity_status} />
                    </dd>
                  </>
                )}
                <dt>NGP ID</dt>
                <dd>{user.ngp_id}</dd>
                <dt>Team</dt>
                <dd>{user.self_reported_team_name}</dd>
                <dt>Phone</dt>
                <dd>{getFormattedPhone(user.phone)}</dd>
                <dt>Date added</dt>
                <dd>{formatDateStr(user.created_at)}</dd>
                <dt>Added by</dt>
                <dd>{addedBy}</dd>
                <dt>Last login</dt>
                <dd>{formatDateStr(user.last_login)}</dd>
              </dl>
              <style jsx>{`
                dl {
                  columns: ${isFullView ? 2 : 1};
                }
                dt {
                  font-weight: bold;
                  margin-right: 0.5em;
                }
                dt,
                dd {
                  display: inline;
                }
                dd::after {
                  content: '';
                  display: block;
                  margin-bottom: 4px;
                }
              `}</style>
              {!isFullView && (
                <button
                  className="mt-3 text-purple underline"
                  type="button"
                  onClick={() => {
                    setIsShowingModal(true);
                  }}
                >
                  Revoke
                </button>
              )}
            </div>
          </ExpandTransition>
        </td>
      </tr>
      {isShowingModal && (
        <ConfirmationModal
          confirmCta="Revoke"
          disableActions={isLoading}
          onCancel={() => setIsShowingModal(false)}
          onConfirm={handleConfirm}
        >
          <WideHeadline size={WideHeadlineSizes.MD} className="mb-6">
            Revoke access
          </WideHeadline>
          <p className="mb-4">
            Are you sure you want to revoke access for {user.email}?
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

AdminTableRow.propTypes = {
  isFullView: PropTypes.bool,
  user: UserProfileType.isRequired,
};

AdminTableRow.defaultProps = {
  isFullView: false,
};

export default AdminTableRow;
