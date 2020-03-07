import PropTypes from 'prop-types';
import localforage from 'localforage';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import ErrorMessages from '../constants/ErrorMessages';
import StorageKeys from '../constants/StorageKeys';
import api from '../services/api';
import getFormattedPhone from '../util/getFormattedPhone';

const Auth = typeof window !== 'undefined' ? require('aws-amplify').Auth : {};

const AuthProvider = ({ children }) => {
  const userPool = new CognitoUserPool({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID,
  });

  const [user, setUser] = useState(userPool.getCurrentUser());
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [hasInitialized, setInitialized] = useState(false);

  /**
   * Begins signing in the user. This checks for existence of the user and if
   * successful starts a session. The user is not fully authenticated yet. They
   * still must answer the custom challenge (enter a code sent to their email).
   * @param {string} email
   * @returns {Promise}
   */
  const signIn = async email => {
    setUser(await Auth.signIn(email.trim().toLowerCase()));
  };

  /**
   * Signs out the user, resets auth to the default state, and clears out
   * locally persisted state.
   * @returns {Promise}
   */
  const signOut = async () => {
    await Auth.signOut();
    setAuthenticated(false);
    setUser(userPool.getCurrentUser());
    setProfile(null);
    window.setTimeout(() => {
      // This is in a timeout because we want to give React a chance to redirect
      // the user from the possibly authenticated page they were on to the
      // login page. Redirection due to auth policy sets a post-login redirect
      // in localforage which we want to wait to clear out along with everything
      // else in localforage.
      localforage.clear();
    }, 0);
  };

  /**
   * Gets profile data from localforage if available, otherwise hits the API.
   * The `force` param can be set to true to always request from the API.
   * @private
   * @param {boolean} force
   * @returns {Promise}
   */
  const fetchProfile = async force => {
    let profileData = await localforage.getItem(StorageKeys.USER_PROFILE);
    if (!profileData || force) {
      profileData = (await api.get('/me')).data;
    }
    setProfile(profileData);
    localforage.setItem(StorageKeys.USER_PROFILE, profileData);
  };

  /**
   * Checks if the current user's session has been authenticated.
   * @returns {Promise<boolean>}
   */
  const checkAuthentication = async () => {
    let result;
    try {
      await Auth.currentSession();
      result = true;
    } catch (err) {
      result = false;
    } finally {
      setAuthenticated(result);
    }
    return result;
  };

  /**
   * Used during the sign in process to submit the user's secret code. Since
   * logging in changes the auth status we're essentially re-initializing the
   * auth while we wait for the profile API response.
   * @param {string} answer - six-digit code emailed to the user after they
   *   submit their email using the `signIn` method.
   * @returns {Promise}
   */
  const answerCustomChallenge = async answer => {
    setInitialized(false);
    const validatedUser = await Auth.sendCustomChallengeAnswer(user, answer);
    setUser(validatedUser);
    const isValidUser = await checkAuthentication();
    if (isValidUser) {
      await fetchProfile(true);
      setInitialized(true);
    } else {
      setInitialized(true);
      throw new Error(ErrorMessages.INCORRECT_CODE);
    }
  };

  /**
   * Returns the user's "challenge parameters" which is really just an object
   * with the user's email. Used during the secret code sign in process.
   * @returns {object}
   */
  const getPublicChallengeParameters = () => user && user.challengeParam;

  /**
   * Updates the user's profile with a given set of values via the API.
   * @param {object} values
   * @returns {Promise}
   */
  const updateProfile = async values => {
    const phone = values.phone
      ? `+1${getFormattedPhone(values.phone, true)}`
      : '';
    const profileData = (await api.patch('/me', { ...values, phone })).data;
    setProfile(profileData);
    localforage.setItem(StorageKeys.USER_PROFILE, profileData);
  };

  /**
   * Wrap cognito's getSession method and callback in a Promise for sanity.
   * @private
   * @returns {Promise}
   */
  const getSession = () =>
    new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error(ErrorMessages.NOT_LOGGED_IN));
        return;
      }
      user.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }
        if (!session.isValid()) {
          reject(new Error(ErrorMessages.INVALID_SESSION));
          return;
        }
        resolve();
      });
    });

  /**
   * When the app first boots up, this checks for the user's session and
   * profile. When the check is complete, we affirm that the auth has
   * initialized.
   */
  useEffect(() => {
    (async () => {
      if (user) {
        try {
          await getSession();
          const authenticated = await checkAuthentication();
          if (authenticated) {
            await fetchProfile(true);
          }
        } finally {
          setInitialized(true);
        }
      } else {
        setInitialized(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!window.heap) {
        return;
      }
      const currentUserInfo = await Auth.currentUserInfo();
      if (currentUserInfo) {
        window.heap.identify(currentUserInfo.username);
      } else {
        window.heap.resetIdentity();
      }
    })();
  }, [user]);

  const value = {
    answerCustomChallenge,
    checkAuthentication,
    getPublicChallengeParameters,
    hasInitialized,
    isAuthenticated,
    profile,
    signIn,
    signOut,
    updateProfile,
    user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
