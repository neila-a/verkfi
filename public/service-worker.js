const
    version = "1.1.1",
    dev = true,
    devVersion = 1,
    Cache = `NeilaTools-${version}-${dev ? `dev-${devVersion}` : "prod"}`, // C
    installFilesEssential = [
        '/',
        '/audiotools',
        '/bigtime',
        '/pi',
        "/filter",
        '/reversal',
        '/shaizi',
        '/manifest.json',
        '/favicon.png',
    ];
const installStaticFiles = () => caches.open(Cache).then(cache => cache.addAll(installFilesEssential)); // install static assets
const clearOldCaches = () => caches.keys().then(keylist => Promise.all(keylist.filter(key => key !== Cache).map(key => caches.delete(key))));
self.addEventListener('install', event => event.waitUntil(installStaticFiles().then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(clearOldCaches().then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    let { url } = event.request;
    event.respondWith(
        caches.open(Cache).then(cache => {
            return cache.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(newreq => {
                    console.log(`[ServiceWorker] Network fetch: ${url}`);
                    if (newreq.ok) cache.put(event.request, newreq.clone());
                    return newreq;
                }).catch(error => console.error(`[ServiceWorker] Error: ${error}`));
            });
        })
    );
});
