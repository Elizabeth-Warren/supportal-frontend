import { useContext, useEffect, useState } from 'react';
import Button, {
  ButtonLevels,
  ButtonSizes,
} from '@ewarren/persist/lib/components/Button';
import sortBy from 'lodash/sortBy';
import isArray from 'lodash/isArray';
import LeadEventCategories from '../constants/LeadEventCategories';
import LeadEventShape from '../constants/LeadEventShape';
import LeadsContext from '../contexts/LeadsContext';
import MobilizeContext from '../contexts/MobilizeContext';
import NotificationsContext from '../contexts/NotificationsContext';
import RadioGroup from './RadioGroup';
import RadioInput from './RadioInput';
import MultiSelectInput from './MultiSelectInput';
import TextInput from './TextInput';
import isTimeslotInFuture from '../util/isTimeslotInFuture';
import scrollToContentTop from '../util/scrollToContentTop';
import timeslotShiftToString from '../util/timeslotShiftToString';
import { LeadType } from '../constants/types';
import {
  Successful,
  Unavailable,
  Unreachable,
  TabStatus,
} from '../constants/leadStatuses';

const { NOTE, RESULT_CATEGORY, RESULT, STATUS, TIMESLOTS } = LeadEventShape;
const { SUCCESSFUL, UNAVAILABLE } = LeadEventCategories;
const [LOCAL_EVENT, ONLINE_TRAINING] = Object.keys(Successful);

const getFutureTimeslots = event =>
  event.timeslots
    .filter(timeslot => isTimeslotInFuture(timeslot.start_date))
    .map(item => ({
      label: timeslotShiftToString(item, event.timezone),
      value: `${item.id}`,
    }));

const getDefaultTimeslots = mobilizeEvent =>
  mobilizeEvent && getFutureTimeslots(mobilizeEvent).length === 1
    ? getFutureTimeslots(mobilizeEvent)
    : [];

