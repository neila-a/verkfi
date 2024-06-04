"use client";
import {
    PaletteMode
} from "@mui/material";
import {
    viewMode as viewModeType
} from "index/consts";
import {
    lists as listsType
} from "index/sidebar";
import {
    atom
} from "jotai";
import defaultPalette from "setting/appearance/defaultPalette";
import atomWithStorage from "../reader/atomWithStorage";
import isBrowser from "../isBrowser";
interface mostUsedMarks {
    [key: string]: number;
}
export type sidebarMode = "menu" | "sidebar";
export const sidebarMode = atomWithStorage<sidebarMode>("sidebarmode", "边栏模式", "menu"),
    showSidebar = atomWithStorage<boolean>("sidebar", "边栏", false),
    showClients = atomWithStorage<boolean>("clients", "切换页面", false),
    forkMeOnGitHub = atomWithStorage<boolean>("fork-me-on-github", "Fork me on GitHub", false),
    share = atomWithStorage<boolean>("share", "分享", isBrowser() ? "share" in navigator : false),
    paletteColors = atomWithStorage<typeof defaultPalette>("palette", "调色板", defaultPalette),
    viewMode = atomWithStorage<viewModeType>("viewmode", "列表模式", "list"),
    darkMode = atomWithStorage<PaletteMode | "system">("darkmode", "暗色模式", "system"),
    booleanifyDarkMode = atom(async get => {
        const [gotAtom] = await get(darkMode);
        let value = true;
        switch (gotAtom) {
            case "dark":
                value = false;
                break;
            case "system":
                if (isBrowser()) {
                    value = !(window.matchMedia("(prefers-color-scheme: dark)").matches);
                }
                break;
        }
        return value;
    }),
    gradientTool = atomWithStorage<boolean>("gradient-tool", "工具渐变", false),
    recentlyUsed = atomWithStorage<string[]>("recently-tools", "最近使用的工具", []),
    mostUsed = atomWithStorage<mostUsedMarks>("most-tools", "最常使用的工具", {
    }),
    lists = atomWithStorage<listsType>("lists", "分类列表", []);
