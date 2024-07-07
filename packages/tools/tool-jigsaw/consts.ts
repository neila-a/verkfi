export const keySize = 10000,
    emptyFile = new File([], "empty"),
    blobToInt8Array = async (blob: Blob) => new Int8Array(await blob.slice(0, keySize).arrayBuffer()).join("").slice(0, keySize),
    initialSize = 3,
    dragImageSize = 32;
export type block = Blob & {
    rotation: number;
};
export interface jigsaw {
    /**
     * 第一个数组是—，第二数组是|
     */
    rightBlocks: Blob[][];
    blocks: block[][];
    file: File;
}
