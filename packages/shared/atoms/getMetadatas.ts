import {
    NXTMetadata as baseNXT
} from "@verkfi/core-ui/src/app/setting/extensions/page";
import {
    noIconTool
} from "@verkfi/core-ui/src/app/tools/info";
interface NXTMetadata extends baseNXT, noIconTool {
}
export default async function getMetadatas() {
    const allHandle = await navigator.storage.getDirectory() as FileSystemDirectoryHandle & {
        values(): AsyncIterableIterator<FileSystemHandle>;
    },
        values = allHandle.values(),
        ret: NXTMetadata[] = [];
    for await (const value of values) {
        if (value.kind === "directory") {
            const thisHandle = await allHandle.getDirectoryHandle(value.name),
                packageHandle = await thisHandle.getFileHandle("package.json"),
                file = await packageHandle.getFile(),
                text = await file.text();
            ret.push(JSON.parse(text));
        }
    }
    return ret;
}
