"use client";
import React from 'react';
import {
    IconButton
} from "@mui/material";
import {
    ArrowUpward as ArrowUpwardIcon
} from "@mui/icons-material";
import {
    tool
} from "../tools/info";
import setSetting from "../setting/setSetting";
import upGo from "../components/arrayMove/upGo";
import {
    setState
} from '../declare';
import buttonCommonSorting from './buttonCommonSorting';
export default function UpButton(props: {
    editMode: boolean;
    setTools: setState<tool[]>;
    tool: tool;
    sortingFor: string;
}): JSX.Element {
    if (props.editMode) {
        return (
            <IconButton size="large" edge="end" color="inherit" aria-label="menu" sx={{
                mr: 2
            }} onClick={event => {
                event.stopPropagation();
                props.setTools(draft => {
                    var pd = draft.slice(0);
                    upGo(pd, pd.indexOf(props.tool));
                    buttonCommonSorting(props.sortingFor, pd);
                    return pd;
                });
            }}>
                <ArrowUpwardIcon />
            </IconButton>
        );
    } else {
        return <></>;
    }
}
