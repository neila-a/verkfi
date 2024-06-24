import {
    Atom,
    Getter,
    Setter,
    WritableAtom,
    atom
} from "jotai";
import {
    emptySymbol
} from "./atomWithStorage";
import awaiter from "./awaiter";
function atomWithEmpty<Value, update extends Value, Result>(
    read: Read<Value, SetAtom<[value: Exclude<update, typeof emptySymbol>], Result>>,
    write: Write<[value: Exclude<update, typeof emptySymbol>], Result>,
    valuer: Atom<Value>
) {
    return atom(
        (get, options) => {
            const got = get(valuer);
            if (got === emptySymbol) {
                const waiting = read(get, options);
                return awaiter(waiting, value => {
                    options.setSelf(...[value] as [value: Exclude<update, typeof emptySymbol>]);
                    return read(get, options);
                });
            }
            return got as Exclude<Value, typeof emptySymbol>;
        },
        write
    ) as WritableAtom<Exclude<Value, typeof emptySymbol>, [value: Exclude<update, typeof emptySymbol>], Result>;
}
export default atomWithEmpty;
/**
 * @source jotai
 */
type SetAtom<Args extends unknown[], Result> = <A extends Args>(...args: A) => Result;
/**
 * setSelf is for internal use only and subject to change without notice.
 */
type Read<Value, SetSelf = never> = (get: Getter, options: {
    readonly signal: AbortSignal;
    readonly setSelf: SetSelf;
}) => Value | Promise<Value>;
type Write<Args extends unknown[], Result> = (get: Getter, set: Setter, ...args: Args) => Result;
