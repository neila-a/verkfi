
import {
    Pi
} from "mdi-material-ui";
import {
    doubleHexTuple
} from "declare";
import {
    tool
} from "tools/info";
export default {
    name: "pi.π计算器",
    desc: "pi.计算π的小数点后任意位",
    icon: Pi,
    color: doubleHexTuple("4facfe", "00f2fe")
} as tool;