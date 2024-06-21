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
    mostUsedAtom = atomWithStorage<mostUsedMarks>("most-tools", {
    }),
    listsAtom = atomWithStorage<lists>("lists", []);
