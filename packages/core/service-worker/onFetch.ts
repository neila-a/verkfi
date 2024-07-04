/* eslint-disable no-trailing-spaces */
// jsdoc的md换行需要两个空格
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
 * 判断顺序：handle -> customRoute -> /tools/extension -> _rsc -> fetch -> cache
 * handle：自定义，并且要快  
 * customRoute：自定义  
 * /tools/extension：扩展工具加载器  
 * _rsc：拦截_rsc  
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
    const faller = (options: CacheQueryOptions = {}) => async () => {
        const cache = await caches.open(Cache),
            cacheMateched = await cache.match(realReq, options);
        if (!cacheMateched) {
            const newreq = await fetch(realReq);
            cache.put(realReq, newreq.clone());
            return newreq;
        }
        return cacheMateched;
    }
    return testPaths(url, faller(), ["handle", () => {
        const toPath = `/tools/${urlObject.searchParams.get("handle")!.replace(/web\+verkfi:\/\//g, "")}`;
        log(`检测到URL：${url}中含有"handle"，重定向至${toPath}`);
        const headers = new Headers();
        headers.append("Location", toPath);
        return new Response("", {
            status: 301,
            statusText: "Redirected by ServiceWorker because this is a handler page",
            headers: headers
        });
    }], ["extensionfiles", async tested => {
        const filePath = tested.pathname.groups.path!.split("/"),
            allHandle = await navigator.storage.getDirectory();
        let handle = await allHandle.getDirectoryHandle(tested.pathname.groups.name as string);
        await Promise.all(filePath.map(async (dir, index) => {
            if (index !== filePath.length - 1) {
                handle = await handle.getDirectoryHandle(dir);
            }
        }));
        const fileHandle = await handle.getFileHandle(filePath[filePath.length - 1]),
            file = await fileHandle.getFile();
        log("检测到扩展路径为", filePath);
        return new Response(new Blob([file]));
    }], ["extensionLoader", faller({
        ignoreSearch: true
    })], ["rsc", faller({
        ignoreSearch: true
    })]);
}
