import {
    atom
} from "jotai";
import setSetting from "./setSetting";
import settingReader from "./settingReader";
export default function atomWithStorage<setting = any>(id: string, name: string, empty: setting) {
    const valueAtom = atom(empty);
    valueAtom.onMount = setValue => {
        (async () => {
            const value = await settingReader(id, empty);
            setValue(value);
        })();
    };
    return atom(get => get(valueAtom), (get, set, update: setting) => {
        set(valueAtom, update);
        setSetting(id, name, update);
    });
}