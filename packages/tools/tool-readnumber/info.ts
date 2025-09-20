import {
    Numbers
} from "@mui/icons-material";
import {
    doubleHexTuple
} from "declare";
import {
    tool
} from "tools/info";
export default {
    name: "读数字",
    desc: "将数字转换成汉字字符串",
    icon: Numbers,
    color: doubleHexTuple("89f7fe", "66a6ff")
} as tool;