export type calc = typeof defaultCalcs[number];
export const defaultCalcs = [
    "+",
    "-",
    "×",
    "÷",
    "%"
];
import LpLogger from "lp-logger";
export const logger = new LpLogger({
    name: "MathGen",
    level: "log", // 空字符串时，不显示任何信息
});