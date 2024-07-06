"use client";
import {
    Add as AddIcon,
    ArrowBackIos as ArrowBackIosIcon,
    ArrowForwardIos as ArrowForwardIosIcon
} from "@mui/icons-material";
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    IconButton
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import dynamic from "next/dynamic";
import {
    useContext
} from "react";
import {
    get
} from "react-intl-universal";
import SwitchEditMode from "./SwitchEditMode";
import SwitchViewMode from "./SwitchViewMode";
import {
    useAtom,
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    editModeAtom,
    editingAtom,
    expandAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
import {
    categoryDialogOpenAtom
} from "@verkfi/shared/atoms/category";
const EditCategoryDialog = dynamic(() => import("../selects/EditCategoryDialog"));
export default function Buttons() {
    const editing = useAtomValue(editingAtom),
        [expand, setExpand] = useAtom(expandAtom),
        editMode = useAtomValue(editModeAtom),
        setDialogOpen = useSetAtom(categoryDialogOpenAtom),
        isImplant = useContext(isImplantContext);
    return (
        <Box sx={{
            position: "absolute",
            bottom: 0,
            width: "100%"
        }}>
            {editMode && <Button onClick={event => {
                setDialogOpen(true);
            }} startIcon={<AddIcon />}>
                {get("category.添加分类")}
            </Button>}
            <Divider
                sx={{
                    opacity: "0.6"
                }} />
            <ButtonGroup variant="outlined" sx={{
                display: "flex",
                justifyContent: "center"
            }}>
                <SwitchViewMode />
                {editing && <SwitchEditMode />}
                {isImplant && <MouseOverPopover text={expand ? get("window.collapse") : get("window.expand")}>
                    <IconButton color="primary" sx={{
                        p: 1
                    }} onClick={event => {
                        setExpand(!expand);
                    }} aria-label={expand ? get("window.collapse") : get("window.expand")}>
                        {expand ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                </MouseOverPopover>}
            </ButtonGroup>
            <EditCategoryDialog
                left={[]}
            />
        </Box>
    );
}
