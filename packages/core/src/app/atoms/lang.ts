"use client";
import {
    atom
} from "jotai";
import setSetting from "setting/reader/setSetting";
import settingReader from "setting/reader/settingReader";
import {
    locales
} from "../layout/layoutClient";
import isBrowser from "layout/isBrowser";
const emptyString = "__lang__",
    valueAtom = atom<keyof typeof locales | typeof emptyString>(emptyString);
const langAtom = atom(async get => {
    let value = get(valueAtom);
    if (value === emptyString) {
        let browserLang: string = "zhCN";
        if (isBrowser()) {
            if (window.navigator.language || window.navigator.languages) {
                browserLang = ((window.navigator.languages && window.navigator.languages[0]) || window.navigator.language).split("-").join("") || "zhCN";
            }
        }
        const detailedLang = Object.keys(locales).includes(browserLang) ? browserLang : "zhCN",
            chooseOption = await settingReader("lang", detailedLang) as keyof typeof locales;
        value = chooseOption;
    }
    return value as keyof typeof locales;
}, async (get, set, update: keyof typeof locales) => {
    set(valueAtom, update);
    setSetting("lang", "语言", update);
});
export default langAtom;
