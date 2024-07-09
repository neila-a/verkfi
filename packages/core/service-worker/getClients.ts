declare const self: ServiceWorkerGlobalScope;
export default async function getClients() {
    const
        matchedClients = await self.clients.matchAll({
            type: "window"
        }), convertedClients = matchedClients.map(client => ({
            id: client.id,
            url: client.url
        }));
    return convertedClients;
}
