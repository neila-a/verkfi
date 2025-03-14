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
    try {
        navigator.serviceWorker.controller.postMessage({
            action: "getClients"
        } as message, [channel.port2]);
    } catch {
        resolve([]);
    }
})),
    searchTextAtom = atom(""),
    filteredClientsAtom = atom(get => get(clientsAtom).then(clients => clients.filter(client => client.url.includes(get(searchTextAtom)))));
