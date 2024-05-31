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
    setState
} from "declare";
import {
    get
} from "react-intl-universal";
import {
    tool
} from "tools/info";
import useButtonCommonSorting from "./buttonCommonSorting";
import {
    useAtom
} from "jotai";
import {
    editModeAtom,
    toolsAtom
} from "index/atoms";
export default function UpButton(props: {
    tool: tool;
    sortingFor: string;
}): JSX.Element {
    const buttonCommonSorting = useButtonCommonSorting(),
        [editMode] = useAtom(editModeAtom),
        [tools, setTools] = useAtom(toolsAtom);
    if (editMode && props.sortingFor !== "__home__") {
        return (
            <MouseOverPopover text={get("index.moveup")}>
                <IconButton color="inherit" size="large" edge="end" onClick={event => {
                    event.stopPropagation();
                    const pd = tools.slice(0);
                    upGo(pd, pd.indexOf(props.tool));
                    buttonCommonSorting(props.sortingFor, pd);
                    setTools("refresh");
                }} aria-label={get("index.moveup")} >
                    <ArrowUpwardIcon />
                </IconButton>
            </MouseOverPopover>
        );
    }
    return null;
}
