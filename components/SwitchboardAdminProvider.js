import PropTypes from 'prop-types';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../contexts/AuthContext';
import stateHash from '../assets/us-state-hash.json';
import SwitchboardAdminContext from '../contexts/SwitchboardAdminContext';
import api from '../services/api';

const SwitchboardAdminProvider = ({ children }) => {
  const router = useRouter();
  const { profile } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [userMeta, setUserMeta] = useState({});
  const [filterParams, setFilterParams] = useState({
    ordering: 'state,city,email',
    state: router.query.state || (profile && profile.state) || 'all',
    page:
      (router.query.page &&
        !Number.isNaN(router.query.page) &&
        parseInt(router.query.page, 10)) ||
      1,
    page_size: 100,
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);

  const updateFilter = options => {
    if (isBusy) return;
    const newFilterState = { ...filterParams, ...options };
    setFilterParams(newFilterState);
  };

  const fetchUsers = async () => {
    if (isBusy) return;
    setIsBusy(true);
    const params = { ...filterParams };
    if (params.state === 'all') {
      delete params.state;
    }
    try {
      const { data } = await api.get('/users/', { params });
      setUserData(data);
    } catch (err) {
      setError(err.message);
    }
    setIsBusy(false);
  };

  const fetchUserMeta = async () => {
    const { data } = await api.get('/users/meta/');
    setUserMeta(data);
  };

  const sortedUsers = useMemo(() => {
    const userObj = userData.results.reduce((obj, user) => {
      const { state } = user;
      const newObj = { ...obj };
      const newUserCollection = obj[state] || [];
      newObj[state] = sortBy([...newUserCollection, user], ['city', 'email']);
      return newObj;
    }, {});
    const entries = sortBy(Object.entries(userObj), 0).map(
      ([state, stateUsers]) => {
        const stateName = state ? stateHash[state] : 'Undeclared';
        return [[stateName, state], stateUsers];
      }
    );
    return entries;
  }, [userData]);

  const addUser = async options => {
    setError(null);
    try {
      const { data } = await api.post('/users/', options);
      if (userData.results.find(user => user.id === data.id)) {
        throw new Error(`${options.email} already exists`);
      } else {
        fetchUserMeta();
        fetchUsers();
      }
    } catch (err) {
      const message = get(err, 'response.data.message', err.message);
      setError(`${message}.`);
    }
  };

  const removeUser = async id => {
    try {
      await api.delete(`/users/${id}/`);
      fetchUserMeta();
      fetchUsers();
    } catch (err) {
      const message = get(err, 'response.data.message', err.message);
      setError(`${message}.`);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchUserMeta(), fetchUsers()]);
      setHasInitialized(true);
    })();
  }, []);

  useEffect(() => {
    const { query } = router;
    const newParams = {};
    const newPage = parseInt(query.page, 10);
    if (newPage && !Number.isNaN(newParams) && newPage !== filterParams.page) {
      newParams.page = newPage;
    }
    if (query.state && query.state !== filterParams.state) {
      newParams.state = query.state;
    }
    if (Object.keys(newParams).length) {
      setFilterParams({ ...filterParams, ...newParams });
    }
  }, [router.query]);

  useEffect(() => {
    (async () => {
      await fetchUsers();
      const { state, page } = filterParams;
      router.push({
        pathname: router.pathname,
        query: { state, page },
      });
    })();
  }, [filterParams]);

  return (
    <SwitchboardAdminContext.Provider
      value={{
        addUser,
        error,
        filterParams,
        hasInitialized,
        isBusy,
        removeUser,
        sortedUsers,
        userData,
        updateFilter,
        userMeta,
      }}
    >
      {children}
    </SwitchboardAdminContext.Provider>
  );
};

SwitchboardAdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SwitchboardAdminProvider;
