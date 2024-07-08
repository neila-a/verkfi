import getClients from "./getClients";
declare const self: ServiceWorkerGlobalScope;
export type message = {
    action: "getClients";
} | {
    action: "navigate";
    /**
     * navigate action 中要聚焦的 ID
     */
    id: string;
    /**
     * navigate action 中要聚焦的 URL
     */
    url: string;
}
export default async function onMessage(event: ExtendableMessageEvent) {
    const data = event.data as message, port = event.ports[0];
    switch (data.action) {
        case "getClients":
            port.postMessage(await getClients());
            break;
        case "navigate":
            const client = await self.clients.get(data.id) as WindowClient;
            await client.navigate(data.url);
            port.postMessage(await getClients());
            break;
    }
}
