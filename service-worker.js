const CACHE_NAME = 'bk-cnc-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './kalkulator.html',
    './projekt-strona-firmowa.html',
    './projekt-wizytowka.html',
    './wizualizercnc.html',
    './css/style.css',
    './css/calculator.css',
    './js/theme.js',
    './js/calculator.js',
    './assets/favicon.png',
    './assets/thumbnail.jpg',
    './css/tailwind.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching files');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing old cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Strategy: Cache First, then Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
