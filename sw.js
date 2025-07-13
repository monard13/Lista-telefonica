
const CACHE_NAME = 'llamadas-checklist-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap',
  '/icon-192.png',
  '/icon-512.png'
];

// Evento de instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento de activación
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de fetch (interceptar peticiones)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clonar la petición porque es un stream y solo se puede consumir una vez
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Comprobar si recibimos una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              if (event.request.url.startsWith('https://esm.sh/')) {
                  // No cachear los módulos de esm.sh
                  return response;
              }
            }

            // Clonar la respuesta porque también es un stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // No cachear las peticiones a esm.sh para evitar problemas de CORS y opacidad
                if(!event.request.url.startsWith('https://esm.sh/')) {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
    );
});
