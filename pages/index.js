import AuthPolicies from '../constants/AuthPolicies';
import LeadsPage from '../components/LeadsPage';
import LeadsProvider from '../components/LeadsProvider';
import MobilizeProvider from '../components/MobilizeProvider';
import RouteGuard from '../components/RouteGuard';

const Lead = () => {
  return (
    <RouteGuard authPolicy={AuthPolicies.AUTHENTICATED_WITH_PROFILE_ONLY}>
      <MobilizeProvider>
        <LeadsProvider>
          <LeadsPage />
        </LeadsProvider>
      </MobilizeProvider>
    </RouteGuard>
  );
};

export default Lead;
