"use client";
import {
    Divider,
    ButtonGroup
} from "@mui/material";
import {
    setState
} from '../declare';
import {
    viewMode
} from '../page';
import SwitchEditMode from "./SwitchEditMode";
import SwitchViewMode from "./SwitchViewMode";
export default function Buttons(props: {
    viewMode: viewMode;
    setViewMode: setState<viewMode>;
    editMode: boolean;
    setEditMode: setState<boolean>;
    searchText: string;
}) {
    const {
        viewMode,
        setViewMode,
        editMode,
        setEditMode,
        searchText
    } = props;
    return (
        <div style={{
            position: "absolute",
            bottom: "0px",
            width: "inherit"
        }}>
            <Divider />
            <ButtonGroup variant="outlined" sx={{
                display: "flex",
                justifyContent: "center",
            }}>
                <SwitchViewMode viewMode={viewMode} setViewMode={setViewMode} />
                {searchText == "" && <SwitchEditMode editMode={editMode} setEditMode={setEditMode} />}
            </ButtonGroup>
        </div>
    );
}
