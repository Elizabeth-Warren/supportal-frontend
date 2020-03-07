import Button, { ButtonLevels } from '@ewarren/persist/lib/components/Button';
import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import dynamic from 'next/dynamic';
import get from 'lodash/get';
import { useContext, useMemo, useState } from 'react';
import AdminTable from './AdminTable';
import AnnularThrobber from './AnnularThrobber';
import Layout from './Layout';
import Pagination from './Pagination';
import SelectInput from './SelectInput';
import SwitchboardAdminContext from '../contexts/SwitchboardAdminContext';
import useErrorMessage from '../hooks/useErrorMessage';
import stateHash from '../assets/us-state-hash.json';

const AddUserModal = dynamic(import('./AddUserModal'));

const AdminPage = () => {
  const [isShowingAddModal, setShowingAddModal] = useState(false);
  const {
    error,
    filterParams,
    hasInitialized,
    isBusy,
    sortedUsers,
    updateFilter,
    userData,
    userMeta,
  } = useContext(SwitchboardAdminContext);
  useErrorMessage(!!error, error);

  const { page, page_size: pageSize, state: selectedState } = filterParams;

  const pageDescription = (
    <>
      Welcome to the Switchboard admin portal! To add a user click &ldquo;Add
      User&rdquo;. To remove a user click &ldquo;Revoke&rdquo; next to their
      name.
    </>
  );

  const stateOptions = useMemo(
    () => [
      {
        value: 'all',
        label: `All Users (${get(userMeta, 'all.count', 0)})`,
      },
      ...get(userMeta, 'states', []).map(({ state, count }) => ({
        value: state,
        label: `${state ? stateHash[state] || state : 'Undeclared'} (${count})`,
      })),
    ],
    [userMeta]
  );

  const handleStateSelect = e => {
    updateFilter({ page: 1, state: e.target.value });
  };

  const handlePaginationClick = val => updateFilter({ page: val });

  return (
    <Layout
      metaTitle="Switchboard Admin"
      pageTitle="Organizer Admin Portal"
      pageDescription={pageDescription}
    >
      {hasInitialized ? (
        <>
          <div className="max-w-section mx-auto mb-8 mt-16 md:-mt-12 px-8 xl:px-0">
            <div className="flex flex-wrap items-end">
              <Button
                type="button"
                level={ButtonLevels.INVERTED}
                onClick={() => {
                  setShowingAddModal(true);
                }}
                className="flex items-center mr-2 overflow-hidden"
              >
                <span className="text-3xl mr-2" style={{ lineHeight: 0 }}>
                  +
                </span>
                Add user
              </Button>
              <div className="mt-2 mr-auto">
                <SelectInput
                  id="selected-state"
                  options={stateOptions}
                  value={selectedState}
                  onChange={handleStateSelect}
                />
              </div>
              <div className="max-w-full mb-2 mt-4">
                <Pagination
                  totalItems={userData.count || 0}
                  currentPage={page}
                  pageSize={pageSize}
                  onClick={handlePaginationClick}
                />
              </div>
            </div>
          </div>
          <div className="bg-white max-w-section m-auto p-8 relative">
            {sortedUsers.map(([[state], stateUsers]) => (
              <div key={state} className="mb-8">
                <WideHeadline
                  as="h2"
                  className="pb-4"
                  size={WideHeadlineSizes.SM}
                >
                  {state}
                </WideHeadline>
                <AdminTable users={stateUsers} />
              </div>
            ))}
            <div className="w-full mt-8">
              <Pagination
                totalItems={userData.count || 0}
                currentPage={page}
                pageSize={pageSize}
                onClick={handlePaginationClick}
              />
            </div>
            {isBusy && (
              <div className="absolute bg-offWhite inset-0 opacity-50 py-32">
                <AnnularThrobber className="m-auto" />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-offWhite py-32">
          <AnnularThrobber className="m-auto" />
        </div>
      )}
      {isShowingAddModal && (
        <AddUserModal
          onClose={() => {
            setShowingAddModal(false);
          }}
        />
      )}
    </Layout>
  );
};

export default AdminPage;
