import db, {
    single
} from "../reader/db";
import {
    atom
} from "jotai";
import isBrowser from "../isBrowser";
export interface extensionsDispatch extends single {
    action?: "delete"
}
const emptyString = "__empty__",
    valueAtom = atom<typeof emptyString | single[]>(emptyString);
const extensionsAtom = atom(async get => {
    const got = get(valueAtom);
    if (got === emptyString) {
        if (isBrowser()) {
            const value = await db.extensionTools.toArray();
            return value;
        }
        return [];
    }
    return got as single[];
}, async (get, set, update: extensionsDispatch) => {
    const realOld = get(valueAtom),
        old = realOld === "__empty__" ? await db.extensionTools.toArray() : realOld;
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
