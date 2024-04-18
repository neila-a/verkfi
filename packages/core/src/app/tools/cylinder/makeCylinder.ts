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
    const blocks: block[] = [];
    function setBlock(x: number, z: number) {
        const pushOne = (a: number, b: number) => blocks.push([Number(a.toFixed(0)) - 1, Number(b.toFixed(0)) - 1]);
        pushOne(radiusX + x, radiusZ + z);
        pushOne(radiusX - x, radiusZ + z);
        pushOne(radiusX + x, radiusZ - z);
        pushOne(radiusX - x, radiusZ - z);
    }
    radiusX += 0.5;
    radiusZ += 0.5;
    const invRadiusX = 1 / radiusX,
        invRadiusZ = 1 / radiusZ,
        ceilRadiusX = Math.ceil(radiusX),
        ceilRadiusZ = Math.ceil(radiusZ);
    let xSqr: number,
        zSqr: number,
        distanceSq: number,
        nextXn = 0;
    if (thickness != 0) {
        let nextMinXn = 0;
        const minInvRadiusX = 1 / (radiusX - thickness),
            minInvRadiusZ = 1 / (radiusZ - thickness);
        forX: for (let x = 0; x <= ceilRadiusX; ++x) {
            const xn = nextXn,
                dx2 = nextMinXn * nextMinXn;
            nextXn = (x + 1) * invRadiusX;
            nextMinXn = (x + 1) * minInvRadiusX;
            let nextZn = 0,
                nextMinZn = 0;
            xSqr = xn * xn;
            forZ: for (let z = 0; z <= ceilRadiusZ; ++z) {
                const zn = nextZn,
                    dz2 = nextMinZn * nextMinZn;
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
        forX: for (let x = 0; x <= ceilRadiusX; ++x) {
            const xn = nextXn;
            nextXn = (x + 1) * invRadiusX;
            let nextZn = 0;
            xSqr = xn * xn;
            forZ: for (let z = 0; z <= ceilRadiusZ; ++z) {
                const zn = nextZn;
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
