import atomWithBroadcast from "./atomWithBroadcast";
import atomWithInitialValue, {
    valueAtomReturn
} from "./atomWithInitialValue";
import setSetting from "./setSetting";
import settingReader from "./settingReader";
import simpleGetterWithEmpty from "./simpleGetterWithEmpty";
export const emptySymbol: unique symbol = Symbol("This atom is empty, it's waiting a value.");
const atomWithStorage = <setting = any>(id: string, name: string, empty: setting) => atomWithInitialValue((valueAtom: valueAtomReturn<setting>) => atomWithBroadcast(simpleGetterWithEmpty(valueAtom, get => settingReader(id, empty)), (get, set, update: setting) => {
    set(valueAtom, update);
    setSetting(id, name, update);
}, `storagedAtom-${id}`))[0];
export default atomWithStorage;
