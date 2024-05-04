"use client";
import {
    Edit as EditIcon,
    EditOff as EditOffIcon
} from "@mui/icons-material";
import {
    IconButton
} from "@mui/material";
import MouseOverPopover from "components/Popover";
import {
    setState
} from "declare";
import {
    editModeAtom
} from "index/atoms";
import {
    useAtom
} from "jotai";
export default function SwitchEditMode() {
    const [editMode, setEditMode] = useAtom(editModeAtom);
    return (
        <MouseOverPopover text={editMode ? "关闭编辑模式" : "切换编辑模式"}>
            <IconButton color="primary" sx={{
                p: 1
            }} aria-label={editMode ? "关闭编辑模式" : "切换编辑模式"} onClick={event => {
                setEditMode(old => !old);
            }}>
                {editMode ? <EditOffIcon /> : <EditIcon />}
            </IconButton>
        </MouseOverPopover>
    );
}
