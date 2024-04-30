"use client";
import {
    IconButton
} from "@mui/material";
import {
    ViewModule as ViewModuleIcon,
    ViewList as ViewListIcon
} from "@mui/icons-material";
import MouseOverPopover from "components/Popover";
import {
    setState
} from 'declare';
import {
    viewMode
} from '../../consts';
export default function SwitchViewMode(props: {
    viewMode: viewMode;
    setViewMode: setState<viewMode>;
}) {
    const {
        viewMode,
        setViewMode
    } = props;
    return (
        <MouseOverPopover text={viewMode == "grid" ? "切换为列表模式" : "切换为网格模式"}>
            <IconButton color="primary" sx={{
                p: 1
            }} aria-label={viewMode == "grid" ? "切换为列表模式" : "切换为网格模式"} onClick={_event => {
                switch (viewMode) {
                    case "grid":
                        setViewMode("list");
                        break;
                    case "list":
                        setViewMode("grid");
                        break;
                };
            }}>
                {viewMode == "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
            </IconButton>
        </MouseOverPopover>
    );
}
