import PropTypes from 'prop-types';
import { VisuallyHidden } from '@ewarren/persist';
import { LeadType } from '../constants/types';
import { Categories, getTabStatusGroup } from '../constants/leadStatuses';
import getTimeLeftToContact from '../util/getTimeLeftToContact';

const getStatusIndicator = lead => {
  switch (getTabStatusGroup(lead.status)) {
    case Categories.SUCCESSFUL:
      return <span className="font-bold text-green">✓</span>;
    case Categories.UNSUCCESSFUL:
    case Categories.UNCONTACTED:
      return (
        <span className="text-sm">{getTimeLeftToContact(lead.created_at)}</span>
      );
    default:
      return null;
  }
};

const LeadListItem = ({ lead, isActive, onChange }) => {
  const elId = `lead-list-${lead.id}`;
  const containerClasses = [
    'border-l-8',
    'mb-1',
    'py-4',
    'pl-3',
    'pr-5',
    'flex',
    'justify-between',
  ];

  if (isActive) {
    containerClasses.push('bg-lightLiberty', 'border-liberty');
  } else {
    containerClasses.push(
      'bg-white',
      'border-transparent',
      'hover:bg-lightLiberty'
    );
  }

  return (
    <label htmlFor={elId} className={containerClasses.join(' ')} tabIndex="0">
      <VisuallyHidden>
        <input
          id={elId}
          type="radio"
          onChange={onChange}
          checked={isActive}
          name="lead"
          value={lead.id}
          tabIndex="-1"
        />
      </VisuallyHidden>
      <span className={isActive ? 'font-bold' : null}>
        {[lead.person.first_name, lead.person.last_name].join(' ')}
      </span>
      {getStatusIndicator(lead)}
    </label>
  );
};

LeadListItem.propTypes = {
  lead: LeadType.isRequired,
  isActive: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LeadListItem;
