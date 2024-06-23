import {
    file
} from "@verkfi/shared/reader/db";
import {
    atom
} from "jotai";
import {
    emptyNXTMetadata
} from "tools/extension/empties";
export const modifyDialogOpenAtom = atom(false),
    removeDialogOpenAtom = atom(false),
    fileInfoAtom = atom(emptyNXTMetadata),
    filesAtom = atom<file[]>([]);
