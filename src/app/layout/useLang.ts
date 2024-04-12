"use client";
import intl from 'react-intl-universal';
import {
    use,
    useReducer
} from 'react';
import setSetting from "setting/setSetting";
import {
    isBrowser,
    locales
} from "./layoutClient";
import {
    settingReader
} from 'setting/settingReader';
const useLang = () => {
    var browserLang: string = "zhCN";
    if (isBrowser()) {
        if (window.navigator.language || window.navigator.languages) {
            browserLang = ((window.navigator.languages && window.navigator.languages[0]) || window.navigator.language).split("-").join("") || "zhCN";
        }
    }
    const detailedLang = Object.keys(locales).includes(browserLang) ? browserLang : "zhCN",
        gotSetting = use(settingReader("lang", detailedLang)),
        chooseOption = gotSetting.value,
        real = chooseOption || "zhCN";
    return useReducer((old: string, val: string) => {
        intl.init({
            currentLocale: val,
            locales
        });
        setSetting("lang", "语言", val);
        return val;
    }, real);
};
export default useLang;