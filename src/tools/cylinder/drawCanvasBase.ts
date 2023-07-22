import {
    logger
} from "../cylinder";
export default function drawCanvasBase(edge: number, n: number, blocks: [number, number][]) {
    console.time("渲染圆");
    var canvas = document.createElement("canvas");
    canvas.setAttribute("height", String(edge));
    canvas.setAttribute("width", String(edge));
    console.groupCollapsed("blocks的值");
    logger.log(`blocks为`, blocks);
    logger.groupEnd("blocks的值");
    var size = edge / n;
    var cxt = canvas.getContext('2d');
    cxt.strokeStyle = "rgb(0, 0, 0)";
    cxt.fillStyle = "rgb(255, 0, 0)";
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            cxt.rect(size * j, size * i, size, size);
        }
    }
    cxt.stroke();
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            var have: boolean = false;
            blocks.forEach(value => {
                if (value[0] == i && value[1] == j) {
                    have = true;
                }
            })
            if (have) {
                cxt.rect(size * j, size * i, size, size);
            }
        }
    }
    cxt.fill();
    console.timeEnd("渲染圆");
    return canvas;
}
