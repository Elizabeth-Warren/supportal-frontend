import AuthPolicies from '../../../constants/AuthPolicies';
import GlitterCompose from '../../../components/glitter/GlitterCompose';
import RouteGuard from '../../../components/RouteGuard';

const Glitter = () => {
  return (
    <RouteGuard authPolicy={AuthPolicies.AUTHENTICATED_WITH_PROFILE_ONLY}>
      <GlitterCompose />
    </RouteGuard>
  );
};

export default Glitter;
