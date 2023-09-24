"use client";
import {
    Divider,
    ButtonGroup,
    Button
} from "@mui/material";
import {
    setState
} from '../declare';
import {
    viewMode
} from './consts';
import SwitchEditMode from "./SwitchEditMode";
import SwitchViewMode from "./SwitchViewMode";
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
    viewMode: viewMode;
    setViewMode: setState<viewMode>;
    editMode: boolean;
    setEditMode: setState<boolean>;
    editing: boolean;
    setList: setState<lists>;
}) {
    const {
        viewMode,
        setViewMode,
        editMode,
        setEditMode,
        editing
    } = props;
    var [dialogOpen, setDialogOpen] = useState<boolean>(false),
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
                {I18N.get("添加工具列表")}
            </Button>}
            <Divider />
            <ButtonGroup variant="outlined" sx={{
                display: "flex",
                justifyContent: "center",
            }}>
                <SwitchViewMode viewMode={viewMode} setViewMode={setViewMode} />
                {editing && <SwitchEditMode editMode={editMode} setEditMode={setEditMode} />}
            </ButtonGroup>
            {dialogOpen && <EditToolsListDialog
                dialogTools={dialogTools}
                setRemoveDialogOpen={setDialogOpen}
                setDialogTools={setDialogTools}
                dialogListName={dialogListName}
                setDialogListName={setDialogListName}
                setDialogOpen={setDialogOpen}
                setList={props.setList}
                left={[]}
            />}
        </div>
    );
}
