import {
    Palette
} from "@mui/material";
import drawMatrixBase from "./base";
export type block = [number, number];
/**
 * 直径除以半径
 */
export const dDivR = 2;
export default function drawMatrix(
    blocks: block[], edgeBlock: number, posX: number, posZ: number, posCache: block, palette: Palette, onlyPos: boolean
) {
    const edge = Number(window.getComputedStyle(document.getElementById("canvascontainer").parentElement.children[0]).width.replace("px", "")),
        nowPos: block = [posX, posZ],
        cachePosBlock: block[] = [],
        posBlock: block[] = [];
    [nowPos, posCache].forEach((item, index) => {
        let i: number = 0;
        while (i < edgeBlock * dDivR + 1) {
            const calcBlock: block[] = [[i, item[0] - 1], [item[1] - 1, i]];
            index === 0 /* 判断是否为当前位置 */ ? posBlock.push(...calcBlock) : cachePosBlock.push(...calcBlock);
            i++;
        }
    });
    drawMatrixBase(edge, edgeBlock * dDivR + 1, blocks, posBlock, cachePosBlock, palette, onlyPos);
}
