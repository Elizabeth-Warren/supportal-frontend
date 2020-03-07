/* global workbox */
/* eslint-env serviceworker */
/* eslint-disable
   no-restricted-globals,
   no-underscore-dangle,
   prefer-object-spread
*/

self.addEventListener('push', event => {
  if (!event.data) return;
  let eventOptions;
  try {
    eventOptions = event.data.json();
  } catch (err) {
    eventOptions = {};
  }
  const title = 'Switchboard';
  const options = Object.assign(
    {
      body: event.data.text(),
      icon: '/img/icons/android-chrome-512x512.png',
    },
    eventOptions
  );
  const promiseChain = self.registration.showNotification(title, options);
  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', event => {
  const defaultAction = () => {
    const url = 'https://switchboard.elizabethwarren.com';
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (let i = 0; i < windowClients.length; i += 1) {
          const client = windowClients[i];
          // If so, just focus it.
          if (client.url.indexOf(url) === 0 && 'focus' in client) {
            client.focus();
            return;
          }
        }
        // If not, then open the target URL in a new window/tab.
        if (clients.openWindow) {
          clients.openWindow(url);
        }
      })
    );
  };

  if (!event.action) {
    defaultAction();
    return;
  }

  switch (event.action) {
    default:
      defaultAction();
      break;
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(
  /^https?.*/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'offlineCache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 200,
        purgeOnQuotaError: false,
      }),
    ],
  }),
  'GET'
);
