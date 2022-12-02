const
    version = '0.1.1',
    CACHE = version + '::NeilaTools',
    installFilesEssential = [
        '/',
        '/audiotools',
        '/bigtime',
        '/pi',
        '/reversal',
        '/shaizi',
        '/manifest.json',
        '/favicon.svg',
    ];
// install static assets
function installStaticFiles() {
    return caches.open(CACHE)
        .then(cache => {
            return cache.addAll(installFilesEssential);
        });
}
function clearOldCaches() {
    return caches.keys().then(keylist => {
        return Promise.all(
            keylist
                .filter(key => key !== CACHE)
                .map(key => caches.delete(key))
        );
    });
}
self.addEventListener('install', event => {
    event.waitUntil(
        installStaticFiles()
            .then(() => self.skipWaiting())
    );
});
self.addEventListener('activate', event => {
    event.waitUntil(
        clearOldCaches()
            .then(() => self.clients.claim())
    );
});
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    let url = event.request.url;
    event.respondWith(
        caches.open(CACHE).then(cache => {
            return cache.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(newreq => {
                        console.log('network fetch: ' + url);
                        if (newreq.ok) cache.put(event.request, newreq.clone());
                        return newreq;

                    })
                    .catch(() => null);
            });
        })
    );
});