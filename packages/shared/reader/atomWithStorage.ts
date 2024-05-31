import {
    atom
} from "jotai";
import setSetting from "./setSetting";
import settingReader from "./settingReader";
const emptyString = "__atomDefault__";
export default function atomWithStorage<setting = any>(id: string, name: string, empty: setting) {
    const valueAtom = atom<setting | typeof emptyString>(emptyString);
    return atom(async get => {
        const got = get(valueAtom);
        if (got === emptyString) {
            const value = await settingReader(id, empty);
            return value;
        }
        return got;
    }, (get, set, update: setting) => {
        set(valueAtom, update);
        setSetting(id, name, update);
    });
}
