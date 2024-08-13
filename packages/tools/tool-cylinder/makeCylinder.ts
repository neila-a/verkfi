/* eslint-disable no-magic-numbers */
// 整段代码都是从FAWE来的，根本不知道什么意思
import {
    block
} from "@verkfi/shared/matrix/matrix";
import range from "@verkfi/shared/range";
/**
 * 生成一个圆。
 * ![cylinder](./cylinder.png)
 * @source FastAsyncWorldEdit
 */
export default class Cylinder extends Array<block> {
    setBlock(x: number, z: number, radiusX: number, radiusZ: number) {
        const pushOne = (a: number, b: number) => super.push([+a.toFixed(0) - 1, +b.toFixed(0) - 1]);
        pushOne(radiusX + x, radiusZ + z);
        pushOne(radiusX - x, radiusZ + z);
        pushOne(radiusX + x, radiusZ - z);
        pushOne(radiusX - x, radiusZ - z);
    }
    constructor(
        radiusX: number,
        radiusZ: number,
        thickness: number,
        filled: boolean
    ) {
        super();
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
        if (thickness !== 0) {
            let nextMinXn = 0;
            const minInvRadiusX = 1 / (radiusX - thickness),
                minInvRadiusZ = 1 / (radiusZ - thickness);
            forX: for (const x of range(ceilRadiusX)) {
                const xn = nextXn,
                    dx2 = nextMinXn * nextMinXn;
                nextXn = (x + 1) * invRadiusX;
                nextMinXn = (x + 1) * minInvRadiusX;
                let nextZn = 0,
                    nextMinZn = 0;
                xSqr = xn * xn;
                for (const z of range(ceilRadiusZ)) {
                    const zn = nextZn,
                        dz2 = nextMinZn * nextMinZn;
                    nextZn = (z + 1) * invRadiusZ;
                    nextMinZn = (z + 1) * minInvRadiusZ;
                    zSqr = zn * zn;
                    distanceSq = xSqr + zSqr;
                    if (distanceSq > 1) {
                        if (z === 0) {
                            break forX;
                        }
                        break;
                    }
                    if (dz2 + nextMinXn * nextMinXn <= 1 && nextMinZn * nextMinZn + dx2 <= 1) {
                        continue;
                    }
                    this.setBlock(x, z, radiusX, radiusZ);
                }
            }
        } else {
            forX: for (const x of range(ceilRadiusX)) {
                const xn = nextXn;
                nextXn = (x + 1) * invRadiusX;
                let nextZn = 0;
                xSqr = xn * xn;
                for (const z of range(ceilRadiusZ)) {
                    const zn = nextZn;
                    nextZn = (z + 1) * invRadiusZ;
                    zSqr = zn * zn;
                    distanceSq = xSqr + zSqr;
                    if (distanceSq > 1) {
                        if (z === 0) {
                            break forX;
                        }
                        break;
                    }
                    if (!filled) {
                        if (zSqr + nextXn * nextXn <= 1 && nextZn * nextZn + xSqr <= 1) {
                            continue;
                        }
                    }
                    this.setBlock(x, z, radiusX, radiusZ);
                }
            }
        }
    }
}
