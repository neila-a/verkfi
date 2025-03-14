import isBrowser from "../isBrowser";
import {
    emptySymbol
} from "../reader/atomWithStorage";
import atomWithInitialValue, {
    valueAtomReturn
} from "../reader/atomWithInitialValue";
import {
    NXTMetadata as baseNXT
} from "@verkfi/core-ui/src/setting/extensions/page";
import getMetadatas from "./getMetadatas";
import atomWithBroadcast from "../reader/atomWithBroadcast";
import {
    SvgIcon
} from "@mui/material";
import {
    WritableAtom,
    atom
} from "jotai";
import {
    noIconTool,
    tool
} from "@verkfi/core-ui/src/tools/info";
import atomWithEmpty from "../reader/atomWithEmpty";
export interface extensionsDispatch extends NXTMetadata {
    action?: "delete"
}
interface NXTMetadata extends baseNXT, noIconTool {
}
export const [extensionsAtom, extensionsAtomValue] = atomWithInitialValue(
    (valueAtom: valueAtomReturn<NXTMetadata[]>) => {
        const withedEmpty = atomWithEmpty(
            async get => {
                if (isBrowser()) {
                    try {
                        const metadatas = await getMetadatas();
                        return metadatas;
                    } catch {
                    }
                }
                return [];
            },
            async (get, set, update: extensionsDispatch[] | extensionsDispatch) => {
                if (update instanceof Array) {
                    return set(valueAtom, update);
                }

                const realOld = get(valueAtom),
                    old = realOld === emptySymbol ? await getMetadatas() : realOld,
                    allHandle = await navigator.storage.getDirectory();
                if (update?.action === "delete") {
                    // 实际更新
                    await allHandle.removeEntry(update.to, {
                        recursive: true
                    });

                    // atom更新
                    set(valueAtom, old.filter(a => a.to !== update.to));
                } else {
                    // 实际更新
                    const thisHandle = await allHandle.getDirectoryHandle(update.to),
                        packageHandle = await thisHandle.getFileHandle("package.json"),
                        writable = await packageHandle.createWritable();
                    await writable.seek(0);
                    writable.write(JSON.stringify(update));
                    await writable.close();

                    // atom更新
                    const map = new Map(old.map(one => [one.to, one]));
                    map.set(update.to, update);
                    set(valueAtom, map.values().toArray());
                }
            },
            valueAtom
        ) as unknown as WritableAtom<NXTMetadata[] | Promise<NXTMetadata[]>, [update: extensionsDispatch], Promise<void>>;
        return atomWithBroadcast(
            get => get(withedEmpty),
            (get, set, update: extensionsDispatch) => set(withedEmpty, update),
            "extensions"
        );
    }
);
export const convertedExtensionsAtom = atom(async get => {
    const extensions = await get(extensionsAtom);
    return extensions.map(single => {
        // 这里的图片是直接从indexedDB加载来的，不需要且不能使用next/image的优化
        // eslint-disable-next-line @next/next/no-img-element
        const element = () => <img src={`https://${single.to}.verkfi/${single.icon}`} alt={single.name} height={24} width={24} />;
        element.muiName = single.to;
        return {
            name: single.name,
            to: `/tools/extension?tool=${single.to}` as Lowercase<string>,
            desc: single.desc,
            icon: element as typeof SvgIcon,
            color: single.color,
            isGoto: true
        } as tool;
    });
});
export default extensionsAtom;

