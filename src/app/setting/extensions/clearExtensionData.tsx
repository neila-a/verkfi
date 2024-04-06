"use client";
import db from "db";
import {
    mostUsedMarks
} from "layout/layoutClient";
import {
    setState
} from "declare";
import {
    NXTMetadata
} from "./page";
export default async function clearExtensionData(clearingExtension: NXTMetadata, clearingFiles: [string, Uint8Array][], recentlyUsed: {
    value: string[];
    set: setState<string[]>;
}, mostUsed: {
    value: mostUsedMarks;
    set: setState<mostUsedMarks>;
}) {
    await db.extensionTools.put({
        ...clearingExtension,
        files: clearingFiles,
        settings: clearingExtension.settings.map(setting => ({
            ...setting,
            value: setting.defaultValue
        }))
    });
    const oldRecently = recentlyUsed.value;
    recentlyUsed.set(oldRecently.filter(item => item !== clearingExtension.to));
    const oldMost = {
        ...mostUsed.value
    };
    Reflect.deleteProperty(oldMost, clearingExtension.to);
    mostUsed.set(oldMost);
}
