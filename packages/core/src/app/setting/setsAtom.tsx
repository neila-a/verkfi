"use client";
import {
    Extension as ExtensionIcon,
    Info as InfoIcon,
    Palette as PaletteIcon,
    Settings as SettingsIcon
} from "@mui/icons-material";
import {
    usableLangAtom
} from "@verkfi/shared/atoms/lang";
import {
    atom
} from "jotai";
import {
    // @ts-ignore 导入被吃了
    ReactIntlUniversal
} from "react-intl-universal";
import {
    set
} from "./layout";
import {
    locales
} from "layout/layoutClient";
const setsAtom = atom(async getAtom => {
    const instance = new ReactIntlUniversal() as typeof import("react-intl-universal"),
        lang = await getAtom(usableLangAtom);
    instance.init({
        currentLocale: lang,
        locales
    });
    const get = instance.get.bind(instance);
    return [
        {
            name: get("选项"),
            id: "option",
            Icon: SettingsIcon
        },
        {
            name: get("关于"),
            id: "about",
            Icon: InfoIcon
        },
        {
            name: get("extensions.扩展"),
            id: "extensions",
            Icon: ExtensionIcon
        },
        {
            name: get("外观"),
            id: "appearance",
            Icon: PaletteIcon
        }
    ] as set[];
});
export default setsAtom;
