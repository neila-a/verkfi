import {
    atom
} from "jotai";
import setSetting from "./setSetting";
import settingReader from "./settingReader";
export const emptySymbol: unique symbol = Symbol("This atom is empty, it's waiting a value.");
export default function atomWithStorage<setting = any>(id: string, name: string, empty: setting) {
    const valueAtom = atom<setting | typeof emptySymbol>(emptySymbol),
        packagedAtom = atom(get => {
            const got = get(valueAtom);
            if (typeof got === "symbol") {
                const value = settingReader(id, empty);
                return value;
            }
            return got;
        }, (get, set, update: setting | {
            __atom_update_type__: "message",
            update: setting;
        }) => {
            let message = false;
            if (typeof update === "object") {
                if ("__atom_update_type__" in update) {
                    if (update.__atom_update_type__ === "message") {
                        set(valueAtom, update.update);
                        message = true;
                    }
                }
            }
            if (!message) {
                set(valueAtom, update as setting);
                setSetting(id, name, update);
                const channel = new BroadcastChannel(`atomWithStorage-${id}`);
                channel.postMessage(update);
            }
        });
    packagedAtom.debugLabel = id;
    packagedAtom.onMount = setAtom => {
        const channel = new BroadcastChannel(`atomWithStorage-${id}`);
        channel.addEventListener("message", event => {
            setAtom({
                __atom_update_type__: "message",
                update: event.data
            });
        });
    };
    return packagedAtom;
}
