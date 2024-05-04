"use client";
import {
    useAtom
} from "jotai";
import extensionsAtom from "atoms/extensions";
import {
    mostUsed as mostUsedAtom
} from "atoms";
import toolsInfoAtom, {
    tool
} from "tools/info";
import convertExtensionTools from "./convertExtensionTools";
function useMostUsedTools() {
    const [mostUsed] = useAtom(mostUsedAtom),
        [extensionTools] = useAtom(extensionsAtom),
        [realTools] = useAtom(toolsInfoAtom);
    return (Object.entries(mostUsed) satisfies [string, number][]).sort((r, g) => {
        if (r[1] < g[1]) {
            return 1;
        } if (r[1] > g[1]) {
            return -1;
        }
        return 0;
    }).slice(0, 3).map(item => {
        const to = item[0];
        return 0
            || realTools.find(single => single.to === to)
            || convertExtensionTools(extensionTools).find(single => `/tools/extension?tool=${to}` === single.to) as tool | 0;
    }).filter(item => item !== 0 && item !== undefined) as unknown as tool[];
}
export default useMostUsedTools;
