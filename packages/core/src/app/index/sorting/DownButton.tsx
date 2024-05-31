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
export default function DownButton(props: {
    tool: tool;
    sortingFor: string;
}): JSX.Element {
    const buttonCommonSorting = useButtonCommonSorting(),
        [editMode] = useAtom(editModeAtom),
        [tools, setTools] = useAtom(toolsAtom);
    if (editMode && props.sortingFor !== "__home__") {
        return (
            <MouseOverPopover text={get("index.movedown")}>
                <IconButton size="large" edge="start" color="inherit" aria-label={get("index.movedown")} onClick={event => {
                    event.stopPropagation();
                    const pd = tools.slice(0);
                    downGo(pd, pd.indexOf(props.tool));
                    buttonCommonSorting(props.sortingFor, pd);
                    setTools("refresh");
                }}>
                    <ArrowDownwardIcon />
                </IconButton>
            </MouseOverPopover>
        );
    }
    return <></>;
}
