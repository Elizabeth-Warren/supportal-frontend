import { useContext } from 'react';
import LeadWelcomeCard from './LeadWelcomeCard';
import ActiveLead from './ActiveLead';
import LeadsContext from '../contexts/LeadsContext';
import { Categories } from '../constants/leadStatuses';

const LeadContactCard = () => {
  const { leads, activeLead, activeTab } = useContext(LeadsContext);
  let title;
  let message =
    'You haven’t marked any contact results yet. Call some people in the “Uncontacted” tab to get started!';
  switch (activeTab) {
    case Categories.UNCONTACTED.toLowerCase():
      title = leads.length ? 'Thank you!' : 'Welcome';
      message = leads.length
        ? 'Awesome job - you just finished a batch! You can either keep going by requesting more prospects, or call it a day and sign out.'
        : 'You’re ready to start calling your first batch of volunteer prospects. Press the red button to get started.';
      break;
    case Categories.UNSUCCESSFUL.toLowerCase():
      title = 'No unsuccessful contacts';
      break;
    default:
      title = 'No successful contacts';
      break;
  }

  return !activeLead ? (
    <LeadWelcomeCard title={title} message={message} />
  ) : (
    <ActiveLead lead={activeLead} />
  );
};

export default LeadContactCard;
