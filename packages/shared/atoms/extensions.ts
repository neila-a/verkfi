import {
    atom
} from "jotai";
import isBrowser from "../isBrowser";
import {
    emptySymbol
} from "../reader/atomWithStorage";
import atomWithInitialValue, {
    valueAtomReturn
} from "../reader/atomWithInitialValue";
import simpleGetterWithEmpty from "../reader/simpleGetterWithEmpty";
import {
    NXTMetadata
} from "setting/extensions/page";
import getMetadatas from "./getMetadatas";
export interface extensionsDispatch extends NXTMetadata {
    action?: "delete"
}
const [extensionsAtom, extensionsAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<NXTMetadata[]>) => atom(simpleGetterWithEmpty(valueAtom, async get => {
    if (isBrowser()) {
        return await getMetadatas();
    }
    return [];
}), async (get, set, update: extensionsDispatch) => {
    const realOld = get(valueAtom),
        old = realOld === emptySymbol ? await getMetadatas() : realOld;
    if (update?.action === "delete") {
        // 实际更新
        const allHandle = await navigator.storage.getDirectory();
        await allHandle.removeEntry(update.to, {
            recursive: true
        });

        // atom更新
        set(valueAtom, old.filter(a => a.to !== update.to));
    } else {
        // 实际更新
        const allHandle = await navigator.storage.getDirectory(),
            thisHandle = await allHandle.getDirectoryHandle(update.to),
            packageHandle = await thisHandle.getFileHandle("package.json"),
            writable = await packageHandle.createWritable();
        await writable.seek(0);
        writable.write(JSON.stringify(update));

        // atom更新
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
}));
export {
    extensionsAtomValue
};
export default extensionsAtom;
