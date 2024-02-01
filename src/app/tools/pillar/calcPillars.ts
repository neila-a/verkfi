"use client";
import {
    type,
    collocation
} from "./page";
export default function calcPillars(type: type, length: number) {
    const collocations: collocation[] = [], validateDistanceLength = (distanceLength: number) => (distanceLength > 0) && (Math.ceil(distanceLength) === distanceLength);
    for (let count = 1; count < length; count++) {
        for (let pillarLength = 1; pillarLength < length; pillarLength++) {
            /*
             * 此时distanceLength已知！
             * 除法要求是整数
             */
            switch (type) {
                case 0: {
                    const distanceLength = (length - count * pillarLength) / (count + 1);
                    if (((count + 1) * distanceLength + count * pillarLength === length) && validateDistanceLength(distanceLength)) {
                        collocations.push([pillarLength, count, distanceLength, count + 1]);
                    }
                    break;
                } case 1: {
                    const distanceLength = length / count - pillarLength;
                    if ((count * (pillarLength + distanceLength) === length) && validateDistanceLength(distanceLength)) {
                        collocations.push([pillarLength, count, distanceLength, count]);
                    }
                    break;
                } case 2: {
                    const distanceLength = (length - pillarLength) / count - pillarLength;
                    if ((count * distanceLength + (count + 1) * pillarLength === length) && validateDistanceLength(distanceLength)) {
                        collocations.push([pillarLength, count + 1, distanceLength, count]);
                    }
                    break;
                } // 使用中括号制造块作用域，从而声明三种distanceLength
            }
        }
    }
    return collocations;
}
