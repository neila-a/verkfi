"use client";
import {
    Button,
    ButtonGroup
} from "@mui/material";
import {
    useContext
} from "react";
import {
    get
} from "react-intl-universal";
import db from "db";
import {
    lists as listsContext
} from "layout/layoutClient";
import {
    setState
} from "declare";
import {
    NXTMetadata
} from "./page";
export default function DialogButtons(props: {
    type: "modify" | "add";
    fileInfo: NXTMetadata;
    setModifyDialogOpen: setState<boolean>;
    setRemoveDialogOpen: setState<boolean>;
    files: [string, Uint8Array][];
    reset(): void;
}) {
    const lists = useContext(listsContext);
    return (
        <ButtonGroup fullWidth>
            {props.files.length !== 0 && <Button variant="contained" onClick={async (event) => {
                await db.extensionTools.put({
                    ...props.fileInfo,
                    files: props.files
                });
                const index = lists?.value.find(list => list[0] === "__global__"), to = `/tools/extension?tool=${props.fileInfo.to}`;
                if (!index?.[1].includes(to)) {
                    lists.set(lists.value.map(singleList => {
                        if (singleList[0] === "__global__") {
                            return [singleList[0], [...singleList[1], to]];
                        }
                        return singleList;
                    }));
                }
                props.reset();
            }}>
                {props.type === "add" ? get("添加") : get("编辑")}
            </Button>}
            {props.type === "modify" && <Button variant="outlined" onClick={async (event) => {
                props.setModifyDialogOpen(false);
                props.setRemoveDialogOpen(true);
            }}>
                {get("删除")}
            </Button>}
        </ButtonGroup>
    );
}
