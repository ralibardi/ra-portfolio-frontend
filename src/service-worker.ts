/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

declare type JsonNotificationResult = {
  title?: string;
  body?: string;
  url?: string;
};

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

// App Shell-style routing
registerRoute(
  ({ request, url }) =>
    request.mode === 'navigate' &&
    !url.pathname.startsWith('/_') &&
    url.origin === self.location.origin,
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'),
);

// Cache images
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    /\.(png|jpg|jpeg|svg|gif)$/i.test(url.pathname),
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  }),
);

// Cache CSS and JavaScript files
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin && /\.(css|js)$/i.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  }),
);

// Add push notification event listener
self.addEventListener('push', (event: PushEvent) => {
  const data: JsonNotificationResult =
    (event.data?.json() as JsonNotificationResult) ?? {};

  const title: string = data.title || 'New Notification';
  const options: NotificationOptions = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Add notification click event listener
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data as string));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting().catch(console.error);
  }
});

// Offline fallback
const offlineFallbackPage = '/offline.html';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('offline-cache')
      .then((cache) => cache.add(offlineFallbackPage)),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches
          .match(offlineFallbackPage)
          .then(
            (response) =>
              response ||
              new Response('Offline content not available', { status: 404 }),
          ),
      ),
    );
  }
});
