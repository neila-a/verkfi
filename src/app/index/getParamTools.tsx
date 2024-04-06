"use client";
import {
    single
} from "components/db";
import {
    mostUsedMarks
} from "layout/layoutClient";
import {
    tool
} from "tools/info";
import convertExtensionTools from "./convertExtensionTools";
function getParamTools(mostUsed: mostUsedMarks, realTools: tool[], extensionTools: single[]) {
    return (Object.entries(mostUsed) as [string, number][]).sort((r, g) => {
        if (r[1] < g[1]) {
            return 1;
        } if (r[1] > g[1]) {
            return -1;
        }
        return 0;
    }).slice(0, 3).map(item => {
        const to = item[0],
            // 不直接返回tool因为怕自动分毫影响return
            tool: tool | 0 = 0
                || realTools.find(single => single.to === to)
                || convertExtensionTools(extensionTools).find(single => `/tools/extension?tool=${to}` === single.to);
        return tool as tool | 0;
    }).filter(item => item !== 0 && item !== undefined) as unknown as tool[];
}
export default getParamTools;