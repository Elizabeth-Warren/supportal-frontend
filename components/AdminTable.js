import PropTypes from 'prop-types';
import theme from '@ewarren/persist/lib/theme';
import { VisuallyHidden, useBreakpoint } from '@ewarren/persist';
import AdminTableRow from './AdminTableRow';
import { UserProfileType } from '../constants/types';

const AdminTable = ({ users }) => {
  const { isAbove } = useBreakpoint(theme.screens);
  const colWidth = 'calc((100% - 500px) / 3)';
  return (
    <table className="w-full table-fixed">
      <thead className="border-b-3 border-b-navy">
        <tr>
          <th
            className="font-normal pb-2 text-base text-left"
            style={{ width: isAbove('md') ? '300px' : '100%' }}
          >
            Email
          </th>
          {isAbove('md') && (
            <>
              <th
                className="font-normal pb-2 text-base text-left"
                style={{ width: colWidth }}
              >
                First Name
              </th>
              <th
                className="font-normal pb-2 text-base text-left"
                style={{ width: colWidth }}
              >
                Last Name
              </th>
              <th
                className="font-normal pb-2 text-base text-left"
                style={{ width: colWidth }}
              >
                City
              </th>
              <th
                className="font-normal pb-2 text-base text-left"
                style={{ width: '100px' }}
              >
                Status
              </th>
            </>
          )}
          <th style={{ width: '100px' }}>
            <VisuallyHidden>Action</VisuallyHidden>
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <AdminTableRow key={user.id} user={user} isFullView={isAbove('md')} />
        ))}
      </tbody>
    </table>
  );
};

AdminTable.propTypes = {
  users: PropTypes.arrayOf(UserProfileType),
};

AdminTable.defaultProps = {
  users: [],
};

export default AdminTable;
