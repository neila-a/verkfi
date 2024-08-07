"use client";
import {
    ArrowDownward as ArrowDownwardIcon
} from "@mui/icons-material";
import {
    IconButton
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import downGo from "@verkfi/shared/arrayMove/downGo";
import {
    get
} from "react-intl-universal";
import {
    tool
} from "tools/info";
import {
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    editModeAtom,
    homeList,
    listName,
    sorting,
    toolsAtom
} from "index/atoms";
import {
    buttonCommonSorterAtom
} from "@verkfi/shared/atoms";
import {
    startTransition
} from "react";
export default function DownButton(props: {
    tool: tool;
    sortingFor: sorting;
}) {
    const buttonCommonSorting = useSetAtom(buttonCommonSorterAtom),
        editMode = useAtomValue(editModeAtom),
        tools = useAtomValue(toolsAtom);
    if (props.sortingFor !== homeList) {
        if (editMode) {
            return <MouseOverPopover text={get("index.movedown")}>
                <IconButton size="large" edge="start" color="inherit" aria-label={get("index.movedown")} onClick={event => {
                    event.stopPropagation();
                    const pd = tools.slice(0);
                    downGo(pd, pd.indexOf(props.tool));
                    startTransition(async () => {
                        return await buttonCommonSorting(props.sortingFor as listName, pd); // sortingFor 为 home 时进入不了 if
                    });
                }}>
                    <ArrowDownwardIcon />
                </IconButton>
            </MouseOverPopover>;
        }
    }
    return <></>;
}
