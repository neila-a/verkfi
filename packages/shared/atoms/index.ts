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
interface mostUsedMarks {
    [key: string]: number;
}
const viewModeAtomValue = atomWithStorage<viewMode>("viewmode", "列表模式", "list");
export type sidebarMode = "menu" | "sidebar";
export const sidebarModeAtom = atomWithStorage<sidebarMode>("sidebarmode", "边栏模式", "menu"),
    showSidebarAtom = atomWithStorage<boolean>("sidebar", "边栏", false),
    showClientsAtom = atomWithStorage<boolean>("clients", "切换页面", false),
    forkMeOnGitHubAtom = atomWithStorage<boolean>("fork-me-on-github", "Fork me on GitHub", false),
    shareAtom = atomWithStorage<boolean>("share", "分享", isBrowser() ? "share" in navigator : false),
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
    gradientToolAtom = atomWithStorage<boolean>("gradient-tool", "工具渐变", false),
    recentlyUsedAtom = atomWithStorage<string[]>("recently-tools", "最近使用的工具", []),
    mostUsedAtom = atomWithStorage<mostUsedMarks>("most-tools", "最常使用的工具", {
    }),
    listsAtom = atomWithStorage<lists>("lists", "分类列表", []);
