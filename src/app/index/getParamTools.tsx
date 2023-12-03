"use client";
import {
    tool
} from "../tools/info";
const getParamTools = (mostUsed: string, realTools: tool[]) => (Object.entries(JSON.parse(mostUsed)) as [string, number][]).sort((r, g) => {
    if (r[1] < g[1]) {
        return 1;
    } if (r[1] > g[1]) {
        return -1;
    }
    return 0;
}).slice(0, 3).map(item => {
    const to = item[0];
    var tool: tool;
    realTools.forEach(single => {
        if (single.to === to) {
            tool = single;
        }
    });
    return tool;
});
export default getParamTools;