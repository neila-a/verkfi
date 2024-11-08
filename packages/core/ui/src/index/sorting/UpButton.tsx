"use client";
import {
    ArrowUpward as ArrowUpwardIcon
} from "@mui/icons-material";
import {
    IconButton
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import upGo from "@verkfi/shared/arrayMove/upGo";
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
export default function UpButton(props: {
    tool: tool;
    sortingFor: sorting;
}) {
    const buttonCommonSorting = useSetAtom(buttonCommonSorterAtom),
        editMode = useAtomValue(editModeAtom),
        tools = useAtomValue(toolsAtom);
    if (props.sortingFor !== homeList) {
        if (editMode) {
            return <MouseOverPopover text={get("index.moveup")}>
                <IconButton color="inherit" size="large" edge="end" onClick={event => {
                    event.stopPropagation();
                    const pd = tools.slice(0);
                    upGo(pd, pd.indexOf(props.tool));
                    startTransition(async () => await buttonCommonSorting(props.sortingFor as listName, pd)); // sortingFor 为 home 时进入不了 if
                }} aria-label={get("index.moveup")}>
                    <ArrowUpwardIcon />
                </IconButton>
            </MouseOverPopover>;
        }
    }
    return null;
}
