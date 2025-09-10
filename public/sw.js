const CACHE_NAME = 'nexa-esports-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/announcements',
  '/nexa-logo.jpg'
];

// Service Worker lifecycle - install
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Nexa Esports service worker');
  self.skipWaiting();
});

// Service Worker lifecycle - activate
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Nexa Esports service worker');
  event.waitUntil(self.clients.claim());
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'Nexa Esports',
    body: 'New notification',
    icon: '/nexa-logo.jpg',
    badge: '/nexa-logo.jpg',
    tag: 'nexa-notification',
    data: { url: '/dashboard', appName: 'Nexa Esports' }
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || 'Nexa Esports',
        body: data.body || data.message || 'New notification',
        icon: data.icon || '/nexa-logo.jpg',
        badge: data.badge || '/nexa-logo.jpg',
        tag: data.tag || 'nexa-notification',
        data: {
          url: data.data?.url || '/dashboard',
          appName: 'Nexa Esports',
          timestamp: data.data?.timestamp || Date.now(),
          ...data.data
        },
        actions: [
          {
            action: 'open',
            title: 'Open App',
            icon: '/nexa-logo.jpg'
          },
          {
            action: 'close',
            title: 'Dismiss'
          }
        ]
      };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions || [],
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200],
      timestamp: notificationData.data.timestamp || Date.now()
    }
  );

  event.waitUntil(promiseChain);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked, action:', event.action);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Determine URL based on notification type and data
  let urlToOpen = '/dashboard';
  
  if (event.notification.data) {
    const { type, url, event_id, announcement_id } = event.notification.data;
    
    // Route based on notification type
    switch (type) {
      case 'event_created':
      case 'event_assignment':
        urlToOpen = '/scrims';
        break;
      case 'announcement':
        urlToOpen = '/announcements';
        break;
      case 'access_code_request':
      case 'new_player_joined':
        urlToOpen = '/admin/notifications';
        break;
      default:
        urlToOpen = event.notification.data.url || '/dashboard';
    }
  }
  
  const promiseChain = self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    // Try to find an existing window with our app
    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url.includes(self.location.origin)) {
        matchingClient = windowClient;
        break;
      }
    }

    if (matchingClient) {
      // Focus existing window and navigate to the URL
      return matchingClient.focus().then(() => {
        if (urlToOpen !== '/dashboard') {
          return matchingClient.navigate(urlToOpen);
        }
        return matchingClient;
      });
    } else {
      // Open new window
      return self.clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    // Handle any background synchronization here
    event.waitUntil(
      // Perform background sync operations
      Promise.resolve()
    );
  }
});