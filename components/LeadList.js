import theme from '@ewarren/persist/lib/theme';
import { useContext } from 'react';
import AnnularThrobber from './AnnularThrobber';
import LeadsContext from '../contexts/LeadsContext';
import LeadListItem from './LeadListItem';
import RequestLeads from './RequestLeads';
import scrollToContentTop from '../util/scrollToContentTop';
import { Categories } from '../constants/leadStatuses';

const LeadList = () => {
  const {
    isLoading,
    changeTab,
    sortedLeads,
    activeLeadId,
    activeTab,
    changeActiveUser,
  } = useContext(LeadsContext);

  const handleChange = e => {
    changeActiveUser(parseInt(e.target.value, 10));
    scrollToContentTop();
  };

  return (
    <div>
      <div className="flex mb-1 text-xs sm:text-sm -mx-1">
        {Object.values(Categories).map(category => {
          const val = category.toLowerCase();
          const className = [
            'block',
            'flex-grow',
            'mx-1',
            'py-1',
            'text-center',
          ];
          if (val === activeTab) {
            className.push('bg-white');
          } else {
            className.push('bg-grey');
          }
          return (
            <a
              href={`#${val}`}
              className={className.join(' ')}
              onClick={e => {
                e.preventDefault();
                changeTab(val);
              }}
              key={val}
            >
              <span>{category}</span>
              {sortedLeads && sortedLeads[val] && (
                <b className="ml-2">{sortedLeads[val].length}</b>
              )}
            </a>
          );
        })}
      </div>
      <div className="px-0">
        <div className="bg-white" id={activeTab}>
          <div className="mx-5 pt-3 pb-2 border-b-3 border-b-black flex justify-between">
            <div className="text-sm">Prospect</div>
            <div className="text-sm">Time left to contact</div>
          </div>
        </div>
        {sortedLeads[activeTab] && !sortedLeads[activeTab].length && (
          <div className="bg-white p-5">
            {isLoading && (
              <AnnularThrobber
                background={theme.colors.white}
                className="m-auto"
              />
            )}
            {!isLoading && (
              <>
                {activeTab === Categories.UNCONTACTED.toLowerCase() && (
                  <RequestLeads />
                )}
                {activeTab !== Categories.UNCONTACTED.toLowerCase() && (
                  <p className="mb-2 text-center">No results yet.</p>
                )}
              </>
            )}
          </div>
        )}
        {sortedLeads[activeTab].map(lead => (
          <LeadListItem
            key={lead.id}
            lead={lead}
            isActive={lead.id === activeLeadId}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
};

export default LeadList;
