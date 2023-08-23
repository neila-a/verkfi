"use client";
import React, { Dispatch, SetStateAction } from 'react';
import { IconButton } from "@mui/material";
import { ArrowDownward as ArrowDownwardIcon } from "@mui/icons-material";
import { tool } from "./tools/info";
import setSetting from "./setting/setSetting";
import downGo from "./components/arrayMove/downGo";

export function DownButton(props: {
    editMode: boolean;
    setTools: Dispatch<SetStateAction<tool[]>>;
    tool: tool;
}): JSX.Element {
    if (props.editMode) {
        return (
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{
                mr: 2
            }} onClick={event => {
                event.stopPropagation();
                props.setTools(draft => {
                    var pd = draft.slice(0);
                    downGo(pd, pd.indexOf(props.tool));
                    setSetting("toolslist", "工具列表", JSON.stringify(pd.map(toolp => toolp.to)));
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
