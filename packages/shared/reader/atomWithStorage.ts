import atomWithBroadcast from "./atomWithBroadcast";
import atomWithInitialValue, {
    valueAtomReturn
} from "./atomWithInitialValue";
import setSetting from "./setSetting";
import settingReader from "./settingReader";
export const emptySymbol: unique symbol = Symbol("This atom is empty, it's waiting a value.");
const atomWithStorage = <setting = any>(id: string, name: string, empty: setting) => atomWithInitialValue((valueAtom: valueAtomReturn<setting>) => atomWithBroadcast(get => {
    const got = get(valueAtom);
    if (got === emptySymbol) {
        const value = settingReader(id, empty);
        return value;
    }
    return got;
}, (get, set, update: setting) => {
    set(valueAtom, update);
    setSetting(id, name, update);
}, `storagedAtom-${id}`))[0];
export default atomWithStorage;
