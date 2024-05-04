"use client";
import {
    useAtom
} from "jotai";
import extensionsAtom from "atoms/extensions";
import {
    mostUsed as mostUsedAtom,
    recentlyUsed as recentlyUsedAtom
} from "atoms";
import {
    NXTMetadata,
    setting
} from "./page";
import {
    single
} from "db";
export default function useClearExtensionData() {
    const [extensionsTools, setExtensions] = useAtom(extensionsAtom),
        [oldRecently, setRecently] = useAtom(recentlyUsedAtom),
        [mostUsed, setMostUsed] = useAtom(mostUsedAtom),
        oldMost = {
            ...mostUsed
        };
    return (clearingExtension: NXTMetadata, clearingFiles: single["files"]) => {
        setExtensions({
            ...clearingExtension,
            files: clearingFiles,
            settings: clearingExtension.settings.map(setting => ({
                ...setting,
                value: setting.defaultValue
            }) as setting)
        });
        setRecently(oldRecently.filter(item => item !== clearingExtension.to));
        Reflect.deleteProperty(oldMost, clearingExtension.to);
        setMostUsed(oldMost);
    };
}
