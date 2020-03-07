/**
 * ENUMS for {vol_prospect_contact_event.metadata.status}.
 */
export const DECLINED = 'DECLINED';
export const Successful = {
  LOCAL_EVENT: 'Scheduled for a local event',
  ONLINE_TRAINING: 'Scheduled for online training',
  ONE_ON_ONE: 'Scheduled for a one-on-one',
  [DECLINED]: 'Not scheduled for an event',
};

/**
 * ENUMS for {vol_prospect_contact_event.result}.
 * Can be verified server-side at:
 * https://github.com/Elizabeth-Warren/tc/blob/master/supportal/supportal/app/common/enums.py#L26-L35
 */
export const Unavailable = {
  UNAVAILABLE_CALL_BACK: 'Can’t talk right now/Not home',
  UNAVAILABLE_LEFT_MESSAGE: 'Left message',
  UNAVAILABLE_BUSY: 'Busy',
};

export const Unreachable = {
  UNREACHABLE_WRONG_NUMBER: 'Wrong number',
  UNREACHABLE_DISCONNECTED: 'Out of service',
  UNREACHABLE_REFUSED: 'Refused contact/Do not call',
  UNREACHABLE_MOVED: 'Moved',
  UNREACHABLE_DECEASED: 'Deceased',
};

export const SUCCESSFUL_CANVASSED = 'SUCCESSFUL_CANVASSED';

export const VOL_PROSPECT_CONTACT_EVENT_RESULTS = [
  SUCCESSFUL_CANVASSED,
  ...Object.keys({ ...Unavailable, ...Unreachable }),
];

/**
 * ENUMS for {lead.status}.
 * Can be verified server-side at:
 * https://github.com/Elizabeth-Warren/tc/blob/master/supportal/supportal/app/common/enums.py#L46-L50
 */
export const SKIPPED = 'SKIPPED';
export const CONTACTED_UNREACHABLE = 'CONTACTED_UNREACHABLE';

export const TabStatus = {
  NEW: 'ASSIGNED',
  ATTEMPTED: 'CONTACTED_UNAVAILABLE',
  SUCCESSFUL: 'CONTACTED_SUCCESSFUL',
};
export const LEAD_STATUSES = [
  SKIPPED,
  CONTACTED_UNREACHABLE,
  ...Object.values(TabStatus),
];

export const isUncontacted = status => status === TabStatus.NEW;
export const isUnsuccessful = status => status === TabStatus.ATTEMPTED;
export const isSuccessful = status => status === TabStatus.SUCCESSFUL;

export const isUnreachable = status => !!Unreachable[status];
export const isSkipped = status => status === SKIPPED;

// Categories values inform the text on each tab.
export const Categories = {
  UNCONTACTED: 'New',
  UNSUCCESSFUL: 'Attempted',
  SUCCESSFUL: 'Successful',
};

export const getTabStatusGroup = status => {
  if (isUncontacted(status)) {
    return Categories.UNCONTACTED;
  }
  if (isUnsuccessful(status)) {
    return Categories.UNSUCCESSFUL;
  }
  if (isSuccessful(status)) {
    return Categories.SUCCESSFUL;
  }
  return null;
};
