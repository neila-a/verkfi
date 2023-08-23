"use client";
import React, { Dispatch, SetStateAction } from 'react';
import { IconButton } from "@mui/material";
import { ArrowUpward as ArrowUpwardIcon } from "@mui/icons-material";
import { tool } from "./tools/info";
import setSetting from "./setting/setSetting";
import upGo from "./components/arrayMove/upGo";

export function UpButton(props: {
    editMode: boolean;
    setTools: Dispatch<SetStateAction<tool[]>>;
    tool: tool;
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
                    setSetting("toolslist", "工具列表", JSON.stringify(pd.map(toolp => toolp.to)));
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
