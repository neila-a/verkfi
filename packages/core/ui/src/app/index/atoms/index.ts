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
import awaiter from "@verkfi/shared/reader/awaiter";
import atomWithEmpty from "@verkfi/shared/reader/atomWithEmpty";
export type toolsAtomUpdate = tool[] | typeof RESET | `remove ${string}`;
export type listName = string | typeof globalListSymbol;
export type sorting = listName | typeof homeListSymbol;
export const globalListSymbol = Symbol("__verkfias eleos mystar__ global list"),
    homeListSymbol = Symbol("__verkfias eleos mystar__ home list"),
    editModeAtom = atom(false),
    tabAtom = atom(0),
    showRecommendsAtom = atom(false),
    [toolsAtom, toolsAtomValue] = atomWithInitialValue(
        (valueAtom: valueAtomReturn<tool[]>) => atomWithEmpty(
            get => awaiter(get(toolsListAtom), list => list),
            (get, set, update: toolsAtomUpdate) => awaiter(
                get(toolsListAtom), list => {
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
                }
            ),
            valueAtom
        ) as WritableAtom<tool[], [update: toolsAtomUpdate], void | Promise<void>>
    ),
    [sortingForAtom, sortingForAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<sorting>) => atom(get => (isImplant: boolean) => {
        const value = get(valueAtom);
        if (value === emptySymbol) {
            if (isImplant) {
                return globalListSymbol;
            }
            return homeListSymbol;
        }
        return value;
    }, (get, set, update: sorting) => {
        set(valueAtom, update);
    })),
    [sortedToolsAtom, sortedToolsAtomValue] = atomWithInitialValue(valueAtom => atomWithEmpty(
        get => awaiter(
            get(toolsListAtom), list => list
        ),
        (get, set, update: tool[]) => {
            set(valueAtom, update);
        },
        valueAtom
    )),
    [searchTextAtom, searchTextAtomValue] = atomWithInitialValue((valueAtom: PrimitiveAtom<string>) => atom(
        get => get(valueAtom),
        (get, set, search: string, isImplant: boolean) => {
            set(editingAtom, search === "");
            if (get(sortingForAtom)(isImplant) === homeListSymbol) {
                set(sortingForAtom, globalListSymbol);
            }
            set(valueAtom, search);
            awaiter(
                get(sortedToolsAtom), sortedTools => set(toolsAtom, searchBase(sortedTools, search))
            );
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
