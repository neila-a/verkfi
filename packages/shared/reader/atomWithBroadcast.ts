export default function atomWithBroadcast<Value, Arg, Result>(read: (get: Getter) => Value, write: Write<Arg, Result>, broadcastChannelId: string) {
    const created = atom(read, (get, set, update: Arg | {
        __atom_update_type__: "message",
        update: Arg;
    }) => {
        let message = false;
        if (typeof update === "object") {
            if ("__atom_update_type__" in update) {
                if (update.__atom_update_type__ === "message") {
                    write(get, set, update.update);
                    message = true;
                }
            }
        }
        if (!message) {
            write(get, set, update as Arg);
            const channel = new BroadcastChannel(broadcastChannelId);
            channel.postMessage(update);
        }
    });
    created.debugLabel = broadcastChannelId;
    created.onMount = setAtom => {
        const channel = new BroadcastChannel(broadcastChannelId);
        channel.addEventListener("message", event => {
            setAtom({
                __atom_update_type__: "message",
                update: event.data
            });
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
type Write<Arg, Result> = (get: Getter, set: Setter, arg: Arg) => Result;
