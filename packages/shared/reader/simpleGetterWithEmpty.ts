import {
    Atom,
    Getter
} from "jotai";
import {
    emptySymbol
} from "./atomWithStorage";
const simpleGetterWithEmpty = <atom, empty>(atom: Atom<atom>, empty: (get: Getter) => empty) => (get: Getter) => {
    const got = get(atom);
    if (got === emptySymbol) {
        return empty(get);
    }
    return got as Exclude<atom, typeof emptySymbol>;
};
export default simpleGetterWithEmpty;
