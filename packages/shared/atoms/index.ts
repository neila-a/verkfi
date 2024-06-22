"use client";
import {
    viewMode
} from "index/consts";
import {
    lists
} from "index/sidebar";
import atomWithStorage from "../reader/atomWithStorage";
import isBrowser from "../isBrowser";
import {
    atom
} from "jotai";
import convertExtensionTools from "index/convertExtensionTools";
import extensionsAtom from "./extensions";
import toolsInfoAtom, {
    tool
} from "tools/info";
import {
    NXTMetadata,
    setting
} from "setting/extensions/page";
interface mostUsedMarks {
    [key: string]: number;
}
const viewModeAtomValue = atomWithStorage<viewMode>("viewmode", "list");
export type sidebarMode = "menu" | "sidebar";
export const sidebarModeAtom = atomWithStorage<sidebarMode>("sidebarmode", "menu"),
    showSidebarAtom = atomWithStorage<boolean>("sidebar", false),
    showClientsAtom = atomWithStorage<boolean>("clients", false),
    forkMeOnGitHubAtom = atomWithStorage<boolean>("fork-me-on-github", false),
    shareAtom = atomWithStorage<boolean>("share", isBrowser() ? "share" in navigator : false),
    viewModeAtom = atom(get => get(viewModeAtomValue), (get, set, update: viewMode | "swap") => {
        if (update === "swap") {
            const gotValue = get(viewModeAtomValue);
            if (typeof gotValue === "string") {
                return set(viewModeAtomValue, gotValue === "grid" ? "list" : "grid");
            }
            return gotValue.then(got => set(viewModeAtomValue, got === "grid" ? "list" : "grid"));
        }
        set(viewModeAtomValue, update);
    }),
    gradientToolAtom = atomWithStorage<boolean>("gradient-tool", false),
    recentlyUsedAtom = atomWithStorage<string[]>("recently-tools", []),
    recentlyToolsAtom = atom(async get => Promise.all((await get(recentlyUsedAtom)).map(
        /**
         * 确实可以避免某些情况下的 `Promise`，但是太复杂会降低可读性
        */
        async to => {
            const extensionTools = await get(extensionsAtom),
                converted = convertExtensionTools(extensionTools);
            return 0
                || await get(toolsInfoAtom).then(toolsInfo => toolsInfo.find(single => single.to === to))
                || converted.find(single => `/tools/extension?tool=${to}` === single.to);
        }
    )).then(toFilter => toFilter.filter((item: tool | 0) => item !== 0) satisfies unknown satisfies tool[])),
    mostUsedAtom = atomWithStorage<mostUsedMarks>("most-tools", {
    }),
    mostUsedToolsAtom = atom(async get => {
        const realTools = await get(toolsInfoAtom),
            extensionTools = await get(extensionsAtom);
        return (Object.entries(await get(mostUsedAtom)) satisfies [string, number][]).sort((r, g) => {
            if (r[1] < g[1]) {
                return 1;
            } if (r[1] > g[1]) {
                return -1;
            }
            return 0;
        }).slice(0, 3).map(item => {
            const to = item[0];
            return 0
                || realTools.find(single => single.to === to)
                || convertExtensionTools(extensionTools).find(single => `/tools/extension?tool=${to}` === single.to) as tool | 0;
        }).filter(item => item !== 0 && item !== undefined) as unknown as tool[];
    }),
    listsAtom = atomWithStorage<lists>("lists", []),
    buttonCommonSorterAtom = atom(null, async (get, set, sortingFor: string, pd: tool[]) => {
        const realList = await get(listsAtom),
            index = realList.findIndex(item => item[0] === sortingFor),
            newRealList: lists = realList.slice(0);
        if (index === -1) {
            newRealList.push(["__global__", pd.map(toolp => toolp.to)]);
        } else {
            newRealList[index][1] = pd.map(toolp => toolp.to);
        }
        set(listsAtom, newRealList);
        return newRealList;
    }),
    extensionDataCleanerAtom = atom(null, async (get, set, clearingExtension: NXTMetadata) => {
        const oldRecently = await get(recentlyUsedAtom),
            oldMost = {
                ...await get(mostUsedAtom)
            };
        set(extensionsAtom, {
            ...clearingExtension,
            settings: clearingExtension.settings.map(setting => ({
                ...setting,
                value: setting.defaultValue
            }) as setting)
        });
        set(recentlyUsedAtom, oldRecently.filter(item => item !== clearingExtension.to));
        Reflect.deleteProperty(oldMost, clearingExtension.to);
        set(mostUsedAtom, oldMost);
    });
