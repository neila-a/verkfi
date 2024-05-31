"use client";
import {
    collocation,
    pillarPositions
} from "./page";
const validateDistanceLength = (distanceLength: number) => (distanceLength > 0) && (Math.ceil(distanceLength) === distanceLength);
export default function calcPillars(type: pillarPositions, length: number) {
    const collocations: collocation[] = [];
    for (let count = 1; count < length; count++) {
        for (let pillarLength = 1; pillarLength < length; pillarLength++) {
            /*
             * 此时distanceLength已知！
             * 除法要求是整数
             */
            switch (type) {
                case "onlyMiddle": {
                    const distanceLength = (length - count * pillarLength) / (count + 1);
                    if (((count + 1) * distanceLength + count * pillarLength === length) && validateDistanceLength(distanceLength)) {
                        collocations.push({
                            pillarLength,
                            pillarCount: count,
                            distanceLength,
                            distanceCount: count + 1
                        });
                    }
                    break;
                } case "oneEndAndMiddle": {
                    const distanceLength = length / count - pillarLength;
                    if ((count * (pillarLength + distanceLength) === length) && validateDistanceLength(distanceLength)) {
                        collocations.push({
                            pillarLength,
                            pillarCount: count,
                            distanceLength,
                            distanceCount: count
                        });
                    }
                    break;
                } case "twoEndAndMiddle": {
                    const distanceLength = (length - pillarLength) / count - pillarLength;
                    if ((count * distanceLength + (count + 1) * pillarLength === length) && validateDistanceLength(distanceLength)) {
                        collocations.push({
                            pillarLength,
                            pillarCount: count + 1,
                            distanceLength,
                            distanceCount: count
                        });
                    }
                    break;
                } // 使用中括号制造块作用域，从而声明三种distanceLength
            }
        }
    }
    return collocations;
}
