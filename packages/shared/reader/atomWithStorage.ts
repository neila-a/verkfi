import atomWithBroadcast from "./atomWithBroadcast";
import atomWithInitialValue, {
    valueAtomReturn
} from "./atomWithInitialValue";
import db from "./db";
import simpleGetterWithEmpty from "./simpleGetterWithEmpty";
export const emptySymbol: unique symbol = Symbol("This atom is empty, it's waiting a value.");
const atomWithStorage = <setting = any>(id: string, empty: setting) => atomWithInitialValue((valueAtom: valueAtomReturn<setting>) => atomWithBroadcast(simpleGetterWithEmpty(valueAtom, get => db.readSetting(id, empty)), (get, set, update: setting) => {
    set(valueAtom, update);
    db.setSetting(id, update);
}, `storagedAtom-${id}`))[0];
export default atomWithStorage;
