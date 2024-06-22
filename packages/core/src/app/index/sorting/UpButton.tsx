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
    toolsAtom
} from "index/atoms";
import {
    useResetAtom
} from "jotai/utils";
import {
    buttonCommonSorterAtom
} from "@verkfi/shared/atoms";
export default function UpButton(props: {
    tool: tool;
    sortingFor: string;
}): JSX.Element {
    const buttonCommonSorting = useSetAtom(buttonCommonSorterAtom),
        editMode = useAtomValue(editModeAtom),
        tools = useAtomValue(toolsAtom),
        resetTools = useResetAtom(toolsAtom);
    if (editMode && props.sortingFor !== "__home__") {
        return (
            <MouseOverPopover text={get("index.moveup")}>
                <IconButton color="inherit" size="large" edge="end" onClick={event => {
                    event.stopPropagation();
                    const pd = tools.slice(0);
                    upGo(pd, pd.indexOf(props.tool));
                    buttonCommonSorting(props.sortingFor, pd);
                    resetTools();
                }} aria-label={get("index.moveup")} >
                    <ArrowUpwardIcon />
                </IconButton>
            </MouseOverPopover>
        );
    }
    return null;
}
