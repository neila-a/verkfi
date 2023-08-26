"use client";
import {
    IconButton
} from "@mui/material";
import {
    Edit as EditIcon,
    EditOff as EditOffIcon
} from "@mui/icons-material";
import MouseOverPopover from "../components/Popover";
import {
    setState
} from '../declare';
export default function SwitchEditMode(props: {
    editMode: boolean;
    setEditMode: setState<boolean>;
}) {
    const {
        editMode, setEditMode
    } = props;
    return <MouseOverPopover text={editMode ? "关闭编辑模式" : "切换编辑模式"}>
        <IconButton color="primary" sx={{
            p: '10px'
        }} aria-label="directions" onClick={event => {
            switch (editMode) {
                case true:
                    setEditMode(false);
                    break;
                case false:
                    setEditMode(true);
                    break;
            }
        }}>
            {editMode ? <EditOffIcon /> : <EditIcon />}
        </IconButton>
    </MouseOverPopover>;
}
