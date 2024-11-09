import range from "@verkfi/shared/range";
import generateDigitsOfPi from "./generateDigitsOfPi";
export default function generatePis(digit: number) {
    const generaterInstance = generateDigitsOfPi();
    return `3.${range(digit - 1).map(() => (generaterInstance.next().value as number).toString()).toArray().join("")}`;
}
