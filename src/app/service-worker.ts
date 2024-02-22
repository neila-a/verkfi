import {
    version,
    devVersion,
    dev
} from "../../package.json";
import db from "./extendedTools/db";
import pages from "./pages.json";
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
export const Cache = `Verkfi-${version}-${dev == true ? `dev${devVersion}` : "prod"}`, // C
    log = (text: string) => console.log(`%cServiceWorker`, `background: #52c41a;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`, text),
    clearOldCaches = async () => {
        const keylist = await caches.keys();
        keylist.filter(key => {
            return key !== Cache;
        }).map(async key_1 => {
            log(`已删除缓存“${key_1}”`);
            return await caches.delete(key_1);
        });
    },
    installFilesEssential: string[] = [
        '/index.webmanifest',
        '/image/favicon.png'
    ].concat(pages);
log(`版本为${Cache}`);
self.addEventListener('install', async event => {
    const installStaticFiles = async () => {
        const cachea = await caches.open(Cache);
        try {
            await cachea.addAll(installFilesEssential)
        } catch (error) {
            console.error(error);
        }
    };
    return event.waitUntil((async () => {
        await installStaticFiles();
        self.skipWaiting();
    })());
});
self.addEventListener('activate', event => event.waitUntil((async () => {
    await clearOldCaches();
    return self.clients.claim();
})()));
/**
 * 判断顺序：handle -> customRoute -> _rsc  -> fetch -> cache
 * handle：自定义，并且要快
 * customRoute：自定义
 * _rsc：拦截_rsc
 * fetch：正常模式
 * cache：缓存回退模式
 */
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    let requrl = event.request.url;
    let url = String(requrl);
    let urled = new URL(url);
    let path = urled.pathname.split("/");
    path.shift();
    event.respondWith((async () => {
        const cache = await caches.open(Cache);
        var realReq = event.request.clone();
        var response: Response;
        const newreq = await fetch(realReq);
        log(`抓取: ${url}`);
        if (path[0] === "handle") {
            const toPath = `/tools/${urled.searchParams.get("handle").replace(/web\+verkfi:\/\//g, "")}`;
            log(`检测到URL：${url}中含有"handle"，重定向至${toPath}`);
            const headers = new Headers();
            headers.append("Location", toPath);
            response = new Response("", {
                status: 301,
                statusText: "Redirected by ServiceWorker because this is a handler page",
                headers: headers
            });
        } else if (path[0] === "extendedfiles") {
            response = new Response(new Blob([(await db.extendedTools.toArray()).filter(item => item.to === path[1])[0].files.filter(item => item[0] === path[2])[0][1]]));
        } else if (url.includes("_rsc=")) {
            log(`检测到URL：${url} 中含有searchParam“rsc”，已返回无rsc版本`);
            response = await cache.match(realReq, {
                ignoreSearch: true
            });
        } else if (newreq.ok && newreq.status === 200) {
            cache.put(realReq, newreq.clone());
            response = newreq;
        } else {
            response = await cache.match(realReq);
        }
        if (response) {
            return response;
        }
    })());
});
export default Cache;
