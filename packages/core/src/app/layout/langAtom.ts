"use client";
import {
    atom
} from 'jotai';
import setSetting from "setting/reader/setSetting";
import settingReader from 'setting/reader/settingReader';
import {
    isBrowser,
    locales
} from "./layoutClient";
const valueAtom = atom("zhCN");
valueAtom.onMount = setValue => {
    (async () => {
        let browserLang: string = "zhCN";
        if (isBrowser()) {
            if (window.navigator.language || window.navigator.languages) {
                browserLang = ((window.navigator.languages && window.navigator.languages[0]) || window.navigator.language).split("-").join("") || "zhCN";
            }
        }
        const detailedLang = Object.keys(locales).includes(browserLang) ? browserLang : "zhCN",
            chooseOption = await settingReader("lang", detailedLang);
        setValue(chooseOption || "zhCN");
    })();
};
const langAtom = atom(get => get(valueAtom), (get, set, update: string) => {
    set(valueAtom, update);
    setSetting("lang", "语言", update);
});
export default langAtom;