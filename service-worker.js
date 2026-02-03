const CACHE_NAME = "affirmations-cache-v1";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./bg-desktop.webp",
  "./bg-mobile.webp",
  "./icon_48.png",
  "./icon_72.png",
  "./icon_96.png",
  "./icon_144.png",
  "./icon_192.png",
  "./icon_256.png",
  "./icon_512.png",
  "./shortcut_add_96.png",
  "./shortcut_add_144.png",
  "./shortcut_add_192.png",
  "./shortcut_add_512.png",
  "./shortcut_fav_96.png",
  "./shortcut_fav_144.png",
  "./shortcut_fav_192.png",
  "./shortcut_fav_512.png",
  "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Her dosyayı tek tek ekleyerek hataları yakala
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`Failed to cache ${url}:`, err);
            // Hata olsa bile devam et
            return null;
          })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
