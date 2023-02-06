var window = self;
import pack from "../package.json";
import lpLogger from "https://cdn.skypack.dev/lp-logger";
var logger = new lpLogger({
    name: "ServiceWorker",
    level: "log", // 空字符串时，不显示任何信息
});
window.toolsTo = [
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
        ...toolsTo.map(to => `/tools/${tool.to}`),
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
                    logger.log(`Network fetch: ${url}`);
                    if (newreq.ok) cache.put(event.request, newreq.clone());
                    return newreq;
                }).catch(logger.error);
            });
        })
    );
});