/**
 * 从两个二维数组中去重
 * @param arrayA 第一个数组
 * @param arrayB 第二个数组
 * @returns 去重之后的一个数组
 */
export default function removeIn2<T = any>(arrayA: T[][], arrayB: T[][]) {
    var t: T[][] = [];
    for (let i = 0; i < arrayA.length; i++) {
        for (let j = 0; j < arrayB.length; j++) {
            if (arrayA[i].toString() == arrayB[j].toString()) {
                t.push(arrayA[j]);
            }
        }
    }
    t = t.filter(item => !(item == undefined));
    return arrayA.filter(itemA => !t.some(itemB => itemA.toString() == itemB.toString()));
}