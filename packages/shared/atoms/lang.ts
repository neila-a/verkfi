import {
    atom
} from "jotai";
import {
    locales
} from "@verkfi/core-ui/src/layout/layoutClient";
import isBrowser from "../isBrowser";
import {
    atomWithStorage
} from "jotai/utils";
import {
    init
} from "react-intl-universal";
type pureLang = keyof typeof locales;
type lang = pureLang | "system";
const langAtom = atomWithStorage<lang>("lang", "system");
function setLang(lang: pureLang) {
    if (isBrowser()) {
        document.documentElement.lang = lang.split("").map((n, i) => i === 1 ? `${n}-` : n).join("");
    }
}
function usabler(lang: lang) {
    if (lang === "system") {
        let browserLang: pureLang = "zhCN";
        if (isBrowser()) {
            if (window.navigator.language || window.navigator.languages) {
                browserLang = ((window.navigator.languages && window.navigator.languages[0]
                    || window.navigator.language).split("-").join("")
                    || "zhCN") as pureLang;
            }
        }
        const detailedLang = Object.keys(locales).includes(browserLang) ? browserLang : "zhCN";
        setLang(detailedLang);
        return detailedLang;
    }
    setLang(lang);
    return lang;
}
export const usableLangAtom = atom(get => usabler(get(langAtom)));

// use void keyword because init function will return a promise and we don't need to wait for it
export const langIniterAtom = atom(get => void init({
        currentLocale: get(usableLangAtom),
        locales
    }));
export default langAtom;
