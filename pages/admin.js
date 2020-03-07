import AuthPolicies from '../constants/AuthPolicies';
import AdminPage from '../components/AdminPage';
import SwitchboardAdminProvider from '../components/SwitchboardAdminProvider';
import RouteGuard from '../components/RouteGuard';

const Admin = () => {
  return (
    <RouteGuard authPolicy={AuthPolicies.ADMIN_ONLY}>
      <SwitchboardAdminProvider>
        <AdminPage />
      </SwitchboardAdminProvider>
    </RouteGuard>
  );
};

export default Admin;
