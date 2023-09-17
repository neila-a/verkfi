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
import i18n from "react-intl-universal";
import {
    FC
} from "react";
import {
    Hex
} from "../declare";
const hex = Hex.hex;
/**
 * Metadata for your tool.
 */
export interface tool {

    /** 
     * Name of your tool.
     * @example FooBar
     */
    name: string;

    /**
     * Path of your tool.
     * @example foo-bar
     */
    to: Lowercase<string>;

    /**
     * Description of your tool.
     * @example Foo for the bar.
     */
    desc: string;

    /**
     * URL for icon of your tool.
     * @example https://foo.com/bar.png
     */
    icon: (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string
    }) | FC;

    /**
     * Background of your tool.  
     * It will display in HeadBar when user set "color" to true.  
     * It should be uppercase.
     * @example ["000000", "FFFFFF"]
     */
    color: [Hex.Hex, Hex.Hex];

    /**
     * If your tool is in the outside, set this.  
     * If enabled, when user click your tool, they will redirect to the address in "to".
     * @example true
     */
    isGoto?: boolean;

}
export const getTools = (I18N: typeof i18n): tool[] => [
    {
        name: "AudioTools",
        to: "audiotools",
        desc: I18N.get('录音、复读'),
        icon: AudiotrackIcon,
        color: [hex("84fab0"), hex("8fd3f4")]
    },
    {
        name: "CountLetter",
        to: "countletter",
        desc: I18N.get('找出字母在26字母表中的顺序'),
        icon: ABCIcon,
        color: [hex("e0c3fc"), hex("8ec5fc")]
    },
    {
        name: I18N.get('π计算器'),
        to: "pi",
        desc: I18N.get('计算π的小数点后任意位'),
        icon: () => <Image src="/image/pi.466x393.png" alt={I18N.get('圆周率图标')} height={24} width={24} />,
        color: [hex("4facfe"), hex("00f2fe")]
    },
    {
        name: I18N.get('翻转'),
        to: "reversal",
        desc: I18N.get('随机翻转字符串'),
        icon: FlipCameraAndroidIcon,
        color: [hex("fa709a"), hex("fee140")]
    },
    {
        name: I18N.get('掷色子'),
        to: "shaizi",
        desc: I18N.get('随机掷色子'),
        icon: () => <Image src="/image/shaizi.24x24.svg" alt={I18N.get('色子图标')} height={24} width={24} />,
        color: [hex("a8edea"), hex("fed6e3")]
    },
    {
        name: I18N.get('滤镜'),
        to: "filter",
        desc: I18N.get('将一张图片处理成不同的'),
        icon: FilterIcon,
        color: [hex("d299c2"), hex("fef9d7")]
    },
    {
        name: I18N.get('读数字'),
        to: "readnumber",
        desc: I18N.get('将数字转换成汉字字符串'),
        icon: NumbersIcon,
        color: [hex("89f7fe"), hex("66a6ff")]
    },
    {
        name: I18N.get('算式生成器'),
        to: "mathgen",
        desc: I18N.get('生成一些算式'),
        icon: NumbersIcon,
        color: [hex("96fbc4"), hex("f9f586")]
    },
    {
        name: I18N.get('拼图'),
        to: "jigsaw",
        desc: I18N.get('能自定义的拼图'),
        icon: ExtensionIcon,
        color: [hex("cd9cf2"), hex("f6f3ff")]
    },
    {
        name: I18N.get('立方体'),
        to: "cubic",
        desc: I18N.get('可视化的立方体'),
        icon: ViewInArIcon,
        color: [hex("37ecba"), hex("72afd3")]
    },
    {
        name: I18N.get('画圆'),
        to: "cylinder",
        desc: I18N.get('根据各种不同的选项画圆'),
        icon: AdjustIcon,
        color: [hex("fff1eb"), hex("ace0f9")]
    },
    {
        name: I18N.get('人生倒计时'),
        to: "https://github.neila.ga/countdown.js/",
        desc: I18N.get('显示时间过去了多少'),
        icon: AccessTimeIcon,
        color: [hex("c1dfc4"), hex("deecdd")],
        isGoto: true
    }
];
