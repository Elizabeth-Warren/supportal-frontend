import Link from 'next/link';
import PropTypes from 'prop-types';
import { FocusOn } from 'react-focus-on';
import { VisuallyHidden } from '@ewarren/persist';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Logo from '../assets/logo-navy.svg';
import Portal from './Portal';

const OverlayNav = ({ onClose, items }) => {
  const router = useRouter();
  // Close the ovleray nav after a user clicks on an internal link.
  useEffect(() => {
    const handleRouteChange = () => {
      onClose();
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    // Return clean up function.
    return router.events.off('routeChangeComplete', handleRouteChange);
  }, []);

  return (
    <Portal id="mobile-nav">
      <FocusOn onClickOutside={onClose} onEscapeKey={onClose}>
        <div className="fixed flex flex-col inset-0 bg-liberty z-30">
          <div className="bg-liberty flex p-4 sticky top-0">
            <Link href="/">
              <a className="mr-auto" name="Home" aria-label="Home">
                <Logo width={95} />
              </a>
            </Link>
            <button
              className="absolute leading-none mr-4 mt-2 right-0 text-2xl top-0"
              type="button"
              onClick={onClose}
            >
              <VisuallyHidden>Close</VisuallyHidden>
              <span aria-hidden>&times;</span>
            </button>
          </div>
          <div className="flex flex-col items-center flex-grow overflow-auto px-4 pb-4 text-navy text-xl">
            {items.map(({ key, component }) => (
              <div className="mt-12" key={key}>
                {component}
              </div>
            ))}
          </div>
        </div>
      </FocusOn>
    </Portal>
  );
};

OverlayNav.propTypes = {
  onClose: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      component: PropTypes.node.isRequired,
    })
  ),
};

OverlayNav.defaultProps = {
  onClose: () => {},
  items: [],
};

export default OverlayNav;
