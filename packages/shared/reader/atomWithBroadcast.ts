export default function atomWithBroadcast<Value, Args extends unknown[], Result>(read: (get: Getter, options: {
    readonly signal: AbortSignal;
    readonly setSelf: <A extends Args>(...args: A) => Result;
}) => Value, write: Write<Args, Result>, broadcastChannelId: string) {
    type Arg = Args[0];
    const created = atom(read, (get, set, update: Arg | {
        __atom_update_type__: "message",
        update: Arg;
    }) => {
        let message = false;
        if (typeof update === "object") {
            if ("__atom_update_type__" in update) {
                if (update.__atom_update_type__ === "message") {
                    write(get, set, ...[update.update] as Args);
                    message = true;
                }
            }
        }
        if (!message) {
            write(get, set, ...[update] as Args);
            const channel = new BroadcastChannel(broadcastChannelId);
            channel.postMessage(update);
        }
    }) as unknown as WritableAtom<Value, Args, Result>;
    created.debugLabel = broadcastChannelId;
    created.onMount = setAtom => {
        const channel = new BroadcastChannel(broadcastChannelId);
        channel.addEventListener("message", event => {
            setAtom(...[{
                __atom_update_type__: "message",
                update: event.data
            }] as Args);
        });
    };
    return created;
}
import {
    Getter,
    WritableAtom,
    atom
} from "jotai";
/**
 * @source jotai/atom.d.ts
 */
type Setter = <Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result>, ...args: Args) => Result;
export type Write<Args extends unknown[], Result> = (get: Getter, set: Setter, ...args: Args) => Result;
