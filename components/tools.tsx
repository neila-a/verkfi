import dynamic from "next/dynamic";
import audiotools from "../tools/audiotools";
import countletter from "../tools/countletter";
import filter from "../tools/filter";
import pi from "../tools/pi";
import readnumber from "../tools/readnumber";
import reversal from "../tools/reversal";
import shaizi from "../tools/shaizi";
import mathgen from "../tools/mathgen";
import jigsaw from "../tools/jigsaw";
const cubic = dynamic(() => import("../tools/cubic"), {
    ssr: false,
});
import cylinder from "../tools/cylinder";
export const components = {
    audiotools,
    countletter,
    filter,
    pi,
    readnumber,
    reversal,
    shaizi,
    mathgen,
    cubic,
    jigsaw,
    cylinder
}; // Load tools end
import {
    Audiotrack as AudiotrackIcon,
    Abc as ABCIcon,
    AccessTime as AccessTimeIcon,
    FlipCameraAndroid as FlipCameraAndroidIcon,
    Filter as FilterIcon,
    Numbers as NumbersIcon,
    Extension as ExtensionIcon,
    ViewInAr as ViewInArIcon,
    Adjust as AdjustIcon
} from "@mui/icons-material";
import Image from "next/image";
import {
    OverridableComponent
} from "@mui/material/OverridableComponent";
import {
    SvgIconTypeMap
} from "@mui/material";
export interface tool {
    name: string;
    to?: string;
    goto?: string;
    desc: string;
    icon?: (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string
    }) | (() => JSX.Element);
}
export const tools: tool[] = [
    {
        name: "AudioTools",
        to: "audiotools",
        desc: "录音、复读",
        icon: AudiotrackIcon
    },
    {
        name: "CountLetter",
        to: "countletter",
        desc: "找出字母在26字母表中的顺序",
        icon: ABCIcon
    },
    {
        name: "π计算器",
        to: "pi",
        desc: "计算π的小数点后任意位",
        icon: () => <Image src="/image/pi.466x393.png" alt="圆周率图标" height={24} width={24} />
    },
    {
        name: "翻转",
        to: "reversal",
        desc: "随机翻转字符串",
        icon: FlipCameraAndroidIcon
    },
    {
        name: "掷色子",
        to: "shaizi",
        desc: "随机掷色子",
        icon: () => <Image src="/image/shaizi.24x24.svg" alt="色子图标" height={24} width={24} />
    },
    {
        name: "滤镜",
        to: "filter",
        desc: "将一张图片处理成不同的",
        icon: FilterIcon
    },
    {
        name: "读数字",
        to: "readnumber",
        desc: "将数字转换成汉字字符串",
        icon: NumbersIcon
    },
    {
        name: "算式生成器",
        to: "mathgen",
        desc: "生成一些算式",
        icon: NumbersIcon
    },
    {
        name: "拼图",
        to: "jigsaw",
        desc: "能自定义的拼图",
        icon: ExtensionIcon
    },
    {
        name: "立方体",
        to: "cubic",
        desc: "可视化的立方体",
        icon: ViewInArIcon
    },
    {
        name: "人生倒计时",
        goto: "https://github.neila.ga/countdown.js/",
        desc: "显示时间过去了多少",
        icon: AccessTimeIcon
    },
    {
        name: "画圆",
        to: "cylinder",
        desc: "根据各种不同的选项画圆",
        icon: AdjustIcon
    }
];
export default tools;