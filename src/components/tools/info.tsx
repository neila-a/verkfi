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
export const getTools = I18N => [
    {
        name: "AudioTools",
        to: "audiotools",
        desc: I18N.get('录音、复读'),
        icon: AudiotrackIcon
    },
    {
        name: "CountLetter",
        to: "countletter",
        desc: I18N.get('找出字母在26字母表中的顺序'),
        icon: ABCIcon
    },
    {
        name: I18N.get('π计算器'),
        to: "pi",
        desc: I18N.get('计算π的小数点后任意位'),
        icon: () => <Image placeholder="blur" src="/image/pi.466x393.png" alt={I18N.get('圆周率图标')} height={24} width={24} />
    },
    {
        name: I18N.get('翻转'),
        to: "reversal",
        desc: I18N.get('随机翻转字符串'),
        icon: FlipCameraAndroidIcon
    },
    {
        name: I18N.get('掷色子'),
        to: "shaizi",
        desc: I18N.get('随机掷色子'),
        icon: () => <Image placeholder="blur" src="/image/shaizi.24x24.svg" alt={I18N.get('色子图标')} height={24} width={24} />
    },
    {
        name: I18N.get('滤镜'),
        to: "filter",
        desc: I18N.get('将一张图片处理成不同的'),
        icon: FilterIcon
    },
    {
        name: I18N.get('读数字'),
        to: "readnumber",
        desc: I18N.get('将数字转换成汉字字符串'),
        icon: NumbersIcon
    },
    {
        name: I18N.get('算式生成器'),
        to: "mathgen",
        desc: I18N.get('生成一些算式'),
        icon: NumbersIcon
    },
    {
        name: I18N.get('拼图'),
        to: "jigsaw",
        desc: I18N.get('能自定义的拼图'),
        icon: ExtensionIcon
    },
    {
        name: I18N.get('立方体'),
        to: "cubic",
        desc: I18N.get('可视化的立方体'),
        icon: ViewInArIcon
    },
    {
        name: I18N.get('画圆'),
        to: "cylinder",
        desc: I18N.get('根据各种不同的选项画圆'),
        icon: AdjustIcon
    },
    {
        name: I18N.get('人生倒计时'),
        goto: "https://github.neila.ga/countdown.js/",
        desc: I18N.get('显示时间过去了多少'),
        icon: AccessTimeIcon
    }
];
