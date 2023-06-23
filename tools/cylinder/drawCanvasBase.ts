import {
    logger
} from "../cylinder";
export default function drawCanvasBase(edge: number, n: number, blocks: [number, number][]) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("height", String(edge));
    canvas.setAttribute("width", String(edge));
    console.groupCollapsed("blocks的值");
    logger.log(`blocks为`, blocks);
    logger.groupEnd("blocks的值");
    var size = edge / n;
    var cxt = canvas.getContext('2d');
    cxt.strokeStyle = "rgb(0, 0, 0)";
    console.groupCollapsed("方块渲染进程");
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            var have: boolean = false;
            cxt.fillStyle = "rgb(255, 0, 0)";
            blocks.forEach(value => {
                if (value[0] == i && value[1] == j) {
                    have = true;
                }
            })
            if (have) {
                logger.info(`正在渲染方块：x: ${i}，y: ${j}`);
                cxt.fillRect(size * j, size * i, size, size);
            }
            cxt.strokeRect(size * j, size * i, size, size);
        }
    }
    logger.groupEnd("方块渲染进程");
    return canvas;
}