import {
    Extension
} from "@mui/icons-material";
import {
    doubleHexTuple
} from "declare";
import {
    tool
} from "tools/info";
export default {
    name: "拼图",
    desc: "能自定义的拼图",
    icon: Extension,
    color: doubleHexTuple("cd9cf2", "f6f3ff")
} as tool;