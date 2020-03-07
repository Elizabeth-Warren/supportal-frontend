import BodyCopy from '@ewarren/persist/lib/components/BodyCopy';
import PropTypes from 'prop-types';
import LayoutHead from './LayoutHead';
import Nav from './Nav';
import Notifications from './Notifications';

const WallLayout = ({ metaTitle, children, simple }) => (
  <div className="bg-navy min-h-screen font-sans text-white">
    <LayoutHead title={metaTitle} />
    <Notifications className="sticky top-0 z-10" />
    <header className="px-4 py-4">
      <Nav simple={simple} className="max-w-site mx-auto" />
    </header>
    <BodyCopy as="main">{children}</BodyCopy>
  </div>
);

WallLayout.propTypes = {
  metaTitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  simple: PropTypes.bool,
};

WallLayout.defaultProps = {
  metaTitle: null,
  simple: true,
};

export default WallLayout;
