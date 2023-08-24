import {
    block
} from './drawCanvasBase';
export default function makeCylinder(
    radiusX: number,
    radiusZ: number,
    height: number,
    thickness: number,
    filled: boolean
): block[] { /* 修改自IntellectualSites的FastAsyncWorldEdit */
    var blocks: block[] = [];
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
        forX: for (var x = 0; x <= ceilRadiusX; ++x) {
            var xn = nextXn;
            var dx2 = nextMinXn * nextMinXn;
            nextXn = (x + 1) * invRadiusX;
            nextMinXn = (x + 1) * minInvRadiusX;
            var nextZn = 0;
            var nextMinZn = 0;
            xSqr = xn * xn;
            forZ: for (var z = 0; z <= ceilRadiusZ; ++z) {
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
        forX: for (var x = 0; x <= ceilRadiusX; ++x) {
            var xn = nextXn;
            nextXn = (x + 1) * invRadiusX;
            var nextZn = 0;
            xSqr = xn * xn;
            forZ: for (var z = 0; z <= ceilRadiusZ; ++z) {
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
