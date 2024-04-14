"use client";
import generateDigitsOfPi from "./generateDigitsOfPi";
export default function generatePis(digit: number) {
    let ret = "3.",
        generaterInstance = generateDigitsOfPi();
    for (let i = 0; i < digit; i++) {
        ret += (generaterInstance.next().value as number).toString();
    }
    return ret;
}