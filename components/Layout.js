import BodyCopy from '@ewarren/persist/lib/components/BodyCopy';
import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import PropTypes from 'prop-types';
import LayoutHead from './LayoutHead';
import Nav from './Nav';
import Notifications from './Notifications';

const Layout = ({
  metaTitle,
  pageTitle,
  pageDescription,
  children,
  simple,
}) => (
  <div className="bg-offWhite min-h-screen font-sans text-black">
    <LayoutHead title={metaTitle} />
    <header className="bg-navy text-white px-4 pt-4 pb-8 md:pb-0">
      <Nav className="max-w-site mx-auto" simple={simple} />
      <div className="md:flex m-auto max-w-section px-4 py-6 md:py-16 md:px-0">
        <WideHeadline
          as="h1"
          size={WideHeadlineSizes.MD}
          className="mb-4 md:w-2/5 md:mr-2 md:flex-shrink-0"
        >
          {pageTitle}
        </WideHeadline>
        <BodyCopy as="p">{pageDescription}</BodyCopy>
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

Layout.propTypes = {
  metaTitle: PropTypes.string,
  pageTitle: PropTypes.node.isRequired,
  pageDescription: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  simple: PropTypes.bool,
};

Layout.defaultProps = {
  metaTitle: null,
  simple: false,
};

export default Layout;
