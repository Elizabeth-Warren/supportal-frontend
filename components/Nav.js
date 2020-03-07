import Link from 'next/link';
import PropTypes from 'prop-types';
import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import dynamic from 'next/dynamic';
import theme from '@ewarren/persist/lib/theme';
import { useBreakpoint } from '@ewarren/persist';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../contexts/AuthContext';
import Logo from '../assets/logo.svg';
import LogOutModal from './LogOutModal';
import OverlayNav from './OverlayNav';

const InviteFriendModal = dynamic(import('./InviteFriendModal'));

const Nav = ({ simple, className }) => {
  const [isShowingInviteModal, setShowingInviteModal] = useState(false);
  const [isShowingLogOutModal, setIsShowingLogOutModal] = useState(false);
  const [isShowingMobileNav, setIsShowingMobileNav] = useState(false);
  const { isAbove } = useBreakpoint(theme.screens);
  const { isAuthenticated, profile, signOut } = useContext(AuthContext);
  const isTabletOrGreater = isAbove('md');
  const router = useRouter();

  const showInviteModal = () => setShowingInviteModal(true);
  const hideInviteModal = () => setShowingInviteModal(false);

  useEffect(() => {
    if (isTabletOrGreater && isShowingMobileNav) {
      setIsShowingMobileNav(false);
    }
  }, [isTabletOrGreater]);

  const handleLogOut = e => {
    e.preventDefault();
    if (router.pathname === '/') {
      // If the user is on the main leads contact page, show a warning modal.
      setIsShowingLogOutModal(true);
      setIsShowingMobileNav(false);
    } else {
      signOut();
    }
  };

  const isCurrentLink = path => path === router.pathname;

  const NavItems = [];
  if (!simple) {
    if (profile && profile.is_admin) {
      NavItems.push({
        key: 'admin',
        component: (
          <Link href="/admin">
            <a className={isCurrentLink('/admin') ? 'underline' : ''}>Admin</a>
          </Link>
        ),
      });
    }
    if (profile && !profile.is_admin) {
      NavItems.push({
        key: 'invite',
        component: (
          <>
            <button type="button" onClick={showInviteModal}>
              Invite a friend
            </button>
            {isShowingInviteModal && (
              <InviteFriendModal onClose={hideInviteModal} />
            )}
          </>
        ),
      });
    }
    NavItems.push({
      key: 'community',
      component: (
        <a
          href="https://community.elizabethwarren.com/main/groups/36927/lounge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Community
        </a>
      ),
    });
    NavItems.push(
      isAuthenticated
        ? {
            key: 'log-out',
            component: (
              <button
                type="button"
                onClick={handleLogOut}
                data-tracking="btn-log-out"
              >
                Log out
              </button>
            ),
          }
        : {
            key: 'log-in',
            component: (
              <Link href="/login">
                <a>Log in</a>
              </Link>
            ),
          }
    );
  }
  NavItems.push({
    key: 'donate',
    component: (
      <WideHeadline
        as="a"
        size={isTabletOrGreater ? WideHeadlineSizes.SM : WideHeadlineSizes.MD}
        href="https://www.elizabethwarren.com/donate"
        target="_blank"
        rel="noopener noreferrer"
      >
        Donate
      </WideHeadline>
    ),
  });

  return (
    <>
      <nav className={['flex', className].join(' ')}>
        <Link href="/">
          <a className="mr-auto" name="Home" aria-label="Home">
            <Logo width={95} />
          </a>
        </Link>
        {!isTabletOrGreater && (
          <>
            <button
              type="button"
              onClick={() => setIsShowingMobileNav(!isShowingMobileNav)}
            >
              <WideHeadline as="span" size={WideHeadlineSizes.SM}>
                Menu
              </WideHeadline>
            </button>
            {isShowingMobileNav && (
              <OverlayNav
                onClose={() => setIsShowingMobileNav(false)}
                items={NavItems}
              />
            )}
          </>
        )}
        {isTabletOrGreater && (
          <>
            {NavItems.map(({ key, component }) => (
              <div className="ml-6" key={key}>
                {component}
              </div>
            ))}
          </>
        )}
      </nav>
      {isAuthenticated && isShowingLogOutModal && (
        <LogOutModal onClose={() => setIsShowingLogOutModal(false)} />
      )}
    </>
  );
};

Nav.propTypes = {
  className: PropTypes.string,
  simple: PropTypes.bool,
};

Nav.defaultProps = {
  className: '',
  simple: false,
};

export default Nav;
