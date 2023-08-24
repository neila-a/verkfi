import LpLogger from "lp-logger";
import removeIn2 from '../removeIn';
import drawMatrixBase from "./base";
export var logger = new LpLogger({
    name: "Matrix",
    level: "log"
});
export default function drawMatrix(blocks: block[], g: number, posX: number, posZ: number, posCache: block, cache: block[]) {
    var b = document.body,
        w = b.scrollWidth - 48,
        h = b.scrollHeight - 48,
        e = w > h ? h : w,
        nowPos = [posX, posZ],
        cachePosBlock: block[] = [],
        posBlock: block[] = [];
    [nowPos, posCache].forEach((item, index) => ["X", "Z"].forEach((item2, index2) => {
        let i: number = 0;
        while (i < g * 2) {
            let block: block = index2 == 0 ? [i, item[index2] - 1] : [item[index2] - 1, i];
            index == 0 ? posBlock.push(block) : cachePosBlock.push(block);
            i++;
        }
    }));
    posBlock = removeIn2(posBlock, blocks) as block[];
    cachePosBlock = removeIn2(cachePosBlock, blocks) as block[];
    drawMatrixBase(e, g * 2 + 1, blocks, cache, posBlock, cachePosBlock);
}

export type block = [number, number];

