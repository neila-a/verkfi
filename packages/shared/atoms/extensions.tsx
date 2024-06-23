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
import atomWithBroadcast from "../reader/atomWithBroadcast";
import awaiter from "../reader/awaiter";
import {
    SvgIcon
} from "@mui/material";
import {
    atom
} from "jotai";
import {
    tool
} from "tools/info";
export interface extensionsDispatch extends NXTMetadata {
    action?: "delete"
}
export const [extensionsAtom, extensionsAtomValue] = atomWithInitialValue(
    (valueAtom: valueAtomReturn<NXTMetadata[]>) => atomWithBroadcast(simpleGetterWithEmpty(valueAtom, async get => {
        if (isBrowser()) {
            try {
                const metadatas = await getMetadatas();
                return metadatas;
            } catch (error) {
                console.error(error);
            }
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
            await writable.close();

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
    }, "extensions")
);
export const convertedExtensionsAtom = atom(get => awaiter(get(extensionsAtom), extensionTools => extensionTools.map(single => ({
    name: single.name,
    to: `/tools/extension?tool=${single.to}` as Lowercase<string>,
    desc: single.desc,
    /**
     * 这里的图片是直接从indexedDB加载来的，不需要且不能使用next/image的优化
     */
    icon: (() => <img src={`/extensionfiles/${single.to}/${single.icon}`} alt={single.name} height={24} width={24} />) as unknown as typeof SvgIcon,
    color: single.color,
    isGoto: true
} as tool))));
export default extensionsAtom;

