/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from "workbox-core";
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// Cache strategy for images
registerRoute(
  // Match image requests
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // Max number of images to cache
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 Days
      }),
    ],
  })
);

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
if (process.env.MODE !== "ssr" || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
    )
  );
}
