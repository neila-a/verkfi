import {
    Audiotrack as AudiotrackIcon,
    Abc as ABCIcon,
    AccessTime as AccessTimeIcon,
    FlipCameraAndroid as FlipCameraAndroidIcon,
    Filter as FilterIcon,
    Numbers as NumbersIcon,
    Keyboard as KeyboardIcon,
} from "@mui/icons-material";
import Image from "next/image";
import ShaiziIcon from "../public/shaizi.24x24.svg";
import PiIcon from "../public/pi.466x393.png";
export interface tool {
    name: string;
    to: string;
    desc: string;
    icon: () => JSX.Element;
}
export const tools: tool[] = [
    {
        name: "AudioTools",
        to: "audiotools",
        desc: "复读、文本转音频",
        icon: () => <AudiotrackIcon />
    },
    {
        name: "CountLetter",
        to: "countletter",
        desc: "找出字母在26字母表中的顺序",
        icon: () => <ABCIcon />
    },
    {
        name: "时钟",
        to: "clock",
        desc: "显示自定义化的时间",
        icon: () => <AccessTimeIcon />
    },
    {
        name: "π计算器",
        to: "pi",
        desc: "计算π的小数点后任意位",
        icon: () => <Image src={PiIcon} alt="圆周率图标" height={24} width={24} />
    },
    {
        name: "翻转",
        to: "reversal",
        desc: "随机翻转字符串",
        icon: () => <FlipCameraAndroidIcon />
    },
    {
        name: "掷骰子",
        to: "shaizi",
        desc: "随机掷骰子",
        icon: () => <Image src={ShaiziIcon} alt="骰子图标" />
    },
    {
        name: "滤镜",
        to: "filter",
        desc: "将一张图片处理成不同的",
        icon: () => <FilterIcon />
    },
    {
        name: "按键编码",
        to: "keycode",
        desc: "查询一个按键的编码",
        icon: () => <KeyboardIcon />
    },
    {
        name: "读数字",
        to: "readnumber",
        desc: "将数字转换成汉字字符串",
        icon: () => <NumbersIcon />
    }
];
export default tools;