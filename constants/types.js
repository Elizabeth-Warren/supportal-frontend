import {
  func,
  object,
  shape,
  oneOf,
  arrayOf,
  string,
  bool,
  number,
} from 'prop-types';

import {
  Successful,
  VOL_PROSPECT_CONTACT_EVENT_RESULTS,
  LEAD_STATUSES,
} from './leadStatuses';

export const VolProspectContactEventType = shape({
  id: number,
  created_at: string,
  // metadata only exists if event is successful
  metadata: shape({
    status: oneOf(['SPECIFIC_EVENT', ...Object.keys(Successful)]),
  }),
  result: oneOf(VOL_PROSPECT_CONTACT_EVENT_RESULTS),
  vol_prospect_assignment: number,
});

export const LeadType = shape({
  id: number.isRequired,
  person: shape({
    first_name: string.isRequired,
    last_name: string.isRequired,
    phone: string.isRequired,
    city: string.isRequired,
    state: string.isRequired,
  }),
  created_at: string.isRequired,
  expired_at: string,
  status: oneOf(LEAD_STATUSES),
  vol_prospect_contact_events: arrayOf(VolProspectContactEventType),
});

export const UserAuthType = shape({
  userId: string.isRequired,
  idToken: string.isRequired,
  timestamp: string,
  authenticated: bool.isRequired,
});

export const UserProfileType = shape({
  id: number.isRequired,
  email: string.isRequired,
  first_name: string,
  last_name: string,
  phone: string,
  address: string,
  city: string,
  state: string,
  zip5: string,
  coordinates: string,
  self_reported_team_name: string,
  created_at: string,
  updated_at: string,
});

export const AuthContextType = shape({
  answerCustomChallenge: func.isRequired,
  checkAuthentication: func.isRequired,
  getPublicChallengeParameters: func.isRequired,
  hasInitialized: bool.isRequired,
  isAuthenticated: bool.isRequired,
  profile: UserProfileType,
  signIn: func.isRequired,
  signOut: func.isRequired,
  user: object,
});

export const MobilizeTimeslotType = shape({
  start_date: number.isRequired,
  end_date: number.isRequired,
  id: number,
  is_full: bool,
});

export const MobilizeLocationType = shape({
  venue: string,
  address_lines: arrayOf(string),
  locality: string,
  region: string,
  country: string,
  postal_code: string,
  location: shape({
    latitude: number,
    longitude: number,
  }),
  congressional_district: string,
  state_leg_district: string,
  state_senate_district: string,
});

export const MobilizeEventType = shape({
  tags: arrayOf(
    shape({
      id: number,
      name: string,
    })
  ),
  event_type: string,
  browser_url: string,
  description: string,
  title: string,
  high_priority: bool,
  timeslots: arrayOf(MobilizeTimeslotType),
  id: number,
  timezone: string,
  location: MobilizeLocationType,
});
