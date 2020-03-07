import cases from 'jest-in-case';

import leadsReducer, { getInitialLeadState, Actions } from './leads';
import leadBaseShape from '../tests/fixtures/lead.json';
import {
  TabStatus,
  Categories,
  SUCCESSFUL_CANVASSED,
} from '../constants/leadStatuses';

/**
 * Creates a list of leads, based upon the `leadBaseShape` fixture
 * @param {object} changedProps provides the properties that should differ
 * from the leadBaseShape fixture base.
 * @returns {array} List of leads, with id incrementing.
 */
const getLeadsFromBase = changedProps =>
  changedProps.map((change, i) => ({
    ...leadBaseShape,
    id: i,
    user: i,
    ...changedProps[i],
  }));

const baseState = {
  leads: [],
  isLoading: true,
  error: null,
  activeLeadId: null,
  activeTab: Categories.UNCONTACTED.toLowerCase(),
};

describe('leads reducer', () => {
  cases(
    `tests ${Actions.LEADS_FETCHED}`,
    ({ state, action, resultingChange }) => {
      expect(leadsReducer(state, action)).toMatchObject({
        ...state,
        ...resultingChange,
      });
    },
    {
      'fetches and updates': {
        state: baseState,
        action: {
          type: Actions.LEADS_FETCHED,
          leads: [leadBaseShape],
        },
        resultingChange: { isLoading: false, leads: [leadBaseShape] },
      },
    }
  );

  cases(
    `tests ${Actions.UPDATE_ACTIVE_TAB}`,
    ({ changedState, actionProps, resultingChange }) => {
      const state = {
        ...baseState,
        isLoading: false,
        activeLeadId: 0,
        leads: getLeadsFromBase(
          Object.values(TabStatus).map(status => ({
            status,
          }))
        ),
      };
      const finalState = { ...state, ...changedState };

      expect(
        leadsReducer(finalState, {
          ...actionProps,
          type: Actions.UPDATE_ACTIVE_TAB,
        })
      ).toMatchObject({
        ...finalState,
        ...resultingChange,
      });
    },
    {
      'changes tab and finds new activeLeadId': {
        actionProps: {
          activeTab: 'attempted',
        },
        resultingChange: {
          activeTab: 'attempted',
          activeLeadId: 1,
        },
      },
      'changes tab and misses new activeLeadId': {
        changedState: {
          leads: getLeadsFromBase([
            { status: TabStatus.NEW },
            { status: TabStatus.UNSUCCESSFUL },
          ]),
        },
        actionProps: {
          activeTab: 'successful',
        },
        resultingChange: {
          activeTab: 'successful',
          activeLeadId: undefined,
        },
      },
    }
  );

  cases(
    `tests ${Actions.UPDATE_LEAD}`,
    ({ changedState, actionProps, resultingChange }) => {
      const state = {
        ...baseState,
        activeLeadId: 0,
        leads: [],
      };
      const finalState = { ...state, ...changedState };

      expect(
        leadsReducer(finalState, {
          ...actionProps,
          showNext: true,
          type: Actions.UPDATE_LEAD,
        })
      ).toMatchObject({
        ...finalState,
        ...resultingChange,
      });
    },
    {
      'Moves one from list of uncontacted to successful': {
        changedState: {
          leads: getLeadsFromBase([
            { status: TabStatus.NEW },
            { status: TabStatus.NEW },
            { status: TabStatus.NEW },
          ]),
        },
        actionProps: {
          activeLeadId: 0,
          formState: {
            resultCategory: 'SUCCESSFUL',
            result: SUCCESSFUL_CANVASSED,
            status: 'LOCAL_EVENT',
          },
          activeLeadStatus: TabStatus.NEW,
        },
        resultingChange: {
          activeLeadId: 1,
          isLoading: false,
          leads: getLeadsFromBase([
            {
              status: TabStatus.SUCCESSFUL,
              vol_prospect_contact_events: [
                {
                  metadata: { status: 'LOCAL_EVENT' },
                  result: 'SUCCESSFUL_CANVASSED',
                  result_category: 'SUCCESSFUL',
                },
              ],
            },
            { status: TabStatus.NEW },
            { status: TabStatus.NEW },
          ]),
        },
      },
      'Moves last from assigned list to succesful': {
        changedState: {
          leads: getLeadsFromBase([{ status: TabStatus.NEW }]),
        },
        actionProps: {
          activeLeadId: 0,
          formState: {
            resultCategory: 'SUCCESSFUL',
            result: null,
            status: 'ONE_ON_ONE',
          },
          activeLeadStatus: 'ASSIGNED',
        },
        resultingChange: {
          activeLeadId: null,
          isLoading: false,
          leads: getLeadsFromBase([
            {
              status: TabStatus.SUCCESSFUL,
              vol_prospect_contact_events: [
                {
                  metadata: { status: 'ONE_ON_ONE' },
                  result: null,
                  result_category: 'SUCCESSFUL',
                },
              ],
            },
          ]),
        },
      },
      'Moves last from unsucccessful list to succesful': {
        changedState: {
          leads: getLeadsFromBase([{ status: TabStatus.UNSUCCESSFUL }]),
          activeTab: 'attempted',
        },
        actionProps: {
          activeLeadId: 0,
          formState: {
            resultCategory: 'SUCCESSFUL',
            result: SUCCESSFUL_CANVASSED,
            status: 'LOCAL_EVENT',
          },
          activeLeadStatus: TabStatus.UNSUCCESSFUL,
        },
        resultingChange: {
          activeTab: 'attempted',
          activeLeadId: null,
          isLoading: false,
          leads: getLeadsFromBase([
            {
              status: TabStatus.SUCCESSFUL,
              vol_prospect_contact_events: [
                {
                  metadata: { status: 'LOCAL_EVENT' },
                  result: 'SUCCESSFUL_CANVASSED',
                  result_category: 'SUCCESSFUL',
                },
              ],
            },
          ]),
        },
      },
      'Moves last from list of uncontacted to unreachable': {
        changedState: {
          leads: getLeadsFromBase([{ status: TabStatus.NEW }]),
        },
        actionProps: {
          activeLeadId: 0,
          formState: {
            resultCategory: 'UNAVAILABLE',
            result: 'UNREACHABLE_WRONG_NUMBER',
            status: null,
          },
          activeLeadStatus: TabStatus.NEW,
        },
        resultingChange: {
          activeLeadId: null,
          isLoading: false,
          leads: [],
        },
      },
    }
  );

  cases(
    `tests ${Actions.SKIP_LEAD}`,
    ({ changedState, actionProps, resultingChange }) => {
      const state = {
        ...baseState,
        activeLeadId: 0,
        leads: getLeadsFromBase([{ status: TabStatus.NEW }]),
      };
      const finalState = { ...state, ...changedState };
      expect(
        leadsReducer(finalState, {
          ...actionProps,
          type: Actions.SKIP_LEAD,
        })
      ).toMatchObject({
        ...finalState,
        ...resultingChange,
      });
    },
    {
      'Removes (skips) uncontacted (list of one)': {
        actionProps: {
          id: 0,
        },
        resultingChange: {
          activeLeadId: null,
          isLoading: false,
          leads: [],
        },
      },
    }
  );
});

describe('leads initializer', () => {
  cases(
    'initializes reducer',
    ({ routerActiveLeadId, routerActiveTab, resultingChange }) => {
      const initialState = getInitialLeadState(
        routerActiveLeadId,
        routerActiveTab
      );
      expect(initialState).toMatchObject({
        ...baseState,
        ...resultingChange,
      });
    },
    {
      'no parameters': {
        routerActiveLeadId: undefined,
        routerActiveTab: undefined,
        resultingChange: {
          activeLeadId: null,
          activeTab: 'new',
        },
      },
      'routerActiveTab given, no activeLeadId': {
        routerActiveLeadId: undefined,
        routerActiveTab: 'successful',
        resultingChange: {
          activeLeadId: null,
          activeTab: 'successful',
        },
      },
      'no routerActiveTab, activeLeadId given': {
        routerActiveLeadId: 1,
        routerActiveTab: undefined,
        resultingChange: {
          activeLeadId: 1,
          activeTab: 'new',
        },
      },
      'routerActiveTab incorrect, no activeLeadId': {
        routerActiveLeadId: undefined,
        routerActiveTab: 'someothername',
        resultingChange: {
          activeLeadId: null,
          activeTab: 'new',
        },
      },
    }
  );
});
