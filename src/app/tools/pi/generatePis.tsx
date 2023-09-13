"use client";
import generateDigitsOfPi from "./generateDigitsOfPi";
export default function generatePis(ws: number) {
    var ret = "3.",
        generaterInstance = generateDigitsOfPi();
    for (let i = 0; i < ws; i++) {
        ret += (generaterInstance.next().value as number).toString();
    }
    return ret;
}