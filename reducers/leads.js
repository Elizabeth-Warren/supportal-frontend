import {
  Categories,
  TabStatus,
  isUnreachable,
} from '../constants/leadStatuses';

export const Actions = {
  LEADS_FETCHED: 'LEADS_FETCHED',
  SKIP_LEAD: 'SKIP_LEAD',
  HAS_ERROR: 'HAS_ERROR',
  UPDATE_LEAD: 'UPDATE_LEAD',
  UPDATE_ACTIVE_LEAD_ID: 'UPDATE_ACTIVE_LEAD_ID',
  UPDATE_ACTIVE_TAB: 'UPDATE_ACTIVE_TAB',
  UPDATE_LOADING: 'UPDATE_LOADING',
};

/**
 * Finds lead.status property depending on form state outcome.
 * @param {string} status comes from form state status.
 * @returns {string} Enum for lead status updated state.
 */
const getTabStatusFromResultCategory = status =>
  status === Categories.SUCCESSFUL.toUpperCase()
    ? TabStatus.SUCCESSFUL
    : TabStatus.ATTEMPTED;

/**
 * Assigns init object for reducer, assigns propeties for `activeLeadId`
 * and `activeTab` based on query params.
 * @param {string} routerActiveLeadId Identifier for initialization of
 *  `activeLeadId`.
 * @param {string} routerActiveTab String to compare to tab constants array,
 * if string matches a tab, string is assigned on initialization.
 * @returns {object} Initialized state for lead reducer.
 */
export const getInitialLeadState = (
  routerActiveLeadId,
  routerActiveTab = ''
) => ({
  leads: [],
  isLoading: true,
  error: null,
  activeLeadId: routerActiveLeadId ? parseInt(routerActiveLeadId, 10) : null,
  activeTab: Object.values(Categories)
    .map(cat => cat.toLowerCase())
    .includes(routerActiveTab)
    ? routerActiveTab
    : Categories.UNCONTACTED.toLowerCase(),
});

/**
 * Assigns leads to state, finds new `activeLeadId` if possible.
 * @param {object} state Previous state object for leads.
 * @param {array} leads Newly fetched list of leads.
 * @returns {object} New object state.
 */
const updateFetchedLeads = (state, leads) => {
  const assignedLeads = leads.filter(
    ({ status }) => status === TabStatus[state.activeTab.toUpperCase()]
  );
  const activeLeadId =
    (
      assignedLeads.find(({ id }) => id === state.activeLeadId) ||
      assignedLeads[0] ||
      {}
    ).id || null;

  return {
    ...state,
    activeLeadId,
    leads,
  };
};

/**
 * Updates tab, finds and updates `activeLeadId` (to first in status type list).
 * @param {object} state Previous state object for leads.
 * @param {string} newTab Lowercase string for new tab choice.
 * @returns {object} New object state.
 */
const updateTab = (state, newTab) => {
  const { id: activeLeadId } =
    state.leads.find(
      ({ status }) => status === TabStatus[newTab.toUpperCase()]
    ) || {};

  return {
    ...state,
    activeTab: newTab,
    activeLeadId,
  };
};

/**
 * Finds new `activeLeadId` after the active lead is changed.
 * Will try for the next lead in the list of the same state, otherwise
 * the next lead in the list of the same state.
 * @param {object} state Previous state object for leads.
 * @param {string} leadStatus Previous active lead status.
 * @returns {object} New object state with new activeLeadId.
 */
const findNewActiveLeadId = (state, leadStatus) => {
  const { activeLeadId } = state;
  const leadsOfStateType = state.leads.filter(
    lead => lead.status === leadStatus
  );
  const listIndex = leadsOfStateType.findIndex(({ id }) => id === activeLeadId);
  const newActiveLeadId = (
    leadsOfStateType[listIndex + 1] ||
    leadsOfStateType[0] ||
    {}
  ).id;

  return {
    ...state,
    activeLeadId: newActiveLeadId || null,
  };
};

/**
 * Removes lead and finds new activeLeadId.
 * @param {object} state Previous state for leads.
 * @param {number} leadId Id of lead to remove.
 * @returns {object} New state with new activeLeadId, and lead removed.
 */
const removeLead = (state, leadId) => ({
  ...state,
  leads: state.leads.filter(({ id }) => id !== leadId),
});

/**
 *
 * @param {object} state Previous state.
 * @param {number} activeLeadId ID of lead to update.
 * @param {object} contactEvent Properties form active lead form to update.
 * @returns {object} New state with new activeLeadId, and previous lead updated.
 */
const updateActiveLead = (state, activeLeadId, contactEvent) => {
  const leads = state.leads.map(lead => {
    if (lead.id !== activeLeadId) return lead;
    return {
      ...lead,
      status: getTabStatusFromResultCategory(contactEvent.result_category),
      vol_prospect_contact_events: [
        contactEvent,
        ...lead.vol_prospect_contact_events,
      ],
    };
  });

  // if new leads is empty for the leadStatus
  // activeLeadId should be null
  return {
    ...state,
    leads,
    isLoading: false,
    error: null,
  };
};

const leadsReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case Actions.LEADS_FETCHED:
      newState = {
        ...updateFetchedLeads(state, action.leads),
        isLoading: false,
        error: null,
      };
      break;
    case Actions.UPDATE_ACTIVE_TAB:
      newState = updateTab(state, action.tab);
      break;
    case Actions.UPDATE_LEAD:
      if (isUnreachable(action.formState.result)) {
        newState = {
          ...removeLead(state, action.activeLeadId),
          isLoading: false,
          error: null,
        };
      } else {
        newState = updateActiveLead(
          state,
          action.activeLeadId,
          action.contactEvent
        );
      }
      if (action.showNext) {
        newState = findNewActiveLeadId(newState, action.activeLeadStatus);
      }
      return newState;
    case Actions.SKIP_LEAD:
      newState = findNewActiveLeadId(state, action.previousStatus);
      newState = {
        ...removeLead(newState, action.id),
        isLoading: false,
        error: null,
      };
      break;
    case Actions.UPDATE_ACTIVE_LEAD_ID:
      newState = { ...state, activeLeadId: action.id };
      break;
    case Actions.UPDATE_LOADING:
      newState = {
        ...state,
        error: null,
        isLoading: action.value,
      };
      break;
    case Actions.HAS_ERROR:
      newState = { ...state, error: action.value, isLoading: false };
      break;
    default:
      newState = state;
      console.error(
        'Unexpected action - Use the `Actions` constants in reducers/leads.js'
      );
  }
  return newState;
};

export default leadsReducer;
