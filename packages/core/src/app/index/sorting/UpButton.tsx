"use client";
import {
    ArrowUpward as ArrowUpwardIcon
} from "@mui/icons-material";
import {
    IconButton
} from "@mui/material";
import MouseOverPopover from "components/Popover";
import upGo from "components/arrayMove/upGo";
import {
    setState
} from 'declare';
import {
    get
} from "react-intl-universal";
import {
    tool
} from "tools/info";
import useButtonCommonSorting from './buttonCommonSorting';
export default function UpButton(props: {
    editMode: boolean;
    setTools: setState<tool[]>;
    tool: tool;
    sortingFor: string;
}): JSX.Element {
    const buttonCommonSorting = useButtonCommonSorting();
    if (props.editMode && props.sortingFor !== "__home__") {
        return (
            <MouseOverPopover text={get("index.moveup")}>
                <IconButton color="inherit" size="large" edge="end" onClick={event => {
                    event.stopPropagation();
                    props.setTools(draft => {
                        const pd = draft.slice(0);
                        upGo(pd, pd.indexOf(props.tool));
                        buttonCommonSorting(props.sortingFor, pd);
                        return pd;
                    });
                }} aria-label={get("index.moveup")} >
                    <ArrowUpwardIcon />
                </IconButton>
            </MouseOverPopover>
        );
    } else {
        return null;
    }
}
