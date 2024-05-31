"use client";
import {
    atom
} from "jotai";
import setSetting from "../reader/setSetting";
import {
    locales
} from "layout/layoutClient";
import isBrowser from "../isBrowser";
import settingReader from "../reader/settingReader";
const emptyString = "__lang__",
    valueAtom = atom<keyof typeof locales | typeof emptyString | "system">(emptyString),
    langAtom = atom(async get => {
        let value = get(valueAtom);
        if (value === emptyString) {
            return await settingReader("lang", "system") as keyof typeof locales | "system";
        }
        return value;
    }, async (get, set, update: keyof typeof locales | "system") => {
        set(valueAtom, update);
        setSetting("lang", "语言", update);
    });
export const usableLangAtom = atom(async get => {
    const got = await get(langAtom);
    if (got === "system") {
        let browserLang: string = "zhCN";
        if (isBrowser()) {
            if (window.navigator.language || window.navigator.languages) {
                browserLang = ((window.navigator.languages && window.navigator.languages[0]) || window.navigator.language).split("-").join("") || "zhCN";
            }
        }
        const detailedLang = Object.keys(locales).includes(browserLang) ? browserLang : "zhCN";
        return detailedLang as keyof typeof locales;
    }
    return got;
});
export default langAtom;
