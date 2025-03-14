import toolsInfoAtom from "@verkfi/core-ui/src/tools/info";
import {
    atomWithRefresh
} from "jotai/utils";
import {
    mostUsedAtom
} from ".";
import {
    mostUsedSelects
} from "index/consts";
import {
    not
} from "../TransferList";
const recommendAtom = atomWithRefresh(get => {
    const mostUsed = get(mostUsedAtom),
        realTools = get(toolsInfoAtom);
    const
        unUsed = not(realTools.map(single => single.to), Object.keys(mostUsed)).sort(() => {
            // 0.5用于随机
            // eslint-disable-next-line no-magic-numbers
            return Math.random() - 0.5;
        }).slice(0, mostUsedSelects), isUnFull = unUsed.length < mostUsedSelects, // 判断没用过的工具有没有三个
        toFill = Object.entries(mostUsed).sort((r, g) => {
            if (r[1] < g[1]) {
                return -1;
            } if (r[1] > g[1]) {
                return 1;
            }
            return 0;
        }).map(single => single[0]).slice(0, mostUsedSelects - unUsed.length); // 如果没用过的工具连三个都没有，那么就从使用最少的工具里选几个
    return (isUnFull ? unUsed : unUsed.concat(toFill)).map(to => realTools.find(single => single.to === to));
});
export default recommendAtom;
