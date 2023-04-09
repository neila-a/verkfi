import {
    useEffect, useRef
} from "react";
import LpLogger from "lp-logger";
var logger = new LpLogger({
    name: "画圆",
    level: "log"
});
export function makeCylinder(
    radiusX: number,
    radiusZ: number,
    height: number,
    thickness: number,
    filled: boolean
): [number, number][] { /* 修改自IntellectualSites的FastAsyncWorldEdit */
    var blocks: [number, number][] = [];
    function setBlock(x: number, y: number, z: number) {
        blocks.push([Number((radiusX + x).toFixed(0)) - 1, Number((radiusZ + z).toFixed(0)) - 1]);
        blocks.push([Number((radiusX - x).toFixed(0)) - 1, Number((radiusZ + z).toFixed(0)) - 1]);
        blocks.push([Number((radiusX + x).toFixed(0)) - 1, Number((radiusZ - z).toFixed(0)) - 1]);
        blocks.push([Number((radiusX - x).toFixed(0)) - 1, Number((radiusZ - z).toFixed(0)) - 1]);
    }
    radiusX += 0.5;
    radiusZ += 0.5;
    if (height == 0) {
        return [];
    } else if (height < 0) {
        height = -height;
    }
    var invRadiusX = 1 / radiusX;
    var invRadiusZ = 1 / radiusZ;
    var ceilRadiusX = Math.ceil(radiusX);
    var ceilRadiusZ = Math.ceil(radiusZ);
    var xSqr: number;
    var zSqr: number;
    var distanceSq: number;
    var nextXn = 0;
    if (thickness != 0) {
        var nextMinXn = 0;
        var minInvRadiusX = 1 / (radiusX - thickness);
        var minInvRadiusZ = 1 / (radiusZ - thickness);
        forX:
        for (var x = 0; x <= ceilRadiusX; ++x) {
            var xn = nextXn;
            var dx2 = nextMinXn * nextMinXn;
            nextXn = (x + 1) * invRadiusX;
            nextMinXn = (x + 1) * minInvRadiusX;
            var nextZn = 0;
            var nextMinZn = 0;
            xSqr = xn * xn;
            forZ:
            for (var z = 0; z <= ceilRadiusZ; ++z) {
                var zn = nextZn;
                var dz2 = nextMinZn * nextMinZn;
                nextZn = (z + 1) * invRadiusZ;
                nextMinZn = (z + 1) * minInvRadiusZ;
                zSqr = zn * zn;
                distanceSq = xSqr + zSqr;
                if (distanceSq > 1) {
                    if (z == 0) {
                        break forX;
                    }
                    break forZ;
                }
                if ((dz2 + nextMinXn * nextMinXn <= 1) && (nextMinZn * nextMinZn + dx2 <= 1)) {
                    continue;
                }
                for (var y = 0; y < height; ++y) {
                    setBlock(x, y, z);
                }
            }
        }
    } else {
        forX:
        for (var x = 0; x <= ceilRadiusX; ++x) {
            var xn = nextXn;
            nextXn = (x + 1) * invRadiusX;
            var nextZn = 0;
            xSqr = xn * xn;
            forZ:
            for (var z = 0; z <= ceilRadiusZ; ++z) {
                var zn = nextZn;
                nextZn = (z + 1) * invRadiusZ;
                zSqr = zn * zn;
                distanceSq = xSqr + zSqr;
                if (distanceSq > 1) {
                    if (z == 0) {
                        break forX;
                    }
                    break forZ;
                }
                if (!filled) {
                    if ((zSqr + nextXn * nextXn <= 1) && (nextZn * nextZn + xSqr <= 1)) {
                        continue;
                    }
                }
                for (var y = 0; y < height; ++y) {
                    setBlock(x, y, z);
                }
            }
        }
    }
    return blocks;
}
export function drawCanvasBase(canvas: HTMLCanvasElement, edge: number, n: number, blocks: [number, number][]) {
    logger.log(`blocks为`, blocks);
    var size = edge / n;
    canvas.setAttribute("height", String(edge));
    canvas.setAttribute("width", String(edge));
    var cxt = canvas.getContext('2d');
    cxt.strokeStyle = "rgb(0, 0, 0)";
    console.groupCollapsed("方块渲染进程");
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            var have: boolean = false;
            blocks.forEach(value => {
                if (value[0] == i && value[1] == j) {
                    have = true;
                }
            })
            if (have) {
                logger.info(`正在渲染方块，x: ${i}，y: ${j}，为实`);
                cxt.fillStyle = "rgb(255, 0, 0)";
            } else {
                logger.info(`正在渲染方块，x: ${i}，y: ${j}，为空`);
                cxt.fillStyle = "rgb(255, 255, 255)";
            }
            cxt.fillRect(size * j, size * i, size, size);
            cxt.strokeRect(size * j, size * i, size, size);
        }
    }
    logger.groupEnd("方块渲染进程");
}
declare global {  //设置全局属性
    interface Window {  //window对象属性
        drawCanvas(
            radiusX: number,
            radiusZ: number,
            thickness: number,
            filled: boolean,
            size: number
        ): void;
    }
}
export function Cylinder(): JSX.Element {
    var canvas = useRef();
    const drawCanvas = (
        radiusX: number,
        radiusZ: number,
        thickness: number,
        filled: boolean,
        size: number
    ) => {
        var g = radiusX > radiusZ ? radiusX : radiusZ;
        drawCanvasBase(canvas.current, g * size, g * 2, makeCylinder(radiusX, radiusZ, 1, thickness, filled))
    };
    useEffect(() => {
        window.drawCanvas = drawCanvas;
    })
    return (
        <>
            <canvas ref={canvas} />
        </>
    );
}
export default Cylinder;