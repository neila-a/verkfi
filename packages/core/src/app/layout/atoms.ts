import atomWithBroadcast from "@verkfi/shared/reader/atomWithBroadcast";
import atomWithEmpty from "@verkfi/shared/reader/atomWithEmpty";
import atomWithInitialValue, {
    valueAtomReturn
} from "@verkfi/shared/reader/atomWithInitialValue";
interface clientBase {
    id: string;
    url: string;
}
export const [clientsAtom] = atomWithInitialValue(
    (valueAtom: valueAtomReturn<clientBase[]>) => {
        const withedEmpty = atomWithEmpty(
            () => [] as clientBase[],
            (get, set, update: clientBase[]) => set(valueAtom, update),
            valueAtom
        );
        return atomWithBroadcast(
            get => get(withedEmpty),
            (get, set, update: clientBase[]) => set(withedEmpty, update),
            "clients"
        );
    }
);
