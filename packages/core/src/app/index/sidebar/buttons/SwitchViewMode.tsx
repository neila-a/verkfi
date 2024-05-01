"use client";
import {
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon
} from "@mui/icons-material";
import {
    IconButton
} from "@mui/material";
import MouseOverPopover from "components/Popover";
import {
    useAtom
} from "jotai";
import {
    viewMode as viewModeAtom
} from "layout/layoutClient";
export default function SwitchViewMode() {
    const [viewMode, setViewMode] = useAtom(viewModeAtom);
    return (
        <MouseOverPopover text={viewMode === "grid" ? "切换为列表模式" : "切换为网格模式"}>
            <IconButton color="primary" sx={{
                p: 1
            }} aria-label={viewMode === "grid" ? "切换为列表模式" : "切换为网格模式"} onClick={_event => {
                switch (viewMode) {
                    case "grid":
                        setViewMode("list");
                        break;
                    case "list":
                        setViewMode("grid");
                        break;
                }
            }}>
                {viewMode === "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
            </IconButton>
        </MouseOverPopover>
    );
}
