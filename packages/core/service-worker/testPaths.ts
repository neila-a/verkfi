type Res = Response | Promise<Response>;
/**
 * 为了和命名空间重合而必须使用命名函数
 */
async function testPaths(
    url: string,
    fall: () => Res,
    ...path: [keyof typeof testPaths, (tested: URLPatternResult) => Res][]
) {
    for (let aPath of path) {
        if (testPaths[aPath[0]].test(url)) {
            const result = await aPath[1](testPaths[aPath[0]].exec(url) as URLPatternResult);
            if (result) {
                return result;
            }
            return await fall();
        }
    }
    return await fall();
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
export default testPaths;
