import db from "@verkfi/shared/reader/db";
import {
    Cache,
    log
} from ".";
function testPaths(url: string, ...path: [keyof typeof testPaths, (tested: URLPatternResult) => any][]) {
    return Promise.all(path.map(async aPath => {
        if (testPaths[aPath[0]].test(url)) {
            await aPath[1](testPaths[aPath[0]].exec(url));
        }
    }));
}
namespace testPaths {
    export const
        handle = new URLPattern({
            pathname: "/handle",
            search: "?handle=:handle"
        }),
        extensionfiles = new URLPattern({
            pathname: "/extensionfiles/:name/:path+"
        }),
        extensionLoader = new URLPattern({
            pathname: "/tools/extension"
        }),
        rsc = new URLPattern({
            search: "?_rsc=:rsc"
        });
}
/**
 * 判断顺序：handle -> customRoute -> /tools/extension -> _rsc -> fetch -> cache
 * handle：自定义，并且要快
 * customRoute：自定义
 * /tools/extension：扩展工具加载器
 * _rsc：拦截_rsc
 * cache：缓存模式
 * fetch：网络模式
 */
export default async function onFetch(event: FetchEvent) {
    let response: Response; // 可能为空的响应
    if (event.request.method !== "GET") return;
    const url = String(event.request.url),
        urlObject = new URL(url),
        cache = await caches.open(Cache),
        realReq = event.request.clone(),
        path = urlObject.pathname.split("/");
    path.shift();
    if (urlObject.protocol === "chrome-extension:") return;
    log(`抓取: ${url}`);
    await testPaths(url, ["handle", () => {
        const toPath = `/tools/${urlObject.searchParams.get("handle").replace(/web\+verkfi:\/\//g, "")}`;
        log(`检测到URL：${url}中含有"handle"，重定向至${toPath}`);
        const headers = new Headers();
        headers.append("Location", toPath);
        response = new Response("", {
            status: 301,
            statusText: "Redirected by ServiceWorker because this is a handler page",
            headers: headers
        });
    }], ["extensionfiles", async tested => {
        const filePath = tested.pathname.groups.path,
            tool = await db.extensionTools.get({
                to: tested.pathname.groups.name
            }),
            file = tool.files.find(file => file.path === filePath).file;
        log(`检测到扩展路径为${filePath}`);
        response = new Response(new Blob([file]));
    }], ["extensionLoader", async () => {
        response = await cache.match(realReq, {
            ignoreSearch: true
        });
    }], ["rsc", async () => {
        log(`检测到URL：${url} 中含有searchParam“rsc”，已返回无rsc版本`);
        response = await cache.match(realReq, {
            ignoreSearch: true
        });
    }]);
    if (!response) {
        response = await cache.match(realReq);
        if (!response) {
            const newreq = await fetch(realReq);
            cache.put(realReq, newreq.clone());
            response = newreq;
        }
    }
    return response;
}
