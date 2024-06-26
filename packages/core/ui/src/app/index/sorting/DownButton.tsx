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
    toolsAtom
} from "index/atoms";
import {
    useResetAtom
} from "jotai/utils";
import {
    buttonCommonSorterAtom
} from "@verkfi/shared/atoms";
import {
    startTransition
} from "react";
export default function DownButton(props: {
    tool: tool;
    sortingFor: string;
}) {
    const buttonCommonSorting = useSetAtom(buttonCommonSorterAtom),
        editMode = useAtomValue(editModeAtom),
        tools = useAtomValue(toolsAtom);
    if (editMode && props.sortingFor !== "__home__") {
        return (
            <MouseOverPopover text={get("index.movedown")}>
                <IconButton size="large" edge="start" color="inherit" aria-label={get("index.movedown")} onClick={event => {
                    event.stopPropagation();
                    const pd = tools.slice(0);
                    downGo(pd, pd.indexOf(props.tool));
                    startTransition(async () => {
                        return await buttonCommonSorting(props.sortingFor, pd);
                    });
                }}>
                    <ArrowDownwardIcon />
                </IconButton>
            </MouseOverPopover>
        );
    }
    return <></>;
}
