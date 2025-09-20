import {
    FlipCameraAndroid
} from "@mui/icons-material";
import {
    doubleHexTuple
} from "declare";
import {
    tool
} from "tools/info";
export default {
    name: "翻转",
    desc: "随机翻转字符串",
    icon: FlipCameraAndroid,
    color: doubleHexTuple("fa709a", "fee140")
} as tool;