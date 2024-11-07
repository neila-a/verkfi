import {
    Atom,
    Getter,
    Setter,
    atom
} from "jotai";
import {
    emptySymbol
} from "./atomWithStorage";
import awaiter from "./awaiter";
function atomWithEmpty<Value, update extends Value, Result>(
    read: Read<Value, SetAtom<[value: Exclude<update, typeof emptySymbol>], Result>>,
    write: Write<[value: Exclude<update, typeof emptySymbol>, isEvent?: boolean], Result>,
    valuer: Atom<Value>
) {
    return atom(
        (get, options) => {
            const got = get(valuer);
            if (got === emptySymbol) {
                const waiting = read(get, options);
                awaiter(waiting, value => {
                    const warn = globalThis.console.warn;
                    globalThis.console.warn = () => null;
                    options.setSelf(...[value] as [value: Exclude<update, typeof emptySymbol>], true);
                    globalThis.console.warn = warn;
                });
                return waiting;
            }
            return got as Exclude<Value, typeof emptySymbol>;
        },
        write
    );
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
