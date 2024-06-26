import {
    atom
} from "jotai";
import {
    locales
} from "layout/layoutClient";
import isBrowser from "../isBrowser";
import atomWithStorage from "../reader/atomWithStorage";
import awaiter from "../reader/awaiter";
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
        const detailedLang = Object.keys(locales).includes(browserLang) ? browserLang : "zhCN"
        setLang(detailedLang)
        return detailedLang;
    }
    setLang(lang);
    return lang;
}
export const usableLangAtom = atom(get => awaiter(
    get(langAtom), got => usabler(got)
));
export const langIniterAtom = atom(get => awaiter(
    get(usableLangAtom), lang => init({
        currentLocale: lang,
        locales
    })
));
export default langAtom;
