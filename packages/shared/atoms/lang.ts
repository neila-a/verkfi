import {
    atom
} from "jotai";
import {
    locales
} from "layout/layoutClient";
import isBrowser from "../isBrowser";
import atomWithStorage from "../reader/atomWithStorage";
import awaiter from "../reader/awaiter";
const langAtom = atomWithStorage<keyof typeof locales | "system">("lang", "system");
export const usableLangAtom = atom(get => awaiter(get(langAtom), got => {
    if (got === "system") {
        let browserLang: string = "zhCN";
        if (isBrowser()) {
            if (window.navigator.language || window.navigator.languages) {
                browserLang = (window.navigator.languages && window.navigator.languages[0] || window.navigator.language).split("-").join("") || "zhCN";
            }
        }
        const detailedLang = Object.keys(locales).includes(browserLang) ? browserLang : "zhCN";
        return detailedLang as keyof typeof locales;
    }
    return got;
}));
export default langAtom;
