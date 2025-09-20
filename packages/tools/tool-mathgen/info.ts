import {
    Calculate
} from "@mui/icons-material";
import {
    doubleHexTuple
} from "declare";
import {
    tool
} from "tools/info";
export default {
    name: "算式生成器",
    desc: "生成一些算式",
    icon: Calculate,
    color: doubleHexTuple("96fbc4", "f9f586")
} as tool;