import localforage from 'localforage';
import { useContext, useEffect } from 'react';
import NotificationsContext from '../contexts/NotificationsContext';
import StorageKeys from '../constants/StorageKeys';

const useMobilizePromoToast = () => {
  const { showNotification } = useContext(NotificationsContext);
  useEffect(() => {
    const message = (
      <>
        Join the Switchboard community on <b>All In</b>! If you’re already part
        of <b>All In</b>, you can go directly to our{' '}
        <a
          href="https://community.elizabethwarren.com/main/groups/36927/lounge"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          lounge
        </a>
        . If you haven’t yet joined, please sign up{' '}
        <a
          href="https://ewar.ren/switchboard-community"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          here
        </a>
        .
      </>
    );
    (async () => {
      const seenToast = await localforage.getItem(
        StorageKeys.SEEN_MOBILIZE_TOAST
      );
      if (seenToast) return;
      showNotification({ message });
      localforage.setItem(StorageKeys.SEEN_MOBILIZE_TOAST, true);
    })();
  }, []);
};

export default useMobilizePromoToast;
