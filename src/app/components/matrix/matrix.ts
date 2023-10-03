import LpLogger from "lp-logger";
import removeIn2 from '../removeIn';
import drawMatrixBase from "./base";
import {
    PaletteMode
} from "@mui/material";
export var logger = new LpLogger({
    name: "Matrix",
    level: "log"
});
import {
    Graphics
} from "@pixi/graphics";
export default function drawMatrix(blocks: block[], g: number, posX: number, posZ: number, posCache: block, cache: block[], colorMode: PaletteMode, graphics: Graphics) {
    var e = Math.min(document.body.scrollWidth - 48, document.body.scrollHeight - 48),
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
    drawMatrixBase(e, g * 2 + 1, blocks, cache, posBlock, cachePosBlock, colorMode, graphics);
}

export type block = [number, number];

