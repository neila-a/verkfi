import db, {
    single
} from "db";
import {
    atom
} from "jotai";
export interface extensionsDispatch extends single {
    action?: "delete"
}
const valueAtom = atom<single[]>([]);
valueAtom.onMount = setValue => {
    (async () => {
        const value = await db.extensionTools.toArray();
        setValue(value);
    })();
};
const extensionsAtom = atom(get => get(valueAtom), (get, set, update: extensionsDispatch) => {
    const old = get(valueAtom);
    if (update?.action === "delete") {
        db.extensionTools.delete(update.to);
        set(valueAtom, old.filter(a => a.to !== update.to))
    } else {
        db.extensionTools.put(update);
        const realOld = old.slice(0),
            index = old.findIndex(a => a.to === update.to);
        if (index === -1) {
            realOld.push(update);
            set(valueAtom, realOld);
        } else {
            set(valueAtom, realOld.map(a => {
                if (a.to === update.to) return update;
                return a;
            }));
        }
    }
});
export default extensionsAtom;