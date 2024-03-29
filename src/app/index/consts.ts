import LpLogger from "lp-logger";
import {
    createContext
} from "react";
export const logger = new LpLogger({
    name: "Index",
    level: "log", // 空字符串时，不显示任何信息
});
export const homeWhere = createContext<"no" | "recently" | "most">("no"); // 在主页的哪里
export type viewMode = "list" | "grid";