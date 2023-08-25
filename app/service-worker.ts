import {
    version,
    devVersion,
    dev
} from "../package.json";
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
declare let self: ServiceWorkerGlobalScope;
export const Cache = `NeilaTools-${version}-${dev == true ? `dev${devVersion}` : "prod"}`, // C
    log = text => console.log(`%cServiceWorker`, `background: #52c41a;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`, text),
    installStaticFiles = () => caches.open(Cache).then(cache => cache.addAll(installFilesEssential).catch(console.error)), // install static assets
    clearOldCaches = async () => {
        const keylist = await caches.keys();
        return await Promise.all(keylist.filter(key => {
            return key !== Cache;
        }).map(key_1 => {
            log(`已删除缓存“${key_1}”`);
            return caches.delete(key_1);
        }));
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
    let requrl = event.request.url;
    let url = String(requrl);
    event.respondWith(caches.open(Cache).then(async cache => {
        const response = await cache.match(event.request);
        if (response) {
            return response;
        }
        if (url.includes("handle")) {
            log(`检测到URL：${url}中含有"handle"，不存入缓存`);
            const newreq = await fetch(event.request);
            return newreq;
        }
        try {
            const newreq = await fetch(event.request);
            log(`抓取: ${url}`);
            if (newreq.ok) cache.put(event.request, newreq.clone());
            return newreq;
        } catch (message) {
            console.error(message);
            return message;
        }
    }));
});
export default Cache;