const ContactEventForm = ({ lead }) => {
  const { isLoading, createContactEvent } = useContext(LeadsContext);
  const { mobilizeEvent } = useContext(MobilizeContext);
  const events = lead.vol_prospect_contact_events;
  const latestEvent = sortBy(events, 'created_at').reverse()[0];
  const hasSuccessfulContact = lead.status === TabStatus.SUCCESSFUL;
  const { showNotification } = useContext(NotificationsContext);
  const showMobilize = mobilizeEvent && lead.person.has_email;

  const getInitialFormState = () => ({
    [NOTE]: '',
    [RESULT_CATEGORY]: SUCCESSFUL,
    [RESULT]: null,
    [STATUS]: LOCAL_EVENT,
    [TIMESLOTS]: getDefaultTimeslots(mobilizeEvent),
  });

  const [formState, setFormState] = useState(getInitialFormState());

  const handleSubmit = async e => {
    if (isLoading) return;
    e.preventDefault();
    await createContactEvent({
      formState,
      lead,
      showNext: !hasSuccessfulContact,
    });
    showNotification({
      message: `Your update for ${[
        lead.person.first_name,
        lead.person.last_name,
      ].join(' ')} has been saved.`,
      dismissAfter: 3000,
    });
    scrollToContentTop();
  };

  const handleChange = e => {
    const newState = { ...formState };
    if (isArray(e)) {
      // This is a change to the timeslot.
      newState[STATUS] = LOCAL_EVENT;
      newState[TIMESLOTS] = e.map(item => item.value);
    } else {
      const { name, value } = e.target;
      newState[name] = value;
      if (name === RESULT_CATEGORY) {
        if (value === 'SUCCESSFUL') {
          newState[STATUS] = LOCAL_EVENT;
          newState[RESULT] = null;
          newState[TIMESLOTS] = getDefaultTimeslots(mobilizeEvent);
        } else if (value === 'UNAVAILABLE') {
          newState[STATUS] = null;
          newState[RESULT] = 'UNAVAILABLE_CALL_BACK';
          newState[TIMESLOTS] = [];
        } else {
          newState[STATUS] = null;
          newState[RESULT] = null;
          newState[TIMESLOTS] = [];
        }
      }
    }
    setFormState(newState);
  };

  // Returns radio button options based on lead status sets (options). For the
  // `Successful` options, we add an option for mobilize events if an event has
  // been specified. If there is a mobilize event specified, we need to change
  // the label slightly for the default `LOCAL_EVENT` option.
  const mapOptions = (options, withMobilize) => {
    const result = [];
    if (withMobilize) {
      const timeslots = getFutureTimeslots(mobilizeEvent);
      result.push({
        label: (
          <>
            <div className="font-bold mb-2 text-sm">
              Scheduled for {mobilizeEvent.title}
            </div>
            {/* TODO(jjandoc): This component looks buggy here on screens less
            than around 500px. Haven't been able to figure out the fix. It's
            usable though so launching as-is for now. */}
            <MultiSelectInput
              id="event-shift-select"
              label="Select a shift"
              options={timeslots}
              onChange={handleChange}
              value={formState[TIMESLOTS]}
              name={TIMESLOTS}
            />
          </>
        ),
        value: LOCAL_EVENT,
      });
    }
    Object.entries(options).forEach(([value, label]) => {
      // We are no longer displaying the `ONLINE_TRAINING` option, but we still
      // need to support its existence for displaying Contact History, which is
      // why we're just filtering it out here rather than pulling it out of the
      // code completely.
      if (value === ONLINE_TRAINING || (mobilizeEvent && value === LOCAL_EVENT))
        return;
      result.push({
        value,
        label: <span className="font-bold text-sm">{label}</span>,
      });
    });
    return result;
  };

  let submitCta = 'Submit';
  if (isLoading) {
    submitCta = 'Loading';
  } else if (!hasSuccessfulContact) {
    submitCta = 'Next';
  }

  useEffect(() => {
    let newFormState = { ...getInitialFormState() };
    if (latestEvent && !hasSuccessfulContact) {
      newFormState = {
        ...newFormState,
        [NOTE]: latestEvent[NOTE],
        [RESULT_CATEGORY]: latestEvent.result_category,
        [RESULT]: latestEvent[RESULT],
        [STATUS]: (latestEvent.metadata || {})[STATUS],
      };
    }
    setFormState(newFormState);
  }, [latestEvent, lead, mobilizeEvent]);

  return (
    <form onSubmit={handleSubmit} data-tracking="form-lead-update">
      <div className="bg-white px-6 md:px-12 py-8">
        <RadioInput
          id="lead-radio-successful"
          className="mb-3"
          name={RESULT_CATEGORY}
          onChange={handleChange}
          value={SUCCESSFUL}
          checked={formState.resultCategory === SUCCESSFUL}
          label={`I talked to ${lead.person.first_name}`}
        />
        {formState.resultCategory === SUCCESSFUL && (
          <div className="pl-8">
            <div className="mb-3 text-sm">This person is:</div>
            <RadioGroup
              options={mapOptions(Successful, showMobilize)}
              onChange={handleChange}
              name={STATUS}
              selected={formState.status}
            />
          </div>
        )}
        {!hasSuccessfulContact && (
          <RadioInput
            id="lead-radio-unsuccessful"
            className="mb-3"
            name={RESULT_CATEGORY}
            onChange={handleChange}
            value={UNAVAILABLE}
            checked={formState.resultCategory === UNAVAILABLE}
            label={`I didn’t talk to ${lead.person.first_name}`}
          />
        )}
        {formState.resultCategory === UNAVAILABLE && (
          <div className="pl-8">
            <div className="mb-3 text-sm">Unavailable:</div>
            <RadioGroup
              options={mapOptions(Unavailable)}
              onChange={handleChange}
              name={RESULT}
              selected={formState.result}
            />
            <div className="mb-3 text-sm">Unreachable:</div>
            <RadioGroup
              options={mapOptions(Unreachable)}
              onChange={handleChange}
              name={RESULT}
              selected={formState.result}
            />
          </div>
        )}
        <TextInput
          id="lead-note"
          type="textarea"
          label="Notes (optional):"
          name={NOTE}
          value={formState[NOTE]}
          onChange={handleChange}
          className="mt-6"
        />
        <div className="mt-8">
          <Button
            className="ml-auto"
            type="submit"
            disabled={
              !(formState.status || formState.result) ||
              (mobilizeEvent &&
                formState[STATUS] === LOCAL_EVENT &&
                !formState[TIMESLOTS]) ||
              isLoading
            }
            size={ButtonSizes.SM}
            level={ButtonLevels.SECONDARY}
          >
            {submitCta}
          </Button>
        </div>
      </div>
    </form>
  );
};

ContactEventForm.propTypes = {
  lead: LeadType.isRequired,
};

export default ContactEventForm;
