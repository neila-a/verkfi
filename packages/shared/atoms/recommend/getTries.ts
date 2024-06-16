"use client";
import {
    not
} from "../../TransferList";
import {
    mostUsedAtom as mostUsedAtom
} from "..";
import toolsInfoAtom from "tools/info";
import {
    Getter
} from "jotai";
export default async function getTries(get: Getter) {
    const mostUsed = await get(mostUsedAtom),
        realTools = await get(toolsInfoAtom),
        unUsed = not(realTools.map(single => single.to), Object.keys(mostUsed)).sort(() => {
            return Math.random() - 0.5;
        }).slice(0, 3),
        isUnFull = unUsed.length < 3, // 判断没用过的工具有没有三个
        toFill = (Object.entries(mostUsed) satisfies [string, number][]).sort((r, g) => {
            if (r[1] < g[1]) {
                return -1;
            } if (r[1] > g[1]) {
                return 1;
            }
            return 0;
        }).map(single => single[0]).slice(0, 3 - unUsed.length); // 如果没用过的工具连三个都没有，那么就从使用最少的工具里选几个
    return (isUnFull ? unUsed : unUsed.concat(toFill)).map(to => realTools.find(single => single.to === to));
}
