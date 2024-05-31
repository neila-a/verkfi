import {
    Palette
} from "@mui/material";
import {
    block
} from "./matrix";
export default function drawMatrixBase(edge: number, n: number, blocks: block[], cache: block[], posBlock: block[], posCache: block[], palette: Palette, onlyPos: boolean) {
    if (!onlyPos) console.time("渲染圆");
    const canvas = document.getElementsByTagName("canvas")[0] || document.createElement("canvas"),
        size = edge / n,
        cxt = canvas.getContext("2d");
    ["height", "width"].forEach(attr => {
        const edgeStr = edge.toString();
        if (canvas.getAttribute(attr) !== edgeStr) {
            canvas.setAttribute(attr, edgeStr);
        }
    }); // 如果canvas不等于edge则设为edge
    if (!onlyPos) {
        const w = canvas.getAttribute("width");
        canvas.setAttribute("width", w); // 刷新
    }
    cxt.strokeStyle = palette.text.primary;
    const dos: [block[], string][] = [[posCache, palette.background.default], [blocks, "#FF0000"], [posBlock, palette.primary[palette.mode]]];
    dos.forEach((item, index) => {
        cxt.fillStyle = item[1];
        const path = new Path2D(), pBlock = item[0].map(item => item.toString());
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j < n; j++) {
                if (pBlock.includes([i, j].toString())) {
                    path.rect(size * j, size * i, size, size);
                }
            }
        }
        cxt.fill(path);
    });
    if (!onlyPos) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                cxt.rect(size * j, size * i, size, size);
            }
        }
    }
    cxt.stroke();
    if (!onlyPos) console.timeEnd("渲染圆");
    return canvas;
}
