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
import simpleGetterWithEmpty from "../../reader/simpleGetterWithEmpty";
const [recommendAtom] = atomWithInitialValue((valueAtom: valueAtomReturn<tool[]>) => atom(simpleGetterWithEmpty(valueAtom, get => getTries(get)), async (get, set) => {
    const newTries = await getTries(get);
    set(valueAtom, newTries);
}));
export default recommendAtom;
