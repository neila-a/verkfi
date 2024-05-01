"use client";
import {
    ArrowDownward as ArrowDownwardIcon
} from "@mui/icons-material";
import {
    IconButton
} from "@mui/material";
import MouseOverPopover from "components/Popover";
import downGo from "components/arrayMove/downGo";
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
export default function DownButton(props: {
    editMode: boolean;
    setTools: setState<tool[]>;
    tool: tool;
    sortingFor: string;
}): JSX.Element {
    const buttonCommonSorting = useButtonCommonSorting();
    if (props.editMode && props.sortingFor !== "__home__") {
        return (
            <MouseOverPopover text={get("index.movedown")}>
                <IconButton size="large" edge="start" color="inherit" aria-label={get("index.movedown")} onClick={event => {
                    event.stopPropagation();
                    props.setTools(draft => {
                        const pd = draft.slice(0);
                        downGo(pd, pd.indexOf(props.tool));
                        buttonCommonSorting(props.sortingFor, pd);
                        return pd;
                    });
                }}>
                    <ArrowDownwardIcon />
                </IconButton>
            </MouseOverPopover>
        );
    } else {
        return <></>;
    }
}
