import {
    block
} from 'components/matrix/matrix';
/**
 * 返回一个圆。
 * ![cylinder](./cylinder.png)
 * @source FastAsyncWorldEdit
 */
export default function makeCylinder(
    radiusX: number,
    radiusZ: number,
    thickness: number,
    filled: boolean
): block[] {
    var blocks: block[] = [];
    const height = 1;
    function setBlock(x: number, z: number) {
        const pushOne = (a: number, b: number) => blocks.push([Number(a.toFixed(0)) - 1, Number(b.toFixed(0)) - 1]);
        pushOne(radiusX + x, radiusZ + z);
        pushOne(radiusX - x, radiusZ + z);
        pushOne(radiusX + x, radiusZ - z);
        pushOne(radiusX - x, radiusZ - z);
    }
    radiusX += 0.5;
    radiusZ += 0.5;
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
                setBlock(x, z);
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
                setBlock(x, z);
            }
        }
    }
    return blocks;
}
