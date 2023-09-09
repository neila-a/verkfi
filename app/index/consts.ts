import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "Index",
    level: "log", // 空字符串时，不显示任何信息
});
export type viewMode = "list" | "grid";