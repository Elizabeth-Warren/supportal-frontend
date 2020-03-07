import PropTypes from 'prop-types';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import AuthPolicies from '../constants/AuthPolicies';
import LoadingScreen from './LoadingScreen';
import useAuthGuard from '../hooks/useAuthGuard';

const RouteGuard = ({ authPolicy, children }) => {
  const Auth = useContext(AuthContext);
  if (authPolicy !== AuthPolicies.ANY) {
    const routeValidated = useAuthGuard({ Auth, authPolicy });

    if (!routeValidated) {
      return <LoadingScreen />;
    }
  }
  return children;
};

RouteGuard.propTypes = {
  authPolicy: PropTypes.oneOf(Object.values(AuthPolicies)),
  children: PropTypes.node.isRequired,
};

RouteGuard.defaultProps = {
  authPolicy: AuthPolicies.ANY,
};

export default RouteGuard;
