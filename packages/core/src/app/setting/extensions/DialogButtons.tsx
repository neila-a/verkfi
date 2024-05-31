"use client";
import {
    Button,
    ButtonGroup
} from "@mui/material";
import {
    setState
} from "declare";
import {
    useAtom
} from "jotai";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import {
    lists as listsAtom
} from "@verkfi/shared/atoms";
import {
    get
} from "react-intl-universal";
import {
    NXTMetadata
} from "./page";
import {
    single
} from "@verkfi/shared/reader/db";
export default function DialogButtons(props: {
    type: "modify" | "add";
    fileInfo: NXTMetadata;
    setModifyDialogOpen: setState<boolean>;
    setRemoveDialogOpen: setState<boolean>;
    files: single["files"];
    reset(): void;
}) {
    const [lists, setLists] = useAtom(listsAtom),
        [extensions, setExtensions] = useAtom(extensionsAtom);
    return (
        <ButtonGroup fullWidth>
            {props.files.length !== 0 && (
                <Button variant="contained" onClick={async event => {
                    setExtensions({
                        ...props.fileInfo,
                        files: props.files
                    });
                    const index = lists?.find(list => list[0] === "__global__"), to = `/tools/extension?tool=${props.fileInfo.to}`;
                    if (!index?.[1].includes(to)) {
                        setLists(lists?.map(singleList => {
                            if (singleList[0] === "__global__") {
                                return [singleList[0], [...singleList[1], to]];
                            }
                            return singleList;
                        }));
                    }
                    props.reset();
                }}>
                    {props.type === "add" ? get("添加") : get("编辑")}
                </Button>
            )}
            {props.type === "modify" && (
                <Button variant="outlined" onClick={async event => {
                    props.setModifyDialogOpen(false);
                    props.setRemoveDialogOpen(true);
                }}>
                    {get("删除")}
                </Button>
            )}
        </ButtonGroup>
    );
}
