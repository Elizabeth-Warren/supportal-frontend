import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import Accordion from './Accordion';
import ContactEventForm from './ContactEventForm';
import ContactHistory from './ContactHistory';
import LeadRelease from './LeadRelease';
import getFormattedPhone from '../util/getFormattedPhone';
import getTimeLeftToContact from '../util/getTimeLeftToContact';
import { LeadType } from '../constants/types';
import { TabStatus } from '../constants/leadStatuses';

const ActiveLead = ({ lead }) => {
  const hasSuccessfulContact = lead.status === TabStatus.SUCCESSFUL;

  return (
    <div key={lead.id}>
      <div className="bg-liberty px-6 py-8 md:px-12">
        <h2 className="font-bold mb-4 text-xl md:text-2xl">
          {[lead.person.first_name, lead.person.last_name].join(' ')}
        </h2>
        <div>
          <b>Phone number:</b>{' '}
          <a href={`tel:${lead.person.phone}`} className="underline">
            {getFormattedPhone(lead.person.phone)}
          </a>
        </div>
        <div>
          <b>Location:</b> {`${lead.person.city}, ${lead.person.state}`}
        </div>
        <div>
          {hasSuccessfulContact
            ? `Last contacted ${new Date(lead.updated_at).toLocaleDateString()}`
            : getTimeLeftToContact(lead.created_at, 'long')}
        </div>
      </div>
      {!hasSuccessfulContact && <ContactEventForm lead={lead} />}
      {hasSuccessfulContact && (
        <>
          <Accordion
            title={
              <WideHeadline
                as="span"
                className="mr-4"
                size={WideHeadlineSizes.SM}
              >
                Contact again
              </WideHeadline>
            }
            className="mb-1"
            id="contact-again"
          >
            <ContactEventForm lead={lead} />
          </Accordion>
          <Accordion
            title={
              <WideHeadline
                as="span"
                className="mr-4"
                size={WideHeadlineSizes.SM}
              >
                Contact history
              </WideHeadline>
            }
            id="contact-history"
            initiallyOpen
          >
            <div className="bg-white px-6 py-8 md:px-12">
              <ContactHistory events={lead.vol_prospect_contact_events} />
            </div>
          </Accordion>
        </>
      )}
      <div className="mt-8">
        <LeadRelease lead={lead} />
      </div>
    </div>
  );
};

ActiveLead.propTypes = {
  lead: LeadType.isRequired,
};

export default ActiveLead;
