"use client";
import {
    single
} from "../tools/extended/db";
import {
    tool
} from "../tools/info";
import convertExtendedTools from "./convertExtendedTools";
function getParamTools(mostUsed: string, realTools: tool[], extendedTools: single[]) {
    return (Object.entries(JSON.parse(mostUsed)) as [string, number][]).sort((r, g) => {
        if (r[1] < g[1]) {
            return 1;
        } if (r[1] > g[1]) {
            return -1;
        }
        return 0;
    }).slice(0, 3).map(item => {
        const to = item[0];
        var tool: tool | 0 = 0;
        realTools.forEach(single => {
            if (single.to === to) {
                tool = single;
            }
        });
        if (typeof tool === "number") {
            // 该工具是扩展工具
            convertExtendedTools(extendedTools).forEach(single => {
                if (`/tools/extended?tool=${to}` === single.to) {
                    tool = single;
                }
            });
        }
        return tool as tool | 0;
    }).filter(item => item !== 0) as unknown as tool[];
}
export default getParamTools;