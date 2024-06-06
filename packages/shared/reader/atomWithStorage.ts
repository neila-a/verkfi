import {
    atom
} from "jotai";
import setSetting from "./setSetting";
import settingReader from "./settingReader";
export const emptySymbol: unique symbol = Symbol("This atom is empty, it's waiting a value.");
export default function atomWithStorage<setting = any>(id: string, name: string, empty: setting) {
    const valueAtom = atom<setting | typeof emptySymbol>(emptySymbol);
    return atom(get => {
        const got = get(valueAtom);
        if (typeof got === "symbol") {
            const value = settingReader(id, empty);
            return value;
        }
        return got;
    }, (get, set, update: setting) => {
        set(valueAtom, update);
        setSetting(id, name, update);
    });
}
