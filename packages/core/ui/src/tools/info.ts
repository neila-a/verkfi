import {
    Abc as ABCIcon,
    AccessTime as AccessTimeIcon,
    AccountBalance as AccountBalanceIcon,
    Adjust as AdjustIcon,
    Audiotrack as AudiotrackIcon,
    Calculate as CalculateIcon,
    Casino,
    Extension as ExtensionIcon,
    Filter as FilterIcon,
    FlipCameraAndroid as FlipCameraAndroidIcon,
    Functions,
    KeyboardVoice as KeyboardVoiceIcon,
    Numbers as NumbersIcon,
    Percent,
    ViewInAr as ViewInArIcon
} from "@mui/icons-material";
import {
    type SvgIcon
} from "@mui/material";
import {
    hex
} from "declare";
import {
    // @ts-ignore 导入被吃了
    ReactIntlUniversal,
    type get
} from "react-intl-universal";
import Hex = hex.Hex;
import {
    atom
} from "jotai";
import {
    locales
} from "layout/layoutClient";
import {
    usableLangAtom
} from "@verkfi/shared/atoms/lang";
export interface noIconTool {

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
     * Background of your tool.
     * It will display in HeadBar when user set "color" to true.
     * It should be uppercase.
     * @example ["000000", "FFFFFF"]
     */
    color: [Hex, Hex];

    /**
     * If your tool is in the outside, set this.
     * If enabled, when user click your tool, they will redirect to the address in "to".
     * @example true
     */
    isGoto?: boolean;

}
/**
 * Metadata for your tool.
 */
export interface tool extends noIconTool {

    /**
     * URL for icon of your tool.
     * @example https://foo.com/bar.png
     */
    icon: typeof SvgIcon; // MaterialUI 官方做法

}
type get = typeof get;
const toolsInfoAtom = atom(async getAtom => {
    const lang = getAtom(usableLangAtom),
        instance = new ReactIntlUniversal() as typeof import("react-intl-universal");
    instance.init({
        currentLocale: lang,
        locales
    });
    const get = instance.get.bind(instance) as get,
        importedInfos = Object.fromEntries(await Promise.all(Object
            .entries(import.meta.glob("../../../../tools/tool-*/info.ts"))
            .map(async ([key, valuer]) => [
                /\.\.\/\.\.\/\.\.\/\.\.\/tools\/tool\-(?<to>.*)\/info\.ts/.exec(key).groups.to,
                (await valuer() as {
                    default: tool
                }).default
            ] as [string, tool]))),
        getOrDefault = (...args: Parameters<get>) => {
            const got = get(...args);
            return got === "" ? args[0] : got;
        },
        infos = Object.entries({
            ...importedInfos,
            "https://github.neila.vip/countdown.js/": {
                name: "人生倒计时",
                desc: "显示时间过去了多少",
                icon: AccessTimeIcon,
                color: [hex("c1dfc4"), hex("deecdd")],
                isGoto: true
            } as tool
        }).map(([to, info]) => {
            const proceedInfo = info as tool;
            proceedInfo.to = to as Lowercase<string>;
            ["name", "desc"].forEach(field => {
                proceedInfo[field] = getOrDefault(info[field]);
            });
            return proceedInfo;
        });
    console.log(infos);
    return infos;
});
export default toolsInfoAtom;
