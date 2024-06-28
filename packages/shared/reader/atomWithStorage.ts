import atomWithBroadcast from "./atomWithBroadcast";
import atomWithInitialValue from "./atomWithInitialValue";
import db from "./db";
import atomWithEmpty from "./atomWithEmpty";
import isBrowser from "../isBrowser";
export const emptySymbol: unique symbol = Symbol("This atom is empty, it's waiting a value.");
const atomWithStorage = <setting = any>(id: string, empty: setting) => atomWithInitialValue(
    valueAtom => {
        const withedEmpty = atomWithEmpty<setting | Promise<setting>, setting, Promise<void>>(
            get => isBrowser() ? db.readSetting(id, empty) : empty,
            async (get, set, update: setting) => {
                set(valueAtom, update);
                if (isBrowser) {
                    return await db.setSetting(id, update);
                }
            },
            valueAtom
        );
        return atomWithBroadcast(
            get => get(withedEmpty),
            (get, set, update: setting) => set(withedEmpty, update as Exclude<setting, typeof emptySymbol>),
            `storagedAtom-${id}`
        );
    }
)[0];
export default atomWithStorage;
