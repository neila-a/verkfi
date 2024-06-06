import db, {
    single
} from "../reader/db";
import {
    atom
} from "jotai";
import isBrowser from "../isBrowser";
import {
    emptySymbol
} from "../reader/atomWithStorage";
export interface extensionsDispatch extends single {
    action?: "delete"
}
const valueAtom = atom<typeof emptySymbol | single[]>(emptySymbol);
const extensionsAtom = atom(get => {
    const got = get(valueAtom);
    if (got === emptySymbol) {
        if (isBrowser()) {
            return db.extensionTools.toArray();
        }
        return [];
    }
    return got as single[];
}, async (get, set, update: extensionsDispatch) => {
    const realOld = get(valueAtom),
        old = realOld === emptySymbol ? await db.extensionTools.toArray() : realOld;
    if (update?.action === "delete") {
        db.extensionTools.delete(update.to);
        set(valueAtom, old.filter(a => a.to !== update.to));
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
