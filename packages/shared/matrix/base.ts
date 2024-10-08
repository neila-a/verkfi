import {
    Palette
} from "@mui/material";
import range from "../range";
import {
    block
} from "./matrix";
export default function drawMatrixBase(
    edge: number, n: number, blocks: block[], posBlock: block[], posCache: block[], palette: Palette, onlyPos: boolean
) {
    if (!onlyPos) console.time("渲染圆");

    // 调整canvas大小
    const canvas = document.getElementsByTagName("canvas")[0] || document.createElement("canvas"),
        size = edge / n,
        context = canvas.getContext("2d") as CanvasRenderingContext2D;
    ["height", "width"].forEach(attr => {
        const edgeStr = edge.toString();
        if (canvas.getAttribute(attr) !== edgeStr) {
            canvas.setAttribute(attr, edgeStr);
        }
    }); // 如果canvas不等于edge则设为edge
    if (!onlyPos) {
        const width = canvas.getAttribute("width");
        canvas.setAttribute("width", width as string); // 刷新
    }

    // 渲染方块
    context.strokeStyle = palette.text.primary;
    const dos: [block[], string][] = [[posCache, palette.background.default], [blocks, "#FF0000"], [posBlock, palette.primary[palette.mode]]];
    dos.forEach((item, index) => {
        context.fillStyle = item[1];
        const path = new Path2D(), pBlock = item[0].map(item => item.toString());
        for (const x of range(n)) {
            for (const y of range(n)) {
                if (pBlock.includes([x, y].toString())) {
                    path.rect(size * y, size * x, size, size);
                }
            }
        }
        context.fill(path);
    });

    // 渲染边框
    if (!onlyPos) {
        for (const x of range(n - 1)) {
            for (const y of range(n - 1)) {
                context.rect(size * y, size * x, size, size);
            }
        }
    }
    context.stroke();

    if (!onlyPos) console.timeEnd("渲染圆");
    return canvas;
}
