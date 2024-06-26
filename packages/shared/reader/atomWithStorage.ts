import atomWithBroadcast from "./atomWithBroadcast";
import atomWithInitialValue from "./atomWithInitialValue";
import db from "./db";
import atomWithEmpty from "./atomWithEmpty";
export const emptySymbol: unique symbol = Symbol("This atom is empty, it's waiting a value.");
const atomWithStorage = <setting = any>(id: string, empty: setting) => atomWithInitialValue(
    valueAtom => {
        const withedEmpty = atomWithEmpty<setting | Promise<setting>, setting, void>(
            get => db.readSetting(id, empty),
            (get, set, update: setting) => {
                set(valueAtom, update);
                db.setSetting(id, update);
            },
            valueAtom
        );
        return atomWithBroadcast(
            get => get(withedEmpty),
            (get, set, update: setting) => set(withedEmpty, update),
            `storagedAtom-${id}`
        );
    }
)[0];
export default atomWithStorage;
