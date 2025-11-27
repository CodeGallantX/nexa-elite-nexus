/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute, NavigationRoute, Route } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

// Use the injected manifest from VitePWA
precacheAndRoute(self.__WB_MANIFEST);

// Cleanup outdated caches
cleanupOutdatedCaches();

// Claim clients immediately
self.skipWaiting();
clientsClaim();

// ============================================
// OFFLINE EXPERIENCE & NETWORK INTERCEPTION
// ============================================

// Cache API responses with NetworkFirst strategy (try network, fallback to cache)
// This ensures fresh data when online, but still works offline
// Only cache Supabase API requests from our configured project
registerRoute(
  ({ url }) => {
    // Check if this is a Supabase API request
    const isSupabaseRequest = url.hostname.endsWith('.supabase.co') || 
                              url.hostname.endsWith('.supabase.in');
    const isApiPath = url.pathname.includes('/rest/v1/') || 
                      url.pathname.includes('/functions/v1/');
    return isSupabaseRequest && isApiPath;
  },
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hour
      }),
    ],
    networkTimeoutSeconds: 10, // Fall back to cache if network takes > 10s
  })
);

// Cache images with CacheFirst strategy (check cache first, then network)
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

// Cache fonts with CacheFirst strategy
registerRoute(
  /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  })
);

// Cache static assets (JS, CSS) with StaleWhileRevalidate
// Serve from cache immediately while updating in the background
registerRoute(
  /\.(?:js|css)$/,
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
      }),
    ],
  })
);

// ============================================
// PUSH NOTIFICATIONS
// ============================================

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

// ============================================
// BACKGROUND SYNC
// ============================================

// Handle background sync for offline actions
self.addEventListener('sync', (event: SyncEvent) => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'sync-wallet-transactions') {
    event.waitUntil(syncWalletTransactions());
  } else if (event.tag === 'sync-attendance') {
    event.waitUntil(syncAttendanceData());
  }
});

// Sync wallet transactions when back online
async function syncWalletTransactions() {
  try {
    // Get pending transactions from IndexedDB or cache
    const cache = await caches.open('pending-transactions');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request.clone());
        if (response.ok) {
          await cache.delete(request);
          console.log('Successfully synced transaction:', request.url);
        }
      } catch (error) {
        console.error('Failed to sync transaction:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncWalletTransactions:', error);
  }
}

// Sync attendance data when back online
async function syncAttendanceData() {
  try {
    const cache = await caches.open('pending-attendance');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request.clone());
        if (response.ok) {
          await cache.delete(request);
          console.log('Successfully synced attendance:', request.url);
        }
      } catch (error) {
        console.error('Failed to sync attendance:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncAttendanceData:', error);
  }
}

// ============================================
// OFFLINE STATUS & MESSAGE HANDLING
// ============================================

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle cache clearing request
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }
  
  // Handle checking if app data is cached
  if (event.data && event.data.type === 'CHECK_CACHE_STATUS') {
    event.waitUntil(
      caches.has('api-cache').then((hasCache) => {
        event.ports[0]?.postMessage({ cached: hasCache });
      })
    );
  }
});

// Broadcast online/offline status to all clients
self.addEventListener('online', () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'ONLINE' });
    });
  });
});

self.addEventListener('offline', () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'OFFLINE' });
    });
  });
});

// Handle fetch errors and provide offline fallback
self.addEventListener('fetch', (event: FetchEvent) => {
  // Only handle navigation requests for offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return cached app shell for offline navigation
        return caches.match('/index.html') || caches.match('/');
      })
    );
  }
});
