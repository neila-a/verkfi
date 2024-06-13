"use client";
import {
    atom
} from "jotai";
import {
    locales
} from "layout/layoutClient";
import isBrowser from "../isBrowser";
import atomWithStorage from "../reader/atomWithStorage";
const langAtom = atomWithStorage<keyof typeof locales | "system">("lang", "语言", "system");
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
