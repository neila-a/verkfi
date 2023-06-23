// This file is obsolete.

export function makeCylinder(
    radiusX: i16,
    radiusZ: i16,
    height: i8,
    thickness: i16,
    filled: bool
): Array<Array<i16>> { /* 修改自IntellectualSites的FastAsyncWorldEdit */
    var blocks: Array<Array<i16>> = [];
    function setBlock(x: i16, y: i8, z: i16): void {
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
    var invRadiusX: f32 = 1 / radiusX;
    var invRadiusZ: f32 = 1 / radiusZ;
    var ceilRadiusX: i16 = Math.ceil(radiusX);
    var ceilRadiusZ: i16 = Math.ceil(radiusZ);
    var xSqr: i16;
    var zSqr: i16;
    var distanceSq: i16 = 0;
    var nextXn: i16 = 0;
    if (thickness != 0) {
        var nextMinXn: i16 = 0;
        var minInvRadiusX: f32 = 1 / (radiusX - thickness);
        var minInvRadiusZ: f32 = 1 / (radiusZ - thickness);
        forX: for (var x: i16 = 0; x <= ceilRadiusX; ++x) {
            var xn: i16 = nextXn;
            var dx2: i16 = nextMinXn * nextMinXn;
            nextXn = (x + 1) * invRadiusX;
            nextMinXn = (x + 1) * minInvRadiusX;
            var nextZn: i16 = 0;
            var nextMinZn: i16 = 0;
            xSqr = xn * xn;
            forZ: for (var z: i16 = 0; z <= ceilRadiusZ; ++z) {
                var zn: i16 = nextZn;
                var dz2: i16 = nextMinZn * nextMinZn;
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
        forX: for (var x: i16 = 0; x <= ceilRadiusX; ++x) {
            var xn: i16 = nextXn;
            nextXn = (x + 1) * invRadiusX;
            var nextZn: i16 = 0;
            xSqr = xn * xn;
            forZ: for (var z = 0; z <= ceilRadiusZ; ++z) {
                var zn: i16 = nextZn;
                nextZn = (z + 1) * invRadiusZ;
                zSqr = zn * zn;
                distanceSq = xSqr + zSqr;
                if (distanceSq > 1) {
                    if (z == 0) {
                        break forX;
                    }
                    break forZ;
                }
                if (!(filled == 1)) {
                    if ((zSqr + nextXn * nextXn <= 1) && (nextZn * nextZn + xSqr <= 1)) {
                        continue;
                    }
                }
                for (var y: i8 = 0; y < height; ++y) {
                    setBlock(x, y, z);
                }
            }
        }
    }
    return blocks;
}