import {
    loadableToolsListAtom
} from "atoms/toolsList";
import {
    atom
} from "jotai";
import {
    tool
} from "tools/info";
export const toolsAtomValue = atom<tool[] | "__empty__">("__empty__"),
    sortingForAtomValue = atom<string>("__empty__"),
    sortedToolsAtomValue = atom<tool[] | "__empty__">("__empty__"),
    editingAtomValue = atom<boolean | "empty">("empty");
export const searchTextAtom = atom(""),
    editModeAtom = atom(false),
    toolsAtom = atom(get => {
        const value = get(toolsAtomValue),
            list = get(loadableToolsListAtom);
        if (value === "__empty__") {
            if (list.state === "hasData") {
                return list.data;
            }
            return [];
        }
        return value;
    }, (get, set, update: tool[]) => {
        set(toolsAtomValue, update);
    }),
    tabAtom = atom(0),
    sortingForAtom = atom(get => (isImplant: boolean) => {
        const value = get(sortingForAtomValue);
        if (value === "__empty__") {
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
        if (value === "empty") {
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
        if (value === "__empty__") {
            if (list.state === "hasData") {
                return list.data;
            }
            return [];
        }
        return value;
    }, (get, set, update: tool[]) => {
        set(sortedToolsAtomValue, update);
    });
