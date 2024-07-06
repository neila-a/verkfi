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
    NXTMetadata
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
export default function DialogButtons(props: {
    type: "modify" | "add";
    fileInfo: NXTMetadata;
    files: file[];
    reset(): void;
}) {
    const [lists, setLists] = useAtom(listsAtom),
        setRemoveDialogOpen = useSetAtom(removeDialogOpenAtom),
        setModifyDialogOpen = useSetAtom(modifyDialogOpenAtom),
        setExtensions = useSetAtom(extensionsAtomValue),
        buttons = [
            props.files.length !== 0 && <Button variant="contained" onClick={async event => {
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
                const index = lists?.find(list => list[0] === "__global__"), to = `/tools/extension?tool=${props.fileInfo.to}`;
                if (!index?.[1].includes(to)) {
                    if (lists.map) {
                        startTransition(() => setLists(lists.map(singleList => {
                            if (singleList[0] === "__global__") {
                                return [singleList[0], [...singleList[1], to]];
                            }
                            return singleList;
                        })));
                    }
                }
                props.reset();
            }}>
                {props.type === "add" ? get("添加") : get("编辑")}
            </Button>,
            props.type === "modify" && <Button variant="outlined" onClick={async event => {
                setModifyDialogOpen(false);
                setRemoveDialogOpen(true);
            }}>
                {get("删除")}
            </Button>
        ];
    return (
        <ButtonGroup fullWidth>
            {buttons}
        </ButtonGroup>
    );
}
