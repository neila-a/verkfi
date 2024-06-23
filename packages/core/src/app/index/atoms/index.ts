import toolsListAtom from "@verkfi/shared/atoms/toolsList";
import {
    emptySymbol
} from "@verkfi/shared/reader/atomWithStorage";
import searchBase from "index/sidebar/searchBase";
import {
    PrimitiveAtom,
    atom
} from "jotai";
import {
    RESET
} from "jotai/utils";
import {
    tool
} from "tools/info";
import simpleGetterWithEmpty from "@verkfi/shared/reader/simpleGetterWithEmpty";
import atomWithInitialValue, {
    valueAtomReturn
} from "@verkfi/shared/reader/atomWithInitialValue";
import awaiter from "@verkfi/shared/reader/awaiter";
export const editModeAtom = atom(false),
    tabAtom = atom(0),
    showRecommendsAtom = atom(false),
    [toolsAtom, toolsAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<tool[]>) => atom(
        simpleGetterWithEmpty(valueAtom, get => awaiter(get(toolsListAtom), list => list)),
        (get, set, update: tool[] | typeof RESET | `remove ${string}`) => awaiter(get(toolsListAtom), list => {
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
        })
    )),
    [sortingForAtom, sortingForAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<string>) => atom(get => (isImplant: boolean) => {
        const value = get(valueAtom);
        if (value === emptySymbol) {
            if (isImplant) {
                return "__global__";
            }
            return "__home__";
        }
        return value;
    }, (get, set, update: string) => {
        set(valueAtom, update);
    })),
    [sortedToolsAtom, sortedToolsAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<tool[]>) => atom(
        simpleGetterWithEmpty(valueAtom, get => awaiter(get(toolsListAtom), list => list)),
        (get, set, update: tool[]) => {
            set(valueAtom, update);
        }
    )),
    [searchTextAtom, searchTextAtomValue] = atomWithInitialValue((valueAtom: PrimitiveAtom<string>) => atom(
        get => get(valueAtom),
        (get, set, search: string, isImplant: boolean) => {
            set(editingAtom, search === "");
            if (get(sortingForAtom)(isImplant) === "__home__") {
                set(sortingForAtom, "__global__");
            }
            set(valueAtom, search);
            awaiter(get(sortedToolsAtom), sortedTools => set(toolsAtom, searchBase(sortedTools, search)));
        }
    ), ""),
    [editingAtom, editingAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<boolean>) => atom(simpleGetterWithEmpty(valueAtom, get => {
        const searchText = get(searchTextAtom);
        return searchText === "";
    }), (get, set, update: boolean) => {
        set(valueAtom, update);
    })),
    focusingToAtom = atom(get => {
        const tab = get(tabAtom),
            tools = get(toolsAtom);
        return tools[tab] ? tools[tab].to : "";
    });
