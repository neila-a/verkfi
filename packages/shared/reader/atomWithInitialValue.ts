import {
    PrimitiveAtom,
    atom
} from "jotai";
import {
    emptySymbol
} from "./atomWithStorage";
export type valueAtomReturn<atomType> = PrimitiveAtom<atomType | typeof emptySymbol>;
interface CreatorExtend {
    (arg: any): any;
}
export default function atomWithInitialValue<Creator extends CreatorExtend>(atomCreator: Creator, initial: any = emptySymbol) {
    type CreatorInput = Parameters<Creator>[0] extends  PrimitiveAtom<infer T>  ? T : never;
    type atomType = ReturnType<typeof atomCreator> extends infer T ? T : never;
    type value = atomType | typeof emptySymbol;
    const valueAtom = atom(initial) as PrimitiveAtom<value> & {
        init: value;
    };
    return [atomCreator(valueAtom), valueAtom] as [ReturnType<typeof atomCreator>, valueAtomReturn<CreatorInput>];
}
