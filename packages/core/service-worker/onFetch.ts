/* eslint-disable no-trailing-spaces */
// jsdoc的md换行需要两个空格
import manifest from "manifest";
import {
    Cache,
    log
} from ".";
import testPaths from "./testPaths";
/**
 * 用于规避ts
 */
const fakeResonse = undefined as unknown as Response;
/**
 * 判断顺序：handle -> customRoute -> fetch -> cache
 * handle：自定义，并且要快  
 * customRoute：自定义  
 * cache：缓存模式  
 * fetch：网络模式  
 */
export default function onFetch(event: FetchEvent) {
    if (event.request.method !== "GET") return fakeResonse;
    const url = String(event.request.url),
        urlObject = new URL(url),
        realReq = event.request.clone(),
        path = urlObject.pathname.split("/");
    path.shift();
    if (urlObject.protocol === "chrome-extension:") return fakeResonse;
    log(`抓取: ${url}`);
    const faller = (options: CacheQueryOptions = {
    }) => async () => {
        const cache = await caches.open(Cache),
            cacheMateched = await cache.match(realReq, {
                ...options,
                ignoreSearch: true
            });
        if (!cacheMateched) {
            const newreq = await fetch(realReq);
            cache.put(realReq, newreq.clone());
            return newreq;
        }
        return cacheMateched;
    };
    return testPaths(url, faller(), ["handle", () => {
        const toPath = `/tools/${urlObject.searchParams.get("handle")!.replace(/web\+verkfi:\/\//g, "")}`;
        log(`检测到URL：${url}中含有"handle"，重定向至${toPath}`);
        const headers = new Headers();
        headers.append("Location", toPath);
        return new Response("", {
            status: 301,
            statusText: "Redirected by ServiceWorker because this is a handler page",
            headers
        });
    }], ["extensionfiles", async tested => {
        const filePath = tested.pathname.groups.path!.split("/"),
            allHandle = await navigator.storage.getDirectory();
        let handle = await allHandle.getDirectoryHandle(tested.hostname.groups.name!);
        await Promise.all(filePath.map(async (dir, index) => {
            if (index !== filePath.length - 1) {
                handle = await handle.getDirectoryHandle(dir);
            }
        }));
        const fileHandle = await handle.getFileHandle(filePath[filePath.length - 1]),
            file = await fileHandle.getFile();
        log("检测到扩展路径为", filePath);
        const headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Cross-Origin-Resource-Policy", "cross-origin");
        return new Response(file, {
            status: 200,
            statusText: "Context provided by ServiceWorker",
            headers
        });
    }], ["manifest", () => {
        const string = JSON.stringify(manifest());
        return new Response(string, {
            status: 200,
            statusText: "Manifest provided by ServiceWorker"
        });
    }]);
}
