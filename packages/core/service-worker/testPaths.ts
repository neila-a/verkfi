/**
 * 为了和命名空间重合而必须使用命名函数
 */
async function testPaths(
    url: string,
    fall: () => Response | Promise<Response>,
    ...path: [keyof typeof testPaths, (tested: URLPatternResult) => Response | Promise<Response>][]
) {
    for (let aPath of path) {
        if (testPaths[aPath[0]].test(url)) {
            return await aPath[1](testPaths[aPath[0]].exec(url));
        }
    }
    return await fall();
}
namespace testPaths {
    export const
        handle = new URLPattern({
            pathname: "/handle",
            search: "?handle=:handle"
        }), extensionfiles = new URLPattern({
            pathname: "/extensionfiles/:name/:path+"
        }), extensionLoader = new URLPattern({
            pathname: "/tools/extension"
        }), rsc = new URLPattern({
            search: "?_rsc=:rsc"
        });
}
export default testPaths;
