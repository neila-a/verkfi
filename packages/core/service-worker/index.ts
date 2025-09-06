import {
    dev,
    version
} from "../../../package.json";
declare module "virtual:verkfi-env" {
    export const devVersion: string;
}
import {
    devVersion
} from "virtual:verkfi-env";
import onFetch from "./onFetch";
import onMessage from "./onMessage";
declare const self: ServiceWorkerGlobalScope;
export const Cache = `Verkfi-${version}-${dev ? `dev${devVersion}` : "prod"}`,
    log = (...texts: any[]) => console.log(
        `%cServiceWorker`, `background: #52c41a;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`,
        ...texts
    );
log(`版本为${Cache}`);
self.addEventListener("install", async event => event.waitUntil(self.skipWaiting()));
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
self.addEventListener("message", event => event.waitUntil(onMessage(event)));
export default Cache;
