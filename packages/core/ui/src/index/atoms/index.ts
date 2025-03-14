import toolsListAtom from "@verkfi/shared/atoms/toolsList";
import {
    emptySymbol
} from "@verkfi/shared/reader/atomWithStorage";
import searchBase from "index/sidebar/searchBase";
import {
    PrimitiveAtom,
    WritableAtom,
    atom
} from "jotai";
import {
    RESET
} from "jotai/utils";
import {
    tool
} from "tools/info";
import atomWithInitialValue, {
    valueAtomReturn
} from "@verkfi/shared/reader/atomWithInitialValue";
import atomWithEmpty from "@verkfi/shared/reader/atomWithEmpty";
export type toolsAtomUpdate = tool[] | typeof RESET | `remove ${string}`;
export type listName = string | typeof globalList;
export type sorting = listName | typeof homeList;
export const
    globalList = {
        internal: "global"
    } as const,
    homeList = {
        internal: "home"
    } as const,
    editModeAtom = atom(false),
    tabAtom = atom(0),
    showRecommendsAtom = atom(false),
    [toolsAtom, toolsAtomValue] = atomWithInitialValue(
        (valueAtom: valueAtomReturn<tool[]>) => atomWithEmpty(
            get => get(toolsListAtom),
            async (get, set, update: toolsAtomUpdate) => {
                const list = await get(toolsListAtom);
                function publicIfEmpty() {
                    if (value === emptySymbol) {
                        if (list) {
                            return set(valueAtom, list);
                        }
                        return set(valueAtom, []);
                    }
                }
                const value = get(valueAtom);
                if (update === RESET) {
                    publicIfEmpty();
                    if (list) {
                        set(valueAtom, list);
                    }
                } else if (typeof update === "string") {
                    publicIfEmpty();
                    const removing = update.replace("remove ", "");
                    set(valueAtom, (value as tool[]).filter(a => a.to !== removing));
                } else {
                    set(valueAtom, update);
                }
            },
            valueAtom
        ) as WritableAtom<Promise<tool[]>, [update: toolsAtomUpdate], void | Promise<void>>
    ),
    [sortingForAtom, sortingForAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<sorting>) => atom(get => (isImplant: boolean) => {
        const value = get(valueAtom);
        if (value === emptySymbol) {
            if (isImplant) {
                return globalList;
            }
            return homeList;
        }
        return value;
    }, (get, set, update: sorting) => {
        set(valueAtom, update);
    })),
    [sortedToolsAtom, sortedToolsAtomValue] = atomWithInitialValue(valueAtom => atomWithEmpty(
        get => get(toolsListAtom),
        (get, set, update: tool[]) => {
            set(valueAtom, update);
        },
        valueAtom
    )),
    [searchTextAtom, searchTextAtomValue] = atomWithInitialValue((valueAtom: PrimitiveAtom<string>) => atom(
        get => get(valueAtom),
        async (get, set, search: string, isImplant: boolean) => {
            set(editingAtom, search === "");
            if (get(sortingForAtom)(isImplant) === homeList) {
                set(sortingForAtom, globalList);
            }
            set(valueAtom, search);
            const sortedTools = await get(sortedToolsAtom);
            set(toolsAtom, searchBase(sortedTools, search));
        }
    ), ""),
    [editingAtom, editingAtomValue] = atomWithInitialValue(valueAtom => atomWithEmpty(
        get => {
            const searchText = get(searchTextAtom);
            return searchText === "";
        },
        (get, set, update: boolean) => {
            set(valueAtom, update);
        },
        valueAtom
    )),
    focusingToAtom = atom(get => {
        const tab = get(tabAtom),
            tools = get(toolsAtom);
        return tools[tab] ? tools[tab].to : "";
    }),
    expandAtom = atom(false);
