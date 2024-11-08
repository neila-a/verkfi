"use client";
import {
    Button,
    ButtonGroup
} from "@mui/material";
import {
    useAtom,
    useSetAtom
} from "jotai";
import {
    file
} from "@verkfi/shared/reader/db";
import {
    listsAtom
} from "@verkfi/shared/atoms";
import {
    get
} from "react-intl-universal";
import {
    NXTMetadata,
    inputTypes
} from "./page";
import {
    extensionsAtomValue
} from "@verkfi/shared/atoms/extensions";
import getMetadatas from "@verkfi/shared/atoms/getMetadatas";
import {
    modifyDialogOpenAtom,
    removeDialogOpenAtom
} from "./atoms";
import {
    startTransition
} from "react";
import {
    globalList
} from "index/atoms";
export default function DialogButtons(props: {
    type: inputTypes;
    fileInfo: NXTMetadata;
    files: file[];
    reset(): void;
}) {
    const [lists, setLists] = useAtom(listsAtom),
        setRemoveDialogOpen = useSetAtom(removeDialogOpenAtom),
        setModifyDialogOpen = useSetAtom(modifyDialogOpenAtom),
        setExtensions = useSetAtom(extensionsAtomValue);
    return <ButtonGroup fullWidth>
        {props.files.length !== 0 && <Button variant="contained" onClick={async event => {
            // 写入文件系统
            const allHandle = await navigator.storage.getDirectory();
            await Promise.all(props.files.map(async file => {
                const dirs = file.path.split("/");
                let handle = await allHandle.getDirectoryHandle(props.fileInfo.to, {
                    create: true
                });
                await Promise.all(dirs.map(async (dir, index) => {
                    if (index !== dirs.length - 1) {
                        handle = await handle.getDirectoryHandle(dir, {
                            create: true
                        });
                    }
                }));
                const
                    fileHandle = await handle.getFileHandle(dirs[dirs.length - 1], {
                        create: true
                    }),
                    writable = await fileHandle.createWritable();
                await writable.write(file.file);
                await writable.close();
            }));
            setExtensions(await getMetadatas());

            // 写入lists
            const to = `/tools/extension?tool=${props.fileInfo.to}`;
            if (lists.get(globalList).includes(to)) {
                const draft = structuredClone(lists);
                draft.set(globalList, [...draft.get(globalList), to]);
                startTransition(() => setLists(draft));
            }
            props.reset();
        }}>
            {props.type === "add" ? get("添加") : get("编辑")}
        </Button>}
        {props.type === "modify" && <Button variant="outlined" onClick={async event => {
            setModifyDialogOpen(false);
            setRemoveDialogOpen(true);
        }}>
            {get("删除")}
        </Button>}
    </ButtonGroup>;
}
