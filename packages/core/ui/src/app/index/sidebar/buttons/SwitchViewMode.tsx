"use client";
import {
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon
} from "@mui/icons-material";
import {
    IconButton
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    useAtom
} from "jotai";
import {
    viewModeAtom
} from "@verkfi/shared/atoms";
import {
    startTransition
} from "react";
export default function SwitchViewMode() {
    const [viewMode, setViewMode] = useAtom(viewModeAtom);
    return (
        <MouseOverPopover text={viewMode === "grid" ? "切换为列表模式" : "切换为网格模式"}>
            <IconButton color="primary" sx={{
                p: 1
            }} aria-label={viewMode === "grid" ? "切换为列表模式" : "切换为网格模式"} onClick={event => {
                return startTransition(async () => await setViewMode("swap"));
            }}>
                {viewMode === "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
            </IconButton>
        </MouseOverPopover>
    );
}
