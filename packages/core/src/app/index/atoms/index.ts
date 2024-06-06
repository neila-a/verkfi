import {
    loadableToolsListAtom
} from "@verkfi/shared/atoms/toolsList";
import {
    emptySymbol
} from "@verkfi/shared/reader/atomWithStorage";
import searchBase from "index/sidebar/searchBase";
import {
    atom
} from "jotai";
import {
    RESET
} from "jotai/utils";
import {
    tool
} from "tools/info";
export const toolsAtomValue = atom<tool[] | typeof emptySymbol>(emptySymbol),
    sortingForAtomValue = atom<string | typeof emptySymbol>(emptySymbol),
    sortedToolsAtomValue = atom<tool[] | typeof emptySymbol>(emptySymbol),
    searchTextAtomValue = atom(""),
    editingAtomValue = atom<boolean | typeof emptySymbol>(emptySymbol);
export const editModeAtom = atom(false),
    searchTextAtom = atom(get => get(searchTextAtomValue), (get, set, search: string, isImplant: boolean) => {
        set(editingAtom, search === "");
        if (get(sortingForAtom)(isImplant) === "__home__") {
            set(sortingForAtom, "__global__");
        }
        set(toolsAtom, searchBase(get(sortedToolsAtom), search));
        set(searchTextAtomValue, search);
    }),
    toolsAtom = atom(get => {
        const value = get(toolsAtomValue),
            list = get(loadableToolsListAtom);
        if (value === emptySymbol) {
            if (list.state === "hasData") {
                return list.data;
            }
            return [];
        }
        return value;
    }, (get, set, update: tool[] | typeof RESET | `remove ${string}`) => {
        function publicIfEmpty() {
            if (value === emptySymbol) {
                if (list.state === "hasData") {
                    set(toolsAtomValue, list.data);
                }
                set(toolsAtomValue, []);
            }
        }
        const value = get(toolsAtomValue),
            list = get(loadableToolsListAtom);
        if (update === RESET) {
            publicIfEmpty();
            if (list.state === "hasData") {
                set(toolsAtomValue, list.data);
            }
        } else if (typeof update === "string") {
            publicIfEmpty();
            const removing = update.replace("remove ", "");
            set(toolsAtomValue, (value as tool[]).filter(a => a.to !== removing));
        } else {
            set(toolsAtomValue, update);
        }
    }),
    tabAtom = atom(0),
    sortingForAtom = atom(get => (isImplant: boolean) => {
        const value = get(sortingForAtomValue);
        if (value === emptySymbol) {
            if (isImplant) {
                return "__global__";
            }
            return "__home__";
        }
        return value;
    }, (get, set, update: string) => {
        set(sortingForAtomValue, update);
    }),
    editingAtom = atom(get => {
        const value = get(editingAtomValue);
        if (value === emptySymbol) {
            const searchText = get(searchTextAtom);
            return searchText === "";
        }
        return value;
    }, (get, set, update: boolean) => {
        set(editingAtomValue, update);
    }),
    sortedToolsAtom = atom(get => {
        const value = get(sortedToolsAtomValue),
            list = get(loadableToolsListAtom);
        if (value === emptySymbol) {
            if (list.state === "hasData") {
                return list.data;
            }
            return [];
        }
        return value;
    }, (get, set, update: tool[]) => {
        set(sortedToolsAtomValue, update);
    });
