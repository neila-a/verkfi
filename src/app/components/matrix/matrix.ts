import LpLogger from "lp-logger";
import removeIn2 from '../removeIn';
import drawMatrixBase from "./base";
import {
    Palette
} from "@mui/material";
export var logger = new LpLogger({
    name: "Matrix",
    level: "log"
});
export type block = [number, number];
export default function drawMatrix(blocks: block[], g: number, posX: number, posZ: number, posCache: block, cache: block[], palette: Palette, onlyPos: boolean) {
    var e = Number(window.getComputedStyle(document.getElementById("canvascontainer").parentElement.children[0]).width.replace("px", "")), // Decrepated: Math.max(w, h),
        nowPos: block = [posX, posZ],
        cachePosBlock: block[] = [],
        posBlock: block[] = [];
    [nowPos, posCache].forEach((item, index) => {
        let i: number = 0;
        while (i < (g * 2 + 1)) {
            const calcBlock: block[] = [[i, item[0] - 1], [item[1] - 1, i]];
            index == 0 /* 判断是否为当前位置 */ ? posBlock.push(...calcBlock) : cachePosBlock.push(...calcBlock);
            i++;
        }
    });
    drawMatrixBase(e, g * 2 + 1, blocks, cache, posBlock, cachePosBlock, palette, onlyPos);
}
