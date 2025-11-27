/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

// Use the injected manifest from VitePWA
precacheAndRoute(self.__WB_MANIFEST);

// Cleanup outdated caches
cleanupOutdatedCaches();

// Claim clients immediately
self.skipWaiting();
clientsClaim();

// Cache images with CacheFirst strategy
registerRoute(
  /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

// Push notification event listener
self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) {
    console.log('Push event received but no data');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push notification received:', data);

    const title = data.title || 'Nexa Esports';
    const options: NotificationOptions = {
      body: data.body,
      icon: data.icon || '/nexa-logo.jpg',
      badge: data.badge || '/nexa-logo.jpg',
      tag: data.tag || 'nexa-notification',
      data: data.data,
      actions: data.actions,
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
    };

    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);
  } catch (error) {
    console.error('Error processing push notification:', error);
  }
});

// Notification click event listener
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  console.log('Notification clicked:', event.notification);
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/dashboard';

  const promiseChain = self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    // Check if there's already an open window with the app
    for (const windowClient of windowClients) {
      if (windowClient.url.startsWith(self.location.origin)) {
        // Focus the existing window and navigate to the URL
        return windowClient.focus().then((client) => {
          if (client && 'navigate' in client) {
            return client.navigate(targetUrl);
          }
          return client;
        });
      }
    }
    // If no window is open, open a new one
    return self.clients.openWindow(targetUrl);
  });

  event.waitUntil(promiseChain);
});

// Notification close event listener
self.addEventListener('notificationclose', (event: NotificationEvent) => {
  console.log('Notification closed:', event.notification);
});
