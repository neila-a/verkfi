type Res = Response | Promise<Response>;
/**
 * 为了和命名空间重合而必须使用命名函数
 */
async function testPaths(
    url: string,
    fall: () => Res,
    ...path: [testPath | Array<testPath>, (tested: URLPatternResult) => Res][]
) {
    for (const aPath of path) {
        let pathas = Array.isArray(aPath[0]) ? aPath[0] : [aPath[0]];
        for (const patha of pathas) {
            if (testPaths[patha].test(url)) {
                const result = await aPath[1](testPaths[patha].exec(url) as URLPatternResult);
                return result || await fall();
            }
        }
    }
    return await fall();
}
type testPath = keyof typeof testPaths;
namespace testPaths {
    export const
        handle = new URLPattern({
            pathname: "/handle",
            search: "?handle=:handle"
        }),
        extensionfiles = new URLPattern({
            protocol: "https",
            hostname: ":name.verkfi",
            pathname: "/:path+"
        }),
        extensionLoader = new URLPattern({
            pathname: "/tools/extension"
        }),
        rsc = new URLPattern({
            search: "?_rsc=:rsc"
        }),
        manifest = new URLPattern({
            pathname: "/manifest.webmanifest"
        }),
        installExtension = new URLPattern({
            pathname: "/installExtension"
        });
}
export default testPaths;
