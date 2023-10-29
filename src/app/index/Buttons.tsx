"use client";
import {
    Divider,
    ButtonGroup,
    Button,
    IconButton
} from "@mui/material";
import {
    setState
} from '../declare';
import {
    viewMode
} from './consts';
import SwitchEditMode from "./SwitchEditMode";
import SwitchViewMode from "./SwitchViewMode";
import {
    ArrowBackIos as ArrowBackIosIcon,
    ArrowForwardIos as ArrowForwardIosIcon
} from "@mui/icons-material";
import I18N from "react-intl-universal";
import {
    Add as AddIcon
} from "@mui/icons-material";
import {
    useState
} from "react";
import {
    lists
} from "./Sidebar";
import dynamic from 'next/dynamic';
const EditToolsListDialog = dynamic(() => import("./EditToolsListDialog"));
export default function Buttons(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
    viewMode: viewMode;
    setViewMode: setState<viewMode>;
    editMode: boolean;
    setEditMode: setState<boolean>;
    editing: boolean;
    setList: setState<lists>;
    expand: boolean;
    setExpand: setState<boolean>;
}) {
    const {
        viewMode,
        setViewMode,
        editMode,
        setEditMode,
        editing
    } = props;
    const [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogTools, setDialogTools] = useState<string[]>([]),
        [dialogListName, setDialogListName] = useState<string>("");
    return (
        <div style={{
            position: "absolute",
            bottom: "0px",
            width: "100%"
        }}>
            {editMode && <Button onClick={event => {
                setDialogOpen(true);
            }} startIcon={<AddIcon />}>
                {I18N.get("添加分类")}
            </Button>}
            <Divider />
            <ButtonGroup variant="outlined" sx={{
                display: "flex",
                justifyContent: "center",
            }}>
                <SwitchViewMode viewMode={viewMode} setViewMode={setViewMode} />
                {editing && <SwitchEditMode editMode={editMode} setEditMode={setEditMode} />}
                {props.isImplant && (<IconButton color="primary" sx={{
                    p: '10px'
                }} aria-label="directions" onClick={event => {
                    props.setExpand(!props.expand);
                }}>
                    {props.expand ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
                </IconButton>)}
            </ButtonGroup>
            <EditToolsListDialog
                open={dialogOpen}
                dialogTools={dialogTools}
                setRemoveDialogOpen={setDialogOpen}
                setDialogTools={setDialogTools}
                dialogListName={dialogListName}
                setDialogListName={setDialogListName}
                setDialogOpen={setDialogOpen}
                setList={props.setList}
                left={[]}
            />
        </div>
    );
}
