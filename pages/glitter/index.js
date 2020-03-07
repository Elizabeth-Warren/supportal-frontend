import AuthPolicies from '../../constants/AuthPolicies';
import GlitterPage from '../../components/glitter/GlitterPage';
import RouteGuard from '../../components/RouteGuard';

const Glitter = () => {
  return (
    <RouteGuard authPolicy={AuthPolicies.AUTHENTICATED_WITH_PROFILE_ONLY}>
      <GlitterPage />
    </RouteGuard>
  );
};

export default Glitter;
