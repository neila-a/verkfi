import {
    atom
} from "jotai";
import {
    blobToInt8Array,
    block,
    emptyFile,
    initialSize,
    jigsaw
} from "./consts";
import atomWithStorage from "@verkfi/shared/reader/atomWithStorage";
import range from "@verkfi/shared/range";
import canvasToBlob from "./canvasToBlob";
namespace atoms {
    export namespace image {
        export const array = atom<File[]>([]),
            file = atom(get => get(array)?.[0] || emptyFile),
            /**
             * 宽度和高度总是一起变化
             */
            size = atom<[width: number, height: number]>([initialSize, initialSize]),
            fileKey = atom(get => blobToInt8Array(get(file)));
    }
    export namespace jigsaws {
        export const all = atomWithStorage<Record<string, jigsaw>>("jigsaws", {
        }),
            selected = atom(async get => (await get(all))[await get(image.fileKey)]),
            movinger = atom(null, async (get, set, jigsaw: jigsaw, rowIndex: number, columnIndex: number) => {
                const addingJigsaw: jigsaw = {
                    ...jigsaw,
                    blocks: jigsaw.rightBlocks.map((b1, indexb1) => b1.map((c1, indexc1) => {
                        if (indexb1 === rowIndex && indexc1 === columnIndex) {
                            const old = c1 as block;
                            Object.defineProperty(old, "rotation", {
                                value: 0
                            });
                            return old;
                        }
                        return jigsaw.blocks?.[indexb1]?.[indexc1];
                    })).filter(item => item !== undefined)
                };
                const draft = structuredClone(await get(all));
                draft[await get(image.fileKey)] = addingJigsaw;
                set(all, draft);
                return draft;
            }),
            starter = atom(null, async (get, set) => {
                const img = new Image(),
                    canvas = document.createElement("canvas"),
                    context = canvas.getContext("2d"),
                    splited: Blob[][] = [],
                    [width, height] = get(image.size),
                    imageFile = get(image.file),
                    imageKey = await get(image.fileKey);
                img.src = URL.createObjectURL(get(image.file));
                await new Promise<Event>(resolve => img.addEventListener("load", async event => resolve(event)));
                URL.revokeObjectURL(img.src);
                canvas.width = img.width / width;
                canvas.height = img.height / height;
                for (let y of range(height - 1)) {
                    const thisBuffer: Blob[] = [];
                    for (let x of range(width - 1)) {
                        context!.drawImage(
                            img,
                            x * img.width / width,
                            y * img.height / height,
                            img.width / width,
                            img.height / height,
                            0,
                            0,
                            img.width / width,
                            img.height / height
                        );
                        thisBuffer.push(await canvasToBlob(canvas));
                        context!.clearRect(0, 0, img.width / width, img.height / height);
                    }
                    splited.push(thisBuffer);
                }

                const
                    addingJigsaw = {
                        rightBlocks: splited,
                        blocks: [],
                        file: imageFile,
                        fileName: imageFile.name
                    },
                    old = structuredClone(await get(all));
                old[imageKey] = addingJigsaw;
                set(all, old);
                return old;
            });
    }
    export namespace dialogOpen {
        export const main = atom(false),
            reset = atom(false);
    }
    export const selecting = atom<[row: number, column: number]>([-1, -1]);
}
export default atoms;
