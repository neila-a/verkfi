export default function awaiter<awaitingType, returns>(
    toAwait: awaitingType | Promise<awaitingType>,
    onfulfilled: (value: Awaited<awaitingType>) => returns
) {
    if (toAwait instanceof Promise) {
        // 使用await因为await支持递归then
        return (async () => onfulfilled(await toAwait))();
    }
    return onfulfilled(toAwait as Awaited<awaitingType>);
}
