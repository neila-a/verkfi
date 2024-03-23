"use client";
import {
    IconButton
} from "@mui/material";
import {
    ArrowDownward as ArrowDownwardIcon
} from "@mui/icons-material";
import {
    tool
} from "../tools/info";
import downGo from "../components/arrayMove/downGo";
import {
    setState
} from '../declare';
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
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{
                mr: 2
            }} onClick={event => {
                event.stopPropagation();
                props.setTools(draft => {
                    var pd = draft.slice(0);
                    downGo(pd, pd.indexOf(props.tool));
                    buttonCommonSorting(props.sortingFor, pd);
                    return pd;
                });
            }}>
                <ArrowDownwardIcon />
            </IconButton>
        );
    } else {
        return <></>;
    }
}
