import {
    dev,
    devVersion,
    version
} from "../../package.json";
import pages from "../pages.json";
import onFetch from "./onFetch";
declare const self: ServiceWorkerGlobalScope;
export const Cache = `Verkfi-${version}-${dev === true ? `dev${devVersion}` : "prod"}`,
    log = (text: string) => console.log(`%cServiceWorker`, `background: #52c41a;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`, text);
log(`版本为${Cache}`);
self.addEventListener("install", async event => event.waitUntil((async () => {
    const openedCache = await caches.open(Cache);
    try {
        await openedCache.addAll([
            "/index.webmanifest"
        ].concat(pages));
    } catch (error) {
        console.error(error);
    }
    self.skipWaiting();
})()));
self.addEventListener("activate", event => event.waitUntil((async () => {
    const keylist = await caches.keys();
    keylist.filter(key => {
        return key !== Cache;
    }).map(async key_1 => {
        log(`已删除缓存“${key_1}”`);
        return await caches.delete(key_1);
    });
    return self.clients.claim();
})()));
self.addEventListener("fetch", event => event.respondWith(onFetch(event)));
export interface message {
    action: "getClients" | "navigate";
    /**
     * navigate action 中要聚焦的 ID
     */
    id: string;
    /**
     * navigate action 中要聚焦的 URL
     */
    url: string;
}
self.addEventListener("message", event => event.waitUntil((async () => {
    const data = event.data as message,
        port = event.ports[0];
    switch (data.action) {
        case "getClients":
            port.postMessage((await self.clients.matchAll({
                type: "window"
            })).map(client => ({
                id: client.id,
                url: client.url
            })));
            break;
        case "navigate":
            const client = await self.clients.get(data.id) as WindowClient;
            await client.navigate(data.url);
            port.postMessage((await self.clients.matchAll({
                type: "window"
            })).map(client => ({
                id: client.id,
                url: client.url
            })));
            break;
    }
})()));
export default Cache;
