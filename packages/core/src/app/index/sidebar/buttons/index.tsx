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
import MouseOverPopover from "components/Popover";
import {
    setState
} from "declare";
import {
    viewMode as viewModeAtom
} from "layout/layoutClient";
import dynamic from "next/dynamic";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import SwitchEditMode from "./SwitchEditMode";
import SwitchViewMode from "./SwitchViewMode";
const EditToolsListDialog = dynamic(() => import("../selects/EditToolsListDialog"));
export default function Buttons(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
    editMode: boolean;
    setEditMode: setState<boolean>;
    editing: boolean;
    expand: boolean;
    setExpand: setState<boolean>;
}) {
    const {
            editMode,
            setEditMode,
            editing
        } = props,
        [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogTools, setDialogTools] = useState<string[]>([]),
        [dialogListName, setDialogListName] = useState<string>("");
    return (
        <Box sx={{
            position: "absolute",
            bottom: 0,
            width: "100%"
        }}>
            {editMode && (
                <Button onClick={event => {
                    setDialogOpen(true);
                }} startIcon={<AddIcon />}>
                    {get("category.添加分类")}
                </Button>
            )}
            <Divider />
            <ButtonGroup variant="outlined" sx={{
                display: "flex",
                justifyContent: "center"
            }}>
                <SwitchViewMode />
                {editing && (
                    <SwitchEditMode editMode={editMode} setEditMode={setEditMode} />
                )}
                {props.isImplant && (
                    <MouseOverPopover text={props.expand ? get("window.collapse") : get("window.expand")}>
                        <IconButton color="primary" sx={{
                            p: 1
                        }} onClick={event => {
                            props.setExpand(!props.expand);
                        }} aria-label={props.expand ? get("window.collapse") : get("window.expand")}>
                            {props.expand ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                        </IconButton>
                    </MouseOverPopover>
                )}
            </ButtonGroup>
            <EditToolsListDialog
                open={dialogOpen}
                dialogTools={dialogTools}
                setRemoveDialogOpen={setDialogOpen}
                setDialogTools={setDialogTools}
                dialogListName={dialogListName}
                setDialogListName={setDialogListName}
                setDialogOpen={setDialogOpen}
                left={[]}
            />
        </Box>
    );
}
