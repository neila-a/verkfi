"use client";
import db from "db";
import {
    NXTMetadata
} from "./page";
import {
    useContext
} from "react";
import {
    recentlyUsed as recentlyUsedContext,
    mostUsed as mostUsedContext,
    extensions
} from "layout/layoutClient";
export default function useClearExtensionData() {
    const extensionsTools = useContext(extensions),
        recentlyUsed = useContext(recentlyUsedContext),
        oldRecently = recentlyUsed.value,
        mostUsed = useContext(mostUsedContext),
        oldMost = {
            ...mostUsed.value
        };
    return (clearingExtension: NXTMetadata, clearingFiles: [string, Uint8Array][]) => {
        extensionsTools.set({
            ...clearingExtension,
            files: clearingFiles,
            settings: clearingExtension.settings.map(setting => ({
                ...setting,
                value: setting.defaultValue
            }))
        });
        recentlyUsed.set(oldRecently.filter(item => item !== clearingExtension.to));
        Reflect.deleteProperty(oldMost, clearingExtension.to);
        mostUsed.set(oldMost);
    };
}
