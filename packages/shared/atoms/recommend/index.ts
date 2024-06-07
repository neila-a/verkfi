"use client";
import {
    atom
} from "jotai";
import {
    tool
} from "tools/info";
import {
    emptySymbol
} from "../../reader/atomWithStorage";
import getTries from "./getTries";
const valueAtom = atom<tool[] | typeof emptySymbol>(emptySymbol);
const recommendAtom = atom(get => {
    const got = get(valueAtom);
    if (typeof got === "symbol") {
        return getTries(get);
    }
    return got;
}, async (get, set) => {
    const newTries = await getTries(get);
    set(valueAtom, newTries);
});
export default recommendAtom;
