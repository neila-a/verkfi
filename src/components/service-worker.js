import pack from "../package.json";
/* const toolsTo = [
    "audiotools",
    "countletter",
    "clock",
    "pi",
    "reversal",
    "shaizi",
    "filter",
    "keycode",
    "readnumber",
]; */
export const
    { version, devVersion, dev } = pack,
    Cache = `NeilaTools-${version}-${dev == true ? `dev${devVersion}` : "prod"}`, // C
    log = text => console.log(`%cServiceWorker`, `background: #52c41a;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`, text),
    installStaticFiles = () => caches.open(Cache).then(cache => cache.addAll(installFilesEssential).catch(console.error)), // install static assets
    clearOldCaches = () => {
        return caches.keys().then(keylist => {
            return Promise.all(keylist.filter(key => {
                return key !== Cache;
            }).map(key => {
                log(`已删除缓存“${key}”`);
                return caches.delete(key);
            }));
        });
    },
    installFilesEssential = [
        '/',
        '/tool',
        '/settings',
        '/index.webmanifest',
        '/image/favicon.png'
    ];
log(`版本为${Cache}`);
self.addEventListener('install', event => {
    event.waitUntil(installStaticFiles().then(() => {
        return self.skipWaiting();
    }));
});
self.addEventListener('activate', event => {
    return event.waitUntil(clearOldCaches().then(() => {
        return self.clients.claim();
    }));
});
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    let { requrl } = event.request;
    let url = String(requrl);
    event.respondWith(
        caches.open(Cache).then(cache => {
            return cache.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(newreq => {
                    log(`抓取: ${url}`);
                    if (newreq.ok) cache.put(event.request, newreq.clone());
                    return newreq;
                }).catch(console.error);
            });
        })
    );
});
export default Cache;