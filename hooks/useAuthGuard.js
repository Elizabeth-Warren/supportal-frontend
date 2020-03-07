import Router from 'next/router';
import localforage from 'localforage';
import { useEffect, useState } from 'react';
import AuthPolicies from '../constants/AuthPolicies';
import StorageKeys from '../constants/StorageKeys';

const { LOGIN_REDIRECT } = StorageKeys;

const cacheAuthenticatedRouteAndRedirect = () => {
  localforage.setItem(LOGIN_REDIRECT, Router.asPath);
  Router.replace('/login');
};

const redirectFromCache = async () => {
  const route = (await localforage.getItem(LOGIN_REDIRECT)) || '/';
  localforage.removeItem(LOGIN_REDIRECT);
  Router.replace(route);
};

const useAuthGuard = ({ Auth, authPolicy }) => {
  const {
    checkAuthentication,
    hasInitialized,
    isAuthenticated,
    profile,
  } = Auth;
  const [routeValidated, setRouteValidated] = useState(
    authPolicy === AuthPolicies.ANY
  );
  useEffect(() => {
    (async () => {
      if (!hasInitialized || authPolicy === AuthPolicies.ANY) {
        return;
      }
      const authenticated = await checkAuthentication();
      switch (authPolicy) {
        case AuthPolicies.ADMIN_ONLY:
          if (!authenticated) {
            setRouteValidated(false);
            cacheAuthenticatedRouteAndRedirect();
            return;
          }
          if (!(profile && profile.is_admin)) {
            setRouteValidated(false);
            Router.replace('/');
          }
          break;
        case AuthPolicies.AUTHENTICATED_ONLY:
          if (!authenticated) {
            setRouteValidated(false);
            cacheAuthenticatedRouteAndRedirect();
            return;
          }
          break;
        case AuthPolicies.AUTHENTICATED_WITH_PROFILE_ONLY:
          if (!authenticated) {
            setRouteValidated(false);
            cacheAuthenticatedRouteAndRedirect();
            return;
          }
          if (!profile || !profile.coordinates) {
            setRouteValidated(false);
            Router.replace('/user/profile');
            return;
          }
          break;
        case AuthPolicies.ANONYMOUS_ONLY:
          if (authenticated) {
            setRouteValidated(false);
            await redirectFromCache();
            return;
          }
          break;
        default:
          break;
      }
      setRouteValidated(true);
    })();
  }, [hasInitialized, isAuthenticated]);
  return routeValidated;
};

export default useAuthGuard;
