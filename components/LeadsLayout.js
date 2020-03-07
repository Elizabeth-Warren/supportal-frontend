import BodyCopy from '@ewarren/persist/lib/components/BodyCopy';
import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import EventSearchField from './EventSearchField';
import LayoutHead from './LayoutHead';
import LeadsLayoutHeaderEvent from './LeadsLayoutHeaderEvent';
import MobilizeContext from '../contexts/MobilizeContext';
import Nav from './Nav';
import Notifications from './Notifications';
import { Themes } from '../constants/formElements';

const LeadsLayout = ({ metaTitle, pageTitle, pageDescription, children }) => {
  const { mobilizeEvent } = useContext(MobilizeContext);

  return (
    <div className="bg-offWhite min-h-screen font-sans text-black">
      <LayoutHead title={metaTitle} />
      <header className="bg-navy text-white px-4 pt-4 pb-8 md:pb-0">
        <Nav className="max-w-site mx-auto" />
        <div className="md:flex m-auto max-w-section py-6 md:py-16">
          <div className="mb-4 md:mb-0 md:w-2/5 md:mr-2 md:flex-shrink-0">
            <WideHeadline
              as="h1"
              size={mobilizeEvent ? WideHeadlineSizes.SM : WideHeadlineSizes.MD}
              className="mb-4 "
            >
              {mobilizeEvent ? 'Sign volunteers up for' : pageTitle}
            </WideHeadline>
            <BodyCopy as="div">
              {mobilizeEvent ? (
                <LeadsLayoutHeaderEvent mobilizeEvent={mobilizeEvent} />
              ) : (
                pageDescription
              )}
            </BodyCopy>
          </div>
          <div className="md:ml-auto md:w-1/2">
            <p className="text-md">
              Step 1: Find an event to recruit for{' '}
              <a
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
                href="https://events.elizabethwarren.com"
              >
                here
              </a>
            </p>
            <p className="mb-4 text-md">
              Step 2: Copy and paste the link to the event in the field below
            </p>
            <EventSearchField
              initialValue={mobilizeEvent ? mobilizeEvent.browser_url : ''}
              showClear
              theme={Themes.INVERTED}
            />
          </div>
        </div>
      </header>
      <div id="content" className="relative">
        <Notifications className="-mt-8 mb-12 md:my-0 sticky md:absolute inset-x-0 top-0 z-10" />
        <BodyCopy as="main" className="-mt-8 mb-8 md:my-0 md:py-20">
          {children}
        </BodyCopy>
      </div>
    </div>
  );
};

LeadsLayout.propTypes = {
  metaTitle: PropTypes.string,
  pageTitle: PropTypes.node.isRequired,
  pageDescription: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

LeadsLayout.defaultProps = {
  metaTitle: null,
};

export default LeadsLayout;
