export type calc = "+" | "-" | "×" | "÷" | "%";
export const defaultCalcs: calc[] = [
    "+",
    "-",
    "×",
    "÷",
    "%"
];
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "MathGen",
    level: "log", // 空字符串时，不显示任何信息
});