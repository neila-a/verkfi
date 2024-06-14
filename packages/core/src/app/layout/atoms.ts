"use client";
import atomWithBroadcast from "@verkfi/shared/reader/atomWithBroadcast";
import atomWithInitialValue, {
    valueAtomReturn
} from "@verkfi/shared/reader/atomWithInitialValue";
import {
    emptySymbol
} from "@verkfi/shared/reader/atomWithStorage";
interface clientBase {
    id: string;
    url: string;
}
export const clientsAtom = atomWithInitialValue((valueAtom: valueAtomReturn<clientBase[]>) => atomWithBroadcast(get => {
    const got = get(valueAtom);
    if (got === emptySymbol) {
        return [];
    }
    return got;
}, (get, set, update: clientBase[]) => set(valueAtom, update), "clients"))[0];
