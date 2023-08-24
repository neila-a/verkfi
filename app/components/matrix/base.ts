import {
    block,
    logger
} from "./matrix";
export default function drawMatrixBase(edge: number, n: number, blocks: block[], cache: block[], posBlock: block[], posCache: block[]) {
    const onlyPos = blocks.toString() === cache.toString();
    if (!onlyPos) console.time("渲染圆");
    const canvasByTag = document.getElementsByTagName("canvas")[0] as HTMLCanvasElement, canvas = canvasByTag == null ? document.createElement("canvas") : canvasByTag, size = edge / n, cxt = canvas.getContext('2d');
    ["height", "width"].forEach(attr => {
        const edgeStr = edge.toString();
        if (canvas.getAttribute(attr) != edgeStr) {
            canvas.setAttribute(attr, edgeStr);
        }
    });
    if (!onlyPos) {
        const w = canvas.getAttribute("width");
        canvas.setAttribute("width", w);
        console.groupCollapsed("blocks的值");
        logger.log(`blocks为`, blocks);
        logger.groupEnd("blocks的值");
    }
    cxt.strokeStyle = "rgb(0, 0, 0)";
    const dos: [block[], string][] = [[posCache, "#FFFFFF"], [blocks, "#FF0000"], [posBlock, "#1E9FFF"]];
    dos.forEach((item, index) => {
        cxt.fillStyle = item[1];
        const path = new Path2D(), pBlock = item[0];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let have: boolean = false;
                pBlock.forEach(value => {
                    if (value[0] == i && value[1] == j) {
                        have = true;
                    }
                });
                if (have) {
                    index == 0 ? cxt.clearRect(size * j, size * i, size, size) : path.rect(size * j, size * i, size, size);
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
