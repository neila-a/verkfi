import {
    loadableToolsListAtom
} from "@verkfi/shared/atoms/toolsList";
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
export const editModeAtom = atom(false),
    tabAtom = atom(0),
    [toolsAtom, toolsAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<tool[]>) => atom(simpleGetterWithEmpty(valueAtom, get => {
        const list = get(loadableToolsListAtom);
        if (list.state === "hasData") {
            return list.data;
        }
        return [];
    }), (get, set, update: tool[] | typeof RESET | `remove ${string}`) => {
        function publicIfEmpty() {
            if (value === emptySymbol) {
                if (list.state === "hasData") {
                    set(valueAtom, list.data);
                }
                set(valueAtom, []);
            }
        }
        const value = get(valueAtom),
            list = get(loadableToolsListAtom);
        if (update === RESET) {
            publicIfEmpty();
            if (list.state === "hasData") {
                set(valueAtom, list.data);
            }
        } else if (typeof update === "string") {
            publicIfEmpty();
            const removing = update.replace("remove ", "");
            set(valueAtom, (value as tool[]).filter(a => a.to !== removing));
        } else {
            set(valueAtom, update);
        }
    })),
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
    [sortedToolsAtom, sortedToolsAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<tool[]>) => atom(simpleGetterWithEmpty(valueAtom, get => {
        const list = get(loadableToolsListAtom);
        if (list.state === "hasData") {
            return list.data;
        }
        return [];
    }), (get, set, update: tool[]) => {
        set(valueAtom, update);
    })),
    [searchTextAtom, searchTextAtomValue] = atomWithInitialValue((valueAtom: PrimitiveAtom<string>) => atom(get => get(valueAtom), (get, set, search: string, isImplant: boolean) => {
        set(editingAtom, search === "");
        if (get(sortingForAtom)(isImplant) === "__home__") {
            set(sortingForAtom, "__global__");
        }
        set(toolsAtom, searchBase(get(sortedToolsAtom), search));
        set(valueAtom, search);
    }), ""),
    [editingAtom, editingAtomValue] = atomWithInitialValue((valueAtom: valueAtomReturn<boolean>) => atom(simpleGetterWithEmpty(valueAtom, get => {
        const searchText = get(searchTextAtom);
        return searchText === "";
    }), (get, set, update: boolean) => {
        set(valueAtom, update);
    }));
