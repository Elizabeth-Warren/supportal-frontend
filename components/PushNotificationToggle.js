import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import askPushPermission from '../util/askPushPermission';
import urlBase64ToUint8Array from '../util/urlB64TUint8Array';

const PushNotificationToggle = ({ children, className }) => {
  const isPushSupported =
    'serviceWorker' in navigator && 'PushManager' in window;
  const [isBusy, setIsBusy] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [swr, setSWR] = useState(null);

  const handlePushChange = async e => {
    setIsBusy(true);
    if (e.target.checked && !isSubscribed) {
      if (!swr) {
        return;
      }
      try {
        await askPushPermission();
        const newSub = await swr.pushManager.subscribe({
          applicationServerKey: urlBase64ToUint8Array(
            process.env.APP_SERVER_KEY
          ),
          userVisibleOnly: true,
        });
        console.log(newSub);
        console.log(JSON.stringify(newSub));
        // Send an api post here to notify the server
        // await api.post('/save-subscription', subscription)
        setSubscription(newSub);
        setIsSubscribed(true);
      } catch (err) {
        console.error(err);
        setIsSubscribed(false);
      }
    } else if (!e.target.checked && isSubscribed) {
      if (!subscription) return;
      try {
        await subscription.unsubscribe();
        // Send an api post here to notify the server
        // await api.post('/delete-subscription', subscription)
        setSubscription(null);
        setIsSubscribed(false);
      } catch (err) {
        console.error(err);
      }
    }
    setIsBusy(false);
  };

  useEffect(() => {
    if (!isPushSupported) return;
    (async () => {
      const registration = await navigator.serviceWorker.getRegistration(
        '/service-worker.js'
      );
      if (!registration) return;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        setSubscription(sub);
        setIsSubscribed(true);
      }
      setSWR(registration);
      setIsVisible(true);
    })();
  }, [isPushSupported]);

  return isVisible ? (
    <label
      htmlFor="push-notification-toggle"
      className={[className, 'flex', 'items-baseline'].join(' ')}
    >
      <input
        id="push-notification-toggle"
        type="checkbox"
        name="push-subscribed"
        checked={isSubscribed}
        onChange={handlePushChange}
        disabled={isBusy}
      />
      <b className="flex-grow ml-2">{children}</b>
    </label>
  ) : null;
};

PushNotificationToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

PushNotificationToggle.defaultProps = {
  children: 'I want to receive push notifications from the Switchboard app.',
  className: '',
};

export default PushNotificationToggle;
