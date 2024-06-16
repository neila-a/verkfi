"use client";
import atomWithBroadcast from "@verkfi/shared/reader/atomWithBroadcast";
import atomWithInitialValue, {
    valueAtomReturn
} from "@verkfi/shared/reader/atomWithInitialValue";
import simpleGetterWithEmpty from "@verkfi/shared/reader/simpleGetterWithEmpty";
interface clientBase {
    id: string;
    url: string;
}
export const [clientsAtom] = atomWithInitialValue((valueAtom: valueAtomReturn<clientBase[]>) => atomWithBroadcast(simpleGetterWithEmpty(valueAtom, () => [] as clientBase[]), (get, set, update: clientBase[]) => set(valueAtom, update), "clients"));
