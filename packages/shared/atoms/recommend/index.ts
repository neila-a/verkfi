"use client";
import {
    atom
} from "jotai";
import {
    tool
} from "tools/info";
import getTries from "./getTries";
import atomWithInitialValue, {
    valueAtomReturn
} from "../../reader/atomWithInitialValue";
const [recommendAtom] = atomWithInitialValue((valueAtom: valueAtomReturn<tool[]>) => atom(get => {
    const got = get(valueAtom);
    if (typeof got === "symbol") {
        return getTries(get);
    }
    return got;
}, async (get, set) => {
    const newTries = await getTries(get);
    set(valueAtom, newTries);
}));
export default recommendAtom;
