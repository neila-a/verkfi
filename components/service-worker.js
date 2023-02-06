import pack from "../package.json";
const toolsTo = [
    "audiotools",
    "countletter",
    "clock",
    "pi",
    "reversal",
    "shaizi",
    "filter",
    "keycode",
    "readnumber",
];
const
    { version, devVersion } = pack,
    Cache = `NeilaTools-${version}-${devVersion != 0 ? `dev${devVersion}` : "prod"}`, // C
    installFilesEssential = [
        '/',
        ...toolsTo.map(addr => `/pages/${addr}`),
        '/index.webmanifest',
        '/favicon.png'
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
                    console.log(`%cServiceWorker`, `background: #52c41a;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`,`Network fetch: ${url}`);
                    if (newreq.ok) cache.put(event.request, newreq.clone());
                    return newreq;
                }).catch(console.error);
            });
        })
    );
});