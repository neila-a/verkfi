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
    homeListSymbol,
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
    if (editMode && props.sortingFor !== homeListSymbol) {
        return (
            <MouseOverPopover text={get("index.moveup")}>
                <IconButton color="inherit" size="large" edge="end" onClick={event => {
                    event.stopPropagation();
                    const pd = tools.slice(0);
                    upGo(pd, pd.indexOf(props.tool));
                    startTransition(async () => await buttonCommonSorting(props.sortingFor, pd));
                }} aria-label={get("index.moveup")} >
                    <ArrowUpwardIcon />
                </IconButton>
            </MouseOverPopover>
        );
    }
    return null;
}
