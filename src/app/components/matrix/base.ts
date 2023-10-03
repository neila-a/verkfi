import {
    block,
    logger
} from "./matrix";
import {
    PaletteMode
} from "@mui/material";
import {
    Graphics
} from "@pixi/graphics";
export default function drawMatrixBase(edge: number, n: number, blocks: block[], cache: block[], posBlock: block[], posCache: block[], colorMode: PaletteMode, cxt: Graphics) {
    const onlyPos = blocks.toString() === cache.toString();
    if (!onlyPos) console.time("渲染圆");
    const canvasByTag = document.getElementsByTagName("canvas")[0] as HTMLCanvasElement, canvas = canvasByTag == null ? document.createElement("canvas") : canvasByTag, size = edge / n;
    if (!onlyPos) {
        canvas.setAttribute("width", edge.toString());
        canvas.setAttribute("height", edge.toString());
    }
    if (!onlyPos) {
        console.groupCollapsed("blocks的值");
        logger.log(`blocks为`, blocks);
        logger.groupEnd("blocks的值");
    }
    cxt.lineStyle(1, colorMode === "light" ? 0x000000 : 0xffffff, 1);
    const dos: [block[], string][] = [[posCache, colorMode === "dark" ? "#000000" : "#FFFFFF"], [blocks, "#FF0000"], [posBlock, "#1E9FFF"]];
    dos.forEach((item, index) => {
        cxt.beginFill(item[1]);
        const pBlock = item[0];
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j < n; j++) {
                let have: boolean = false;
                pBlock.forEach(value => {
                    if (value[0] == i && value[1] == j) {
                        have = true;
                    }
                });
                if (have) {
                    cxt.drawRect(size * j, size * i, size, size);
                }
            }
        }
        cxt.endFill();
    });
    if (!onlyPos) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // cxt.rect(size * j, size * i, size, size);
            }
        }
    }
    if (!onlyPos) console.timeEnd("渲染圆");
}
