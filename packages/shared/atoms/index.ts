import {
    mostUsedSelects,
    viewMode
} from "@verkfi/core-ui/src/index/consts";
import {
    lists
} from "@verkfi/core-ui/src/index/sidebar";
import {
    atomWithStorage
} from "jotai/utils";
import isBrowser from "../isBrowser";
import {
    atom
} from "jotai";
import extensionsAtom, {
    convertedExtensionsAtom
} from "./extensions";
import toolsInfoAtom, {
    noIconTool,
    tool
} from "@verkfi/core-ui/src/tools/info";
import {
    NXTMetadata
} from "@verkfi/core-ui/src/setting/extensions/page";
import {
    setting
} from "@verkfi/core-ui/src/setting/extensions/consts";
import {
    globalList,
    listName,
    toolsAtom
} from "@verkfi/core-ui/src/index/atoms";
import {
    RESET
} from "jotai/utils";
type mostUsedMarks = Record<string, number>;
const viewModeAtomValue = atomWithStorage<viewMode>("viewmode", "list");
export type sidebarMode = "menu" | "sidebar";
export const sidebarModeAtom = atomWithStorage<sidebarMode>("sidebarmode", "menu"),
    showSidebarAtom = atomWithStorage<boolean>("sidebar", false),
    showClientsAtom = atomWithStorage<boolean>("clients", false),
    forkMeOnGitHubAtom = atomWithStorage<boolean>("fork-me-on-github", false),
    shareAtom = atomWithStorage<boolean>("share", isBrowser() ? "share" in navigator : false),
    viewModeAtom = atom(
        get => get(viewModeAtomValue),
        async (get, set, update: viewMode | "swap") =>
            set(viewModeAtomValue, update === "swap"
                ? get(viewModeAtomValue) === "grid" ? "list" : "grid"
                : update
            )
    ),
    gradientToolAtom = atomWithStorage<boolean>("gradient-tool", false),
    recentlyUsedAtom = atomWithStorage<string[]>("recently-tools", []),
    recentlyToolsAtom = atom(async get => {
        // 用了Promise.all就不可能避免微任务了
        const recentlyUsed = get(recentlyUsedAtom),
            converted = await get(convertedExtensionsAtom),
            toolsInfo = await get(toolsInfoAtom),
            unfilterd = recentlyUsed.map(to => (0
                || toolsInfo.find(single => single.to === to)
                || converted.find(single => `/tools/extension?tool=${to}` === single.to)) as tool | 0
            );
        return unfilterd.filter(item => item !== 0) satisfies unknown as tool[];
    }),
    mostUsedAtom = atomWithStorage<mostUsedMarks>("most-tools", {
    }),
    mostUsedToolsAtom = atom(async get => {
        const converted = await get(convertedExtensionsAtom),
            realTools = await get(toolsInfoAtom),
            mostUsed = get(mostUsedAtom);
        return Object.entries(mostUsed).sort((r, g) => {
            if (r[1] < g[1]) {
                return 1;
            } if (r[1] > g[1]) {
                return -1;
            }
            return 0;
        }).slice(0, mostUsedSelects).map(item => {
            const to = item[0];
            return 0
                || realTools.find(single => single.to === to)
                || converted.find(single => `/tools/extension?tool=${to}` === single.to) as tool | 0;
        }).filter(item => item !== 0 && item !== undefined) as unknown as tool[];;
    }),
    listsAtom = atomWithStorage<lists>("lists", new Map()),
    buttonCommonSorterAtom = atom(null, (get, set, sortingFor: listName, pd: tool[]) => {
        const realList = get(listsAtom);
        const newRealList = structuredClone(realList), content = pd.map(toolp => toolp.to);
        if (newRealList.has(sortingFor)) {
            newRealList.set(sortingFor, content);
        } else {
            newRealList.set(globalList, content);
        }
        set(listsAtom, newRealList);
        return set(toolsAtom, RESET);
    }),
    extensionDataCleanerAtom = atom(null, (get, set, clearingExtension: NXTMetadata & noIconTool) => {
        const mostUsed = get(mostUsedAtom),
            oldRecently = get(recentlyUsedAtom);
        const
            oldMost = {
                ...mostUsed
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
