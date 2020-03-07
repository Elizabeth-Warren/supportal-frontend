import { useContext } from 'react';
import AnnularThrobber from './AnnularThrobber';
import LeadsLayout from './LeadsLayout';
import LeadContactCard from './LeadContactCard';
import LeadList from './LeadList';
import LeadsContext from '../contexts/LeadsContext';
import useErrorMessage from '../hooks/useErrorMessage';
import useMobilizePromoToast from '../hooks/useMobilizePromoToast';

const LeadsPage = () => {
  const { error, hasInitialized } = useContext(LeadsContext);
  useErrorMessage(!!error, error);
  useMobilizePromoToast();

  const pageDescription = (
    <>
      Help Elizabeth’s supporters become volunteers! Your mission is to call
      volunteer prospects and sign them up for an event or training.
    </>
  );

  return (
    <LeadsLayout
      metaTitle="Switchboard"
      pageTitle="Switchboard: We've Got A Call for That"
      pageDescription={pageDescription}
    >
      {hasInitialized ? (
        <div className="md:px-4">
          <div className="max-w-section m-auto md:flex md:flex-row-reverse">
            <div className="mx-4 flex-shrink-none mb-12 md:w-1/2 md:mb-0 md:ml-2 lg:ml-auto md:mr-0">
              <LeadContactCard />
            </div>
            <div className="flex-grow lg:w-2/5 lg:flex-grow-0 md:mr-2">
              <LeadList />
            </div>
          </div>
        </div>
      ) : (
        <AnnularThrobber className="mx-auto mt-20" />
      )}
    </LeadsLayout>
  );
};

export default LeadsPage;
