import {
    atomWithRefresh
} from "jotai/utils";
import {
    message
} from "@verkfi/core-service-worker/onMessage";
import {
    atom
} from "jotai";
interface clientBase {
    id: string;
    url: string;
}
export const clientsAtom = atomWithRefresh(get => new Promise<clientBase[]>(resolve => {
    const channel = new MessageChannel();
    channel.port1.onmessage = event => {
        resolve(event.data as clientBase[]);
    };
    navigator?.serviceWorker?.controller?.postMessage?.({
        action: "getClients"
    } as message, [channel.port2]);
})),
    searchTextAtom = atom(""),
    /**
     * `clientsAtom`一定是`Promise`，不需要使用`awaiter`
     */
    filteredClientsAtom = atom(get => get(clientsAtom).then(clients => clients.filter(client => client.url.includes(get(searchTextAtom)))));
