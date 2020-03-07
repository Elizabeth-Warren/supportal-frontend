const AuthPolicies = Object.freeze({
  ADMIN_ONLY: 'ADMIN_ONLY',
  AUTHENTICATED_ONLY: 'AUTHENTICATED_ONLY',
  AUTHENTICATED_WITH_PROFILE_ONLY: 'AUTHENTICATED_WITH_PROFILE_ONLY',
  ANONYMOUS_ONLY: 'ANONYMOUS_ONLY',
  ANY: 'ANY',
});

export default AuthPolicies;
