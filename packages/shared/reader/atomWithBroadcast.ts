export default function atomWithBroadcast<Value, Arg, Result>(read: (get: Getter, options: {
    readonly signal: AbortSignal;
    readonly setSelf: <A extends Arg>(arg: A) => Result;
}) => Value, write: Write<[Arg], Result>, broadcastChannelId: string) {
    const created = atom(read, (get, set, update: Arg, isEvent?: boolean) => {
        if (isEvent) {
            return write(get, set, update);
        }
        write(get, set, update);
        const channel = new BroadcastChannel(broadcastChannelId);
        return channel.postMessage(update);
    }) as unknown as WritableAtom<Value, [update: Arg, isEvent?: boolean], Result>;
    created.debugLabel = broadcastChannelId;
    created.onMount = setAtom => {
        const channel = new BroadcastChannel(broadcastChannelId);
        channel.addEventListener("message", event => {
            setAtom(event.data as Arg, true);
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
