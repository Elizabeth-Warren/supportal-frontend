import PropTypes from 'prop-types';
import localforage from 'localforage';
import { useContext, useReducer, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import LeadEventCategories from '../constants/LeadEventCategories';
import LeadsContext from '../contexts/LeadsContext';
import MobilizeContext from '../contexts/MobilizeContext';
import StorageKeys from '../constants/StorageKeys';
import leadsReducer, { Actions, getInitialLeadState } from '../reducers/leads';
import {
  SKIPPED,
  SUCCESSFUL_CANVASSED,
  Categories,
  Successful,
  getTabStatusGroup,
} from '../constants/leadStatuses';
import api from '../services/api';

const [LOCAL_EVENT] = Object.keys(Successful);

const incrementActivityCount = async isSuccessfulResult => {
  const currentTotalContacts =
    (await localforage.getItem(StorageKeys.SESSION_CONTACT_COUNT)) || 0;
  const currentSuccesfulContacts =
    (await localforage.getItem(StorageKeys.SESSION_SUCCESS_COUNT)) || 0;
  return Promise.all([
    localforage.setItem(
      StorageKeys.SESSION_CONTACT_COUNT,
      currentTotalContacts + 1
    ),
    localforage.setItem(
      StorageKeys.SESSION_SUCCESS_COUNT,
      isSuccessfulResult
        ? currentSuccesfulContacts + 1
        : currentSuccesfulContacts
    ),
  ]);
};

const LeadsProvider = ({ children }) => {
  const router = useRouter();
  const { tab, active } = router.query;
  const [values, dispatch] = useReducer(
    leadsReducer,
    getInitialLeadState(active, tab)
  );
  const { activeLeadId, activeTab, error, isLoading, leads } = values;
  const { mobilizeEvent, fetchEvent } = useContext(MobilizeContext);
  const [hasInitialized, setHasInitialized] = useState(false);

  const activeLead = useMemo(
    () => leads.find(({ id }) => id === activeLeadId),
    [activeLeadId, leads]
  );

  const fetchCurrentLeads = async () => {
    dispatch({ type: Actions.UPDATE_LOADING, value: true });
    try {
      const response = (await api.get('/vol_prospect_assignments/')).data;
      dispatch({ type: Actions.LEADS_FETCHED, leads: response });
    } catch (err) {
      dispatch({ type: Actions.HAS_ERROR, value: err.message });
    }
  };

  const assignLeads = async (params = {}) => {
    dispatch({ type: Actions.UPDATE_LOADING, value: true });
    try {
      await api.post('/vol_prospect_assignments/assign/', params);
      const { data } = await api.get('/vol_prospect_assignments/');
      dispatch({ type: Actions.LEADS_FETCHED, leads: data });
    } catch (err) {
      dispatch({ type: Actions.HAS_ERROR, value: err.message });
    }
  };

  const createContactEvent = async ({ formState, lead, showNext }) => {
    const { note, result, resultCategory, status, timeslots = [] } = formState;
    const isSuccessfulResult =
      resultCategory === LeadEventCategories.SUCCESSFUL;
    dispatch({ type: Actions.UPDATE_LOADING, value: true });
    try {
      const params = {
        vol_prospect_assignment: lead.id,
        result: isSuccessfulResult ? SUCCESSFUL_CANVASSED : result,
        note,
        ...(isSuccessfulResult && {
          metadata: {
            status,
          },
        }),
      };
      if (status === LOCAL_EVENT && timeslots.length && mobilizeEvent) {
        params.ma_event_id = mobilizeEvent.id;
        params.ma_timeslot_ids = timeslots.map(item => parseInt(item, 10));
      }
      const contactEvent = (
        await api.post('/vol_prospect_contact_events/', params)
      ).data;
      await incrementActivityCount(isSuccessfulResult);
      dispatch({
        type: Actions.UPDATE_LEAD,
        activeLeadId: lead.id,
        formState,
        contactEvent,
        activeLeadStatus: lead.status,
        showNext,
      });
    } catch (err) {
      dispatch({ type: Actions.HAS_ERROR, value: err.message });
    }
  };

  const changeTab = newTab =>
    dispatch({ type: Actions.UPDATE_ACTIVE_TAB, tab: newTab });

  const changeActiveUser = id =>
    dispatch({
      type: Actions.UPDATE_ACTIVE_LEAD_ID,
      id,
    });

  const skip = async lead => {
    dispatch({ type: Actions.UPDATE_LOADING, value: true });
    try {
      await api.patch(`/vol_prospect_assignments/${lead.id}/`, {
        status: SKIPPED,
      });
      dispatch({
        type: Actions.SKIP_LEAD,
        id: lead.id,
        previousStatus: lead.status,
      });
    } catch (err) {
      dispatch({ type: Actions.HAS_ERROR, value: err.message });
    }
  };

  const sortedLeads = useMemo(
    () =>
      leads.reduce(
        (obj, lead) => {
          const group = getTabStatusGroup(lead.status);
          if (group) {
            obj[group.toLowerCase()].push(lead);
          }
          return obj;
        },
        {
          [Categories.UNCONTACTED.toLowerCase()]: [],
          [Categories.UNSUCCESSFUL.toLowerCase()]: [],
          [Categories.SUCCESSFUL.toLowerCase()]: [],
        }
      ),
    [leads]
  );

  useEffect(() => {
    Promise.all([fetchEvent(router.query.event), fetchCurrentLeads()]).then(
      () => {
        setHasInitialized(true);
      }
    );
  }, []);

  useEffect(() => {
    const { query } = router;
    const id = parseInt(query.active, 10);
    if (query.active && !Number.isNaN(id) && id !== values.activeLeadId) {
      changeActiveUser(id);
    }
    if (query.tab && query.tab !== values.activeTab) {
      changeTab(tab);
    }
    if (
      query.event &&
      (!mobilizeEvent || `${mobilizeEvent.id}` !== query.event)
    ) {
      fetchEvent(query.event);
    }
  }, [router.query]);

  useEffect(() => {
    if (!hasInitialized) return;
    const query = { tab: values.activeTab };
    if (values.activeLeadId) {
      query.active = values.activeLeadId;
    }
    if (mobilizeEvent) {
      query.event = mobilizeEvent.id;
    }
    router.push({
      pathname: router.pathname,
      query,
    });
  }, [hasInitialized, values.activeLeadId, values.activeTab, mobilizeEvent]);

  return (
    <LeadsContext.Provider
      value={{
        // From reducer
        activeLeadId,
        activeTab,
        error,
        isLoading,
        leads,
        // From component
        activeLead,
        assignLeads,
        changeActiveUser,
        changeTab,
        createContactEvent,
        hasInitialized,
        skip,
        sortedLeads,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

LeadsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LeadsProvider;
