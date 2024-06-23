"use client";
import range from "@verkfi/shared/range";
import {
    setState
} from "declare";
import Decimal from "decimal.js";
const sumDivMiddle = 2;
const run = (maxTimes: number, setTimes: setState<number>, setResult: setState<Decimal>) => (code: string) => {
    /**
     * 方程
     */
    const executing = new Function("x", code) as (x: number) => [number, number];
    /**
     * 计算等式两边的差
     */
    function getDiff(calcingX: Decimal) {
        const executed = executing(calcingX.toNumber());
        return new Decimal(executed[0]).minus(new Decimal(executed[1])).abs();
    }
    let left = new Decimal(maxTimes),
        /**
         * 最后setTimes用的times
         */
        endTimes = 0,
        right = new Decimal(maxTimes);
    loop: for (let times of range(maxTimes)) {
        const mid = left.plus(right).div(sumDivMiddle),
            leftDiff = getDiff(left),
            rightDiff = getDiff(right);
        switch (true) {
            case leftDiff.comparedTo(0) === 0:
                left = mid;
                break loop;
            case leftDiff.comparedTo(rightDiff) === 0:
                left = new Decimal(0);
                break;
            case leftDiff.comparedTo(rightDiff) === -1:
                right = mid;
                break;
            case rightDiff.comparedTo(leftDiff) === -1:
                left = mid;
                break;
        }
        endTimes = times;
    }
    setTimes(endTimes);
    setResult(left.plus(right).div(sumDivMiddle));
};
export default run;
