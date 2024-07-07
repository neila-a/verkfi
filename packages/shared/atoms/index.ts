import {
    viewMode
} from "@verkfi/core-ui/src/app/index/consts";
import {
    lists
} from "@verkfi/core-ui/src/app/index/sidebar";
import atomWithStorage from "../reader/atomWithStorage";
import isBrowser from "../isBrowser";
import {
    WritableAtom,
    atom
} from "jotai";
import extensionsAtom, {
    convertedExtensionsAtom
} from "./extensions";
import toolsInfoAtom, {
    noIconTool,
    tool
} from "@verkfi/core-ui/src/app/tools/info";
import {
    NXTMetadata,
    setting
} from "@verkfi/core-ui/src/app/setting/extensions/page";
import awaiter from "../reader/awaiter";
import {
    globalListSymbol,
    listName,
    sorting,
    toolsAtom,
    toolsAtomUpdate
} from "@verkfi/core-ui/src/app/index/atoms";
import {
    RESET
} from "jotai/utils";
type mostUsedMarks = Record<string, number>;
const viewModeAtomValue = atomWithStorage<viewMode>("viewmode", "list");
export type sidebarMode = "menu" | "sidebar";
export const mostUsedSelects = 3,
    sidebarModeAtom = atomWithStorage<sidebarMode>("sidebarmode", "menu"),
    showSidebarAtom = atomWithStorage<boolean>("sidebar", false),
    showClientsAtom = atomWithStorage<boolean>("clients", false),
    forkMeOnGitHubAtom = atomWithStorage<boolean>("fork-me-on-github", false),
    shareAtom = atomWithStorage<boolean>("share", isBrowser() ? "share" in navigator : false),
    viewModeAtom = atom(get => get(viewModeAtomValue), (get, set, update: viewMode | "swap") => {
        if (update === "swap") {
            return awaiter(
                get(viewModeAtomValue), value => set(viewModeAtomValue, value === "grid" ? "list" : "grid")
            );
        }
        set(viewModeAtomValue, update);
    }),
    gradientToolAtom = atomWithStorage<boolean>("gradient-tool", false),
    recentlyUsedAtom = atomWithStorage<string[]>("recently-tools", []),
    recentlyToolsAtom = atom(async get => {
        // 用了Promise.all就不可能避免微任务了
        const recentlyUsed = await get(recentlyUsedAtom),
            converted = await get(convertedExtensionsAtom),
            toolsInfo = await get(toolsInfoAtom),
            unfilterd = await Promise.all(recentlyUsed.map(to => (0
                || toolsInfo.find(single => single.to === to)
                || converted.find(single => `/tools/extension?tool=${to}` === single.to)) as tool | 0
            ));
        return unfilterd.filter(item => item !== 0) satisfies unknown as tool[];
    }),
    mostUsedAtom = atomWithStorage<mostUsedMarks>("most-tools", {
    }),
    mostUsedToolsAtom = atom(get => awaiter(
        get(convertedExtensionsAtom), converted => awaiter(
            get(toolsInfoAtom), realTools => awaiter(
                get(mostUsedAtom), mostUsed => Object.entries(mostUsed).sort((r, g) => {
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
                }).filter(item => item !== 0 && item !== undefined) as unknown as tool[]
            )
        )
    )),
    listsAtom = atomWithStorage<lists>("lists", new Map()),
    buttonCommonSorterAtom = atom(null, (get, set, sortingFor: listName, pd: tool[]) => awaiter(
        get(listsAtom), (realList: lists) => {
            const newRealList = structuredClone(realList),
                content = pd.map(toolp => toolp.to);
            if (sortingFor in newRealList) {
                newRealList.set(sortingFor, content);
            } else {
                newRealList.set(globalListSymbol, content);
            }
            set(listsAtom, newRealList);
            return awaiter(set(toolsAtom, RESET as unknown as toolsAtomUpdate), a => a);
        }
    )),
    extensionDataCleanerAtom = atom(null, (get, set, clearingExtension: NXTMetadata & noIconTool) => awaiter(
        get(mostUsedAtom), mostUsed => awaiter(
            get(recentlyUsedAtom), async oldRecently => {
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
                await set(recentlyUsedAtom, oldRecently.filter(item => item !== clearingExtension.to));
                Reflect.deleteProperty(oldMost, clearingExtension.to);
                await set(mostUsedAtom, oldMost);
            }
        )
    ));
