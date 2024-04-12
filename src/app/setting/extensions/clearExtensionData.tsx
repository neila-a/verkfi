"use client";
import db from "db";
import {
    mostUsed,
    recentlyUsed
} from "layout/layoutClient";
import {
    NXTMetadata
} from "./page";
import {
    Context
} from "react";
type recentlyUsed = typeof recentlyUsed extends Context<infer P> ? P : never;
type mostUsed = typeof mostUsed extends Context<infer P> ? P : never;
export default async function clearExtensionData(clearingExtension: NXTMetadata, clearingFiles: [
    string,
    Uint8Array
][], recentlyUsed: recentlyUsed, mostUsed: mostUsed) {
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
