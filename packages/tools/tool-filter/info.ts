import {
    Filter
} from "@mui/icons-material";
import {
    doubleHexTuple
} from "declare";
import {
    tool
} from "tools/info";
export default {
    name: "滤镜",
    desc: "将一张图片处理成不同的",
    icon: Filter,
    color: doubleHexTuple("d299c2", "fef9d7")
} as tool;